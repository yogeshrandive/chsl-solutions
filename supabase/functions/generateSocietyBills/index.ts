// deno-lint-ignore-file no-explicit-any
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import {
  createClient,
  SupabaseClient,
} from "https://esm.sh/@supabase/supabase-js@2";
import moment from "https://deno.land/x/momentjs@2.29.1-deno/mod.ts";

import { societyBillStatus } from "./schema/constant.ts";
import {
  Member,
  MemberBill,
  Society,
  SocietyBill,
} from "./schema/interfaces.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
  );

  const inputData = await req.json();
  console.log("Input data:", inputData);

  try {
    await processSocietyBill(supabase, inputData.record.id);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.log(error);

    await supabase
      .from("society_bills")
      .update({
        status: societyBillStatus.ERROR,
      })
      .eq("id", inputData.record.id);

    return new Response(JSON.stringify({ error: (error as Error).message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 400,
    });
  }
});

async function processSocietyBill(
  supabase: SupabaseClient,
  societyBillId: number,
) {
  // 1. Get the society bill details
  const { data: societyBill, error: societyBillError } = await supabase
    .from("society_bills")
    .select("*")
    .eq("id", societyBillId)
    .single();

  console.log("societyBill::", societyBill);

  if (societyBillError) {
    throw new Error(`Error fetching society bill: ${societyBillError.message}`);
  }
  if (!societyBill) throw new Error("Society bill not found");
  if (societyBill.status !== "pending") {
    throw new Error("Society bill is not in pending status");
  }

  // 2. Get the society details
  const { data: society, error: societyError } = await supabase
    .from("societies")
    .select("*")
    .eq("id", societyBill.id_society)
    .single();

  console.log("SocietyData:", society);
  if (societyError) {
    throw new Error(`Error fetching society: ${societyError.message}`);
  }
  if (!society) throw new Error("Society not found");
  if (society.status !== "active") throw new Error("Society is not active");

  // 3. Get all members with member heading details
  const { data: members, error: membersError } = await supabase
    .from("members")
    .select(`
      *,
      member_headings (*)
    `)
    .eq("id_society", society.id);

  console.log("members:", members);

  if (membersError) {
    throw new Error(`Error fetching members: ${membersError.message}`);
  }
  if (!members) throw new Error("No members found");

  // check if the society has any previous bill
  const previousBillLot = Number(societyBill.bill_lot) - 2;

  const { data: previousBillDetails, error: prevBillDetailsError } =
    await supabase
      .from("society_bills")
      .select("*")
      .eq("id_society", societyBill.id_society)
      .eq("bill_lot", previousBillLot)
      .select();

  console.log("previousBill", previousBillDetails);
  const previousBill = previousBillDetails ? previousBillDetails[0] : null;

  // 4. Generate member bill details
  let startBillNo = society.bill_no;

  for (const member of members) {
    // check if the isInititalBill
    let newPrincipalArrears = 0;
    let newInterestArrears = 0;
    let newInterestAmount = 0;

    if (previousBill == null) {
      // lets create the bill directly
      newPrincipalArrears = member.principle_op_balance;
      newInterestArrears = member.interest_op_balance;
    } else {
      const { data: memberPrevBill, error: memberPrevBillError } =
        await supabase
          .from("member_bills")
          .select(` * `)
          .eq("id_member", member.id)
          .eq("bill_lot", previousBillLot)
          .limit(1)
          .single();

      if (memberPrevBillError) throw Error(memberPrevBillError.message);
      console.log("memberPrevBill", memberPrevBill);

      const prevPrincipleArrears = memberPrevBill?.principle_arrears || 0;
      const previnterestArrears = memberPrevBill?.interest_arrears || 0;

      console.log("prevPrincipleArrears:", prevPrincipleArrears);
      console.log("previnterestArrears:", previnterestArrears);

      const principal = prevPrincipleArrears + memberPrevBill.bill_amount;
      const interest = previnterestArrears + memberPrevBill.interest_amount;

      console.log("principal:", principal);
      console.log("interest:", interest);
      const paymentMadeBefore = parseFloat(
        memberPrevBill.payment_made.before_due_date,
      );
      const paymentMadeAfter = parseFloat(
        memberPrevBill.payment_made.after_due_date,
      );

      const totalPaymentMade = paymentMadeBefore + paymentMadeAfter;

      /** Interest Formula Start **/
      let newInterest = 0;
      let newPrinciple = 0;
      if (societyBill.credit_adj_first == "interest") {
        // This is for interest
        if (paymentMadeBefore > interest) {
          newInterest = 0;
          const remainingAmount = paymentMadeBefore - interest;
          newPrinciple = principal - remainingAmount;
        } else {
          newInterest = interest - paymentMadeBefore;
          newPrinciple = principal;
        }

        // This is for new arrears
        if (totalPaymentMade > interest) {
          newInterestArrears = 0;
          const remainingAmount = totalPaymentMade - interest;
          newPrincipalArrears = principal - remainingAmount;
        } else {
          newInterestArrears = interest - totalPaymentMade;
          newPrincipalArrears = principal;
        }
      } else {
        if (paymentMadeBefore > principal) {
          const remainingAmount = paymentMadeBefore - principal;
          if (remainingAmount > interest) {
            newPrinciple = principal - paymentMadeBefore - interest;
            newInterest = 0;
          } else {
            newInterest = interest - remainingAmount;
            newPrinciple = 0;
          }
        } else {
          newInterest = interest;
          newPrinciple = principal - paymentMadeBefore;
        }

        // This is new arrears
        if (totalPaymentMade > principal) {
          const remainingAmount = totalPaymentMade - principal;
          if (remainingAmount > interest) {
            newPrincipalArrears = principal - interest - totalPaymentMade;
            newInterestArrears = 0;
          } else {
            newInterestArrears = interest - remainingAmount;
            newPrincipalArrears = 0;
          }
        } else {
          newInterestArrears = interest;
          newPrincipalArrears = principal - totalPaymentMade;
        }
      }

      console.log("newInterest", newInterest);
      console.log("newPrinciple", newPrinciple);
      console.log("newInterestArrears", newInterestArrears);
      console.log("newPrincipalArrears", newPrincipalArrears);

      const lastBillDueDate = moment(previousBill.due_date);
      const currBillStartDate = moment(societyBill.bill_period_from);
      const totalDuedays = currBillStartDate.diff(lastBillDueDate, "days");

      console.log("totalDuedays", totalDuedays);
      let interestApplyAmount = 0;

      if (societyBill.interest_type === "simple") {
        interestApplyAmount = newPrinciple;
      } else if (society.interest_type === "compound") {
        interestApplyAmount = newPrinciple + newInterest;
      }
      console.log("interestApplyAmount", interestApplyAmount);

      // calcualte the interest
      if (interestApplyAmount > 0) {
        newInterestAmount = await calculateInterest(
          interestApplyAmount,
          societyBill.interest_period,
          societyBill.interest_rate,
          totalDuedays,
        );
      }
      /** Interest formula END**/
    } // else end

    console.log("newInterestAmount", newInterestAmount);

    // 4.4 Calculate current bill amount
    const currentBillAmount = member.member_headings.reduce(
      (sum: number, heading: { curr_amount: number }) =>
        sum + heading.curr_amount,
      0,
    );

    console.log("currentBillAmount", currentBillAmount);

    // 4.6 Generate the new bill
    const dueDate = societyBill.due_date;

    const newBill: MemberBill = {
      id_tenant: society.id_tenant,
      id_society: society.id,
      id_member: member.id,
      id_society_bill: societyBill.id,
      bill_lot: societyBill.bill_lot,
      bill_no: startBillNo,
      principle_arrears: parseFloat(newPrincipalArrears.toFixed(2)),
      interest_arrears: parseFloat(newInterestArrears.toFixed(2)),
      interest_amount: parseFloat(newInterestAmount.toFixed(2)),
      bill_amount: currentBillAmount,
      total_bill_amount: parseFloat(
        (currentBillAmount + newPrincipalArrears + newInterestArrears +
          newInterestAmount).toFixed(2),
      ),
      status: "pending",
      due_date: dueDate,
      payment_made: {
        before_due_date: 0,
        after_due_date: 0,
      },
    };

    console.log("newBill", newBill);

    const { data: insertedBill, error: insertError } = await supabase
      .from("member_bills")
      .insert(newBill)
      .select()
      .single();

    if (insertError) {
      throw new Error(`Error inserting member bill: ${insertError.message}`);
    }

    // 5. Create member bill heading details
    for (const heading of member.member_headings) {
      const { error: headingError } = await supabase
        .from("member_bill_headings")
        .insert({
          id_tenant: society.id_tenant,
          id_member: member.id,
          id_member_bill: insertedBill.id,
          id_society_heading: heading.id_society_heading,
          amount: heading.curr_amount,
        });

      if (headingError) {
        throw new Error(
          `Error inserting member bill heading: ${headingError.message}`,
        );
      }

      const { error: memberHeadingError } = await supabase
        .from("member_headings")
        .update({
          curr_amount: heading.next_amount,
          next_amount: heading.next_amount,
        })
        .eq("id", heading.id);

      if (memberHeadingError) {
        throw new Error(
          `Error updating member heading curr amount: ${memberHeadingError.message}`,
        );
      }
    }

    const { error: memberBillUpdateError } = await supabase
      .from("member_bills")
      .update({
        status: "success",
      })
      .eq("id", insertedBill.id);

    if (memberBillUpdateError) {
      throw new Error(
        `Error updating member: ${memberBillUpdateError.message}`,
      );
    }

    startBillNo++;
  } // END FOR LOOP

  // 6. Update the society bill status to success
  const { error: updateError } = await supabase
    .from("society_bills")
    .update({ status: "success" })
    .eq("id", societyBillId);

  if (updateError) {
    throw new Error(
      `Error updating society bill status: ${updateError.message}`,
    );
  }

  // 7. Update society details
  const curPeriodFrom = moment(society.cur_period_from);
  const billType = society.bill_frequency;
  const newCurPeriodFrom = calculateNextBillDate(curPeriodFrom, billType);
  const newCurPeriodTo = calculateNextBillDate(
    moment(newCurPeriodFrom),
    billType,
  ).subtract(1, "day");
  const newNextBillDate = calculateNextBillDate(
    moment(society.next_bill_date),
    billType,
  );

  const { error: societyUpdateError } = await supabase
    .from("societies")
    .update({
      bill_lot: society.bill_lot + 2,
      bill_no: startBillNo,
      next_bill_date: newNextBillDate.format("YYYY-MM-DD"),
      cur_period_from: newCurPeriodFrom.format("YYYY-MM-DD"),
      cur_period_to: newCurPeriodTo.format("YYYY-MM-DD"),
    })
    .eq("id", society.id);

  console.log("next_bill_date", newNextBillDate.format("YYYY-MM-DD"));
  console.log("cur_period_to", newCurPeriodTo.format("YYYY-MM-DD"));

  if (societyUpdateError) {
    throw new Error(`Error updating society: ${societyUpdateError.message}`);
  }
}

