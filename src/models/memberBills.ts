"use server";

import { createClient } from "@/utils/supabase/server";

export async function getMemberBillsByMemberId(memberId: number) {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("member_bills")
        .select(`*, society_bills(*), receipts(*)`)
        .eq("id_member", memberId)
        .order("created_at", { ascending: false });

    if (error) throw error;
    return data[0];
}
