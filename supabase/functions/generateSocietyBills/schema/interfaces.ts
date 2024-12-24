export interface Society {
  id: number;
  id_tenant: number;
  status: string;
  credit_adj_first: string;
  interest_type: string;
  interest_rate: number;
  payment_due_date: number;
  bill_lot: number;
  bill_no: number;
  next_bill_date: string;
  cur_period_from: string;
  cur_period_to: string;
  bill_type: string;
  period_of_calculation: string;
}

export interface SocietyBill {
  id: number;
  id_society: number;
  status: string;
  bill_lot: number;
  bill_date: string;
  bill_period_from: string;
}

export interface Member {
  id: number;
  principal_arrears: number;
  interest_arrears: number;
  member_headings: MemberHeading[];
}

export interface MemberHeading {
  id: number;
  id_society_heading: number;
  curr_amount: number;
  next_amount: number;
}

export interface MemberBill {
  id_tenant: number;
  id_society: number;
  id_member: number;
  id_society_bill: number;
  bill_no: number;
  principle_arrears: number;
  interest_arrears: number;
  interest_amount: number;
  bill_amount: number;
  total_bill_amount: number;
  status: string;
  due_date: string;
  bill_lot: number;
  payment_made: {
    before_due_date: number;
    after_due_date: number;
  };
}
