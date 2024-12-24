import { serve } from "https://deno.land/std@0.140.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.4";
// Type for the bill record
interface BillRecord {
  id: number;
  id_society: number;
  bill_lot: string;
  bill_date: string;
  bill_period: string;
  due_date: string;
  bill_frequency: string;
  bill_type: string;
  interest_rate: number;
  interest_period: string;
  credit_adj_first: number;
  bill_no: string;
  status: string;
  created_at: string;
}

serve(async (req: Request) => {
  try {
    // Create Supabase client
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );
    // Get the request payload
    const payload: BillRecord = await req.json();

    // Check for existing bills
    const { data: existingBills, error: checkError } = await supabaseClient
      .from("society_bills")
      .select("id, bill_lot")
      .eq("id_society", payload.id_society)
      .eq("bill_lot", payload.bill_lot)
      .eq("status", "published");

    if (checkError) throw checkError;

    if (existingBills && existingBills.length > 0) {
      return new Response(
        JSON.stringify({
          error: "Bill already exists",
          details:
            `Bill lot ${payload.bill_lot} already exists for this society`,
        }),
        {
          headers: { "Content-Type": "application/json" },
          status: 400,
        },
      );
    }

    // Log the received data
    console.log("New bill generation requested:", {
      billLot: payload.bill_lot,
      billDate: payload.bill_date,
      billPeriod: payload.bill_period,
      dueDate: payload.due_date,
      billFrequency: payload.bill_frequency,
      billType: payload.bill_type,
      interestRate: payload.interest_rate,
      interestPeriod: payload.interest_period,
      creditAdjFirst: payload.credit_adj_first,
      billNo: payload.bill_no,
      status: payload.status,
    });
    // TODO: Add actual bill generation logic in next iteration
    return new Response(
      JSON.stringify({
        message: "Bill generation process initiated",
        data: payload,
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error in generateSocietyBills:", error);

    return new Response(
      JSON.stringify({
        error: "Internal Server Error",
        details: error.message,
      }),
      {
        headers: { "Content-Type": "application/json" },
        status: 500,
      },
    );
  }
});
