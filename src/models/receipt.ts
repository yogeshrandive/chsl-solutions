"use server";
import { Tables, TablesInsert } from "@/utils/supabase/database.types";
import { createClient } from "@/utils/supabase/server";
import moment from "moment";
import { revalidatePath } from "next/cache";

export type ReceiptWithMemberDetails = Tables<"receipts"> & {
    member_bills: {
        total_bill_amount: number;
        members: {
            full_name: string;
            flat_no: string;
        };
    };
};
export async function getReceiptsBySocietyId(societyId: number) {
    const supabase = await createClient();

    const { data: receipts, error } = await supabase
        .from("receipts")
        .select(`
            *,
            member_bills (
                total_bill_amount,
                members(
                    full_name,
                    flat_no
                )
            )
        `)
        .eq("id_society", societyId)
        .order("created_at", { ascending: false });

    if (error) {
        console.error("Error fetching receipts:", error);
        throw error;
    }

    return receipts;
}

export async function getReceiptById(id: string) {
    const supabase = await createClient();

    const { data: receipt, error } = await supabase
        .from("receipts")
        .select(`
            *,
            member_bills (
                total_bill_amount,
                members (   
                    full_name,
                    flat_no
                )
            )
            `)
        .eq("id", id)
        .single();

    if (error) {
        console.error("Error fetching receipt:", error);
        throw error;
    }

    return receipt;
}

export async function createReceiptInDb(
    data: TablesInsert<"receipts">,
    memberBill: Tables<"member_bills"> & {
        society_bills: {
            bill_frequency: string;
            bill_date: string;
            due_date: string;
            bill_lot: string;
            interest_period: string;
            credit_adj_first: boolean;
            bill_period_from: string;
            bill_period_to: string;
            interest_rate: number;
            interest_type: string;
        };
    },
    societyCode: string,
) {
    const supabase = await createClient();

    // Check if receipt date is before or equal to bill due date using moment
    const receiptDate = moment(data.receipt_date);
    const billDueDate = moment(memberBill.due_date);
    const billStartDate = moment(memberBill.society_bills.bill_period_from);

    // Initialize payment_made object if it doesn't exist
    const currentPaymentMade = memberBill.payment_made || {
        before_due_date: 0,
        after_due_date: 0,
    };

    // Update the appropriate payment_made field based on receipt date
    if (receiptDate.isSameOrBefore(billDueDate)) {
        memberBill.payment_made = {
            ...currentPaymentMade,
            before_due_date: Number(currentPaymentMade.before_due_date || 0) +
                Number(data.amount),
        };
    } else {
        memberBill.payment_made = {
            ...currentPaymentMade,
            after_due_date: Number(currentPaymentMade.after_due_date || 0) +
                Number(data.amount),
        };
    }

    /** Calculate the interest amount for the bill if the interest period is daily */
    let billInterestAmount = memberBill.interest_amount || 0;

    if (memberBill.society_bills.interest_period === "daily") {
        let interestCalculationAmount = 0;
        if (memberBill.society_bills.interest_type === "simple") {
            interestCalculationAmount = memberBill.principle_arrears;
        } else {
            interestCalculationAmount = memberBill.principle_arrears +
                memberBill.interest_arrears;
        }

        if (interestCalculationAmount > 0) {
            const dueDays = receiptDate.diff(billStartDate, "days") + 1;
            console.log("dueDays", dueDays);
            console.log("receiptDate", receiptDate);
            console.log("billStartDate", billStartDate);
            const dailyInterest = (interestCalculationAmount *
                (memberBill.society_bills.interest_rate / 100)) / 365;
            const interestAmount = parseFloat(
                (dueDays * dailyInterest).toFixed(2),
            );
            billInterestAmount = parseFloat(
                (interestAmount + billInterestAmount).toFixed(2),
            );
        }
    }

    // Update member bill with new payment info
    const { error: billError } = await supabase
        .from("member_bills")
        .update({
            payment_made: memberBill.payment_made,
            interest_amount: billInterestAmount,
        })
        .eq("id", memberBill.id);

    if (billError) {
        console.error("Error updating member bill payment:", billError);
        throw billError;
    }
    const { error } = await supabase.from("receipts")
        .insert({
            ...data,
            id_society: data.id_society,
            id_tenant: data.id_tenant,
        });

    if (error) {
        console.error("Error creating receipt:", error);
        throw error;
    }

    // Increment society receipt number
    const { error: societyError } = await supabase
        .from("societies")
        .update({
            receipt_no: data.receipt_number + 1,
        })
        .eq("id", data.id_society);

    if (societyError) {
        console.error("Error updating society receipt number:", societyError);
        throw societyError;
    }

    revalidatePath(`/${societyCode}/receipts`);
}