function calculateInterest(
  previousBalance: number,
  periodOfCalculation: string,
  interestRate: number,
  latePaymentDays: number,
) {
  console.log("inside interest formula ", {
    previousBalance,
    periodOfCalculation,
    interestRate,
    latePaymentDays,
  });
  let interestValue = 0;
  if (periodOfCalculation == "daily") {
    interestValue = ((previousBalance * interestRate / 100) / 365) *
      latePaymentDays;
  } else if (periodOfCalculation == "monthly") {
    interestValue = ((previousBalance * interestRate) / 100) / 12;
  } else if (periodOfCalculation == "bi-monthly") {
    interestValue = ((previousBalance * interestRate) / 100) / 6;
  } else if (periodOfCalculation == "quarterly") {
    interestValue = ((previousBalance * interestRate) / 100) / 4;
  } else if (periodOfCalculation == "half-yearly") {
    interestValue = ((previousBalance * interestRate) / 100) / 2;
  } else if (periodOfCalculation == "yearly") {
    interestValue = (previousBalance * interestRate) / 100;
  }

  return interestValue;
}

function calculateNextBillDate(
  curPeriodFrom: moment.Moment,
  billType: string,
): moment.Moment {
  switch (billType) {
    case "monthly":
      return curPeriodFrom.add(1, "month");
    case "bi-monthly":
      return curPeriodFrom.add(2, "months");
    case "quarterly":
      return curPeriodFrom.add(3, "months");
    case "half-yearly":
      return curPeriodFrom.add(6, "months");
    case "yearly":
      return curPeriodFrom.add(1, "year");
    default:
      throw new Error(`Invalid bill type: ${billType}`);
  }
}
