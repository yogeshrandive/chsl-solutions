export type MemberHeading = {
  id: number;
  id_society_heading: number;
  code: string;
  name: string;
  curr_amount: number;
  next_amount: number;
};

export type SocietyHeading = {
  id: number;
  amount: number;
  society_account_master: {
    code: string;
    name: string;
  };
};
