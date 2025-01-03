/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never;
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      graphql: {
        Args: {
          operationName?: string;
          query?: string;
          variables?: Json;
          extensions?: Json;
        };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
  public: {
    Tables: {
      city: {
        Row: {
          created_at: string | null;
          id: number;
          id_state: number;
          name: string;
        };
        Insert: {
          created_at?: string | null;
          id?: number;
          id_state: number;
          name: string;
        };
        Update: {
          created_at?: string | null;
          id?: number;
          id_state?: number;
          name?: string;
        };
        Relationships: [
          {
            foreignKeyName: "city_id_state_fkey";
            columns: ["id_state"];
            isOneToOne: false;
            referencedRelation: "state";
            referencedColumns: ["id"];
          },
        ];
      };
      global_heading_groups: {
        Row: {
          description: string | null;
          head: Database["public"]["Enums"]["account_heads"];
          id: number;
          id_parent: number | null;
          name: string;
        };
        Insert: {
          description?: string | null;
          head?: Database["public"]["Enums"]["account_heads"];
          id?: number;
          id_parent?: number | null;
          name: string;
        };
        Update: {
          description?: string | null;
          head?: Database["public"]["Enums"]["account_heads"];
          id?: number;
          id_parent?: number | null;
          name?: string;
        };
        Relationships: [
          {
            foreignKeyName: "global_heading_groups_id_parent_fkey";
            columns: ["id_parent"];
            isOneToOne: false;
            referencedRelation: "global_heading_groups";
            referencedColumns: ["id"];
          },
        ];
      };
      global_headings: {
        Row: {
          code: string;
          created_at: string;
          description: string | null;
          id: number;
          is_gst: boolean;
          is_interest: boolean;
          name: string;
        };
        Insert: {
          code: string;
          created_at?: string;
          description?: string | null;
          id?: number;
          is_gst?: boolean;
          is_interest?: boolean;
          name: string;
        };
        Update: {
          code?: string;
          created_at?: string;
          description?: string | null;
          id?: number;
          is_gst?: boolean;
          is_interest?: boolean;
          name?: string;
        };
        Relationships: [];
      };
      member_bill_headings: {
        Row: {
          amount: number;
          created_at: string;
          gst_amount: number;
          id: number;
          id_account_master: number | null;
          id_member: number;
          id_member_bill: number;
          id_society_heading: number;
          id_tenant: number;
          interest_amount: number;
        };
        Insert: {
          amount?: number;
          created_at?: string;
          gst_amount?: number;
          id?: number;
          id_account_master?: number | null;
          id_member: number;
          id_member_bill: number;
          id_society_heading: number;
          id_tenant: number;
          interest_amount?: number;
        };
        Update: {
          amount?: number;
          created_at?: string;
          gst_amount?: number;
          id?: number;
          id_account_master?: number | null;
          id_member?: number;
          id_member_bill?: number;
          id_society_heading?: number;
          id_tenant?: number;
          interest_amount?: number;
        };
        Relationships: [
          {
            foreignKeyName: "member_bill_headings_id_account_master_fkey";
            columns: ["id_account_master"];
            isOneToOne: false;
            referencedRelation: "society_account_master";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "member_bill_headings_id_member_bill_fkey";
            columns: ["id_member_bill"];
            isOneToOne: false;
            referencedRelation: "member_bills";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "member_bill_headings_id_member_fkey";
            columns: ["id_member"];
            isOneToOne: false;
            referencedRelation: "members";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "member_bill_headings_id_society_heading_fkey";
            columns: ["id_society_heading"];
            isOneToOne: false;
            referencedRelation: "society_headings";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "member_bill_headings_id_tenant_fkey";
            columns: ["id_tenant"];
            isOneToOne: false;
            referencedRelation: "tenants";
            referencedColumns: ["id"];
          },
        ];
      };
      member_bills: {
        Row: {
          arrears_free_amount: number;
          bill_amount: number;
          bill_lot: number;
          bill_no: number;
          created_at: string;
          due_date: string | null;
          id: number;
          id_member: number;
          id_society: number;
          id_society_bill: number | null;
          id_tenant: number;
          interest_amount: number;
          interest_arrears: number;
          payment_made: Json | null | any;
          principle_arrears: number;
          status: string | null;
          total_bill_amount: number;
          updated_at: string | null;
        };
        Insert: {
          arrears_free_amount?: number;
          bill_amount?: number;
          bill_lot: number;
          bill_no?: number;
          created_at?: string;
          due_date?: string | null;
          id?: number;
          id_member: number;
          id_society: number;
          id_society_bill?: number | null;
          id_tenant: number;
          interest_amount?: number;
          interest_arrears?: number;
          payment_made?: Json | null | any;
          principle_arrears?: number;
          status?: string | null;
          total_bill_amount?: number;
          updated_at?: string | null;
        };
        Update: {
          arrears_free_amount?: number;
          bill_amount?: number;
          bill_lot?: number;
          bill_no?: number;
          created_at?: string;
          due_date?: string | null;
          id?: number;
          id_member?: number;
          id_society?: number;
          id_society_bill?: number | null;
          id_tenant?: number;
          interest_amount?: number;
          interest_arrears?: number;
          payment_made?: Json | null | any;
          principle_arrears?: number;
          status?: string | null;
          total_bill_amount?: number;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "member_bills_id_member_fkey";
            columns: ["id_member"];
            isOneToOne: false;
            referencedRelation: "members";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "member_bills_id_society_bill_fkey";
            columns: ["id_society_bill"];
            isOneToOne: false;
            referencedRelation: "society_bills";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "member_bills_id_society_fkey";
            columns: ["id_society"];
            isOneToOne: false;
            referencedRelation: "societies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "member_bills_id_tenant_fkey";
            columns: ["id_tenant"];
            isOneToOne: false;
            referencedRelation: "tenants";
            referencedColumns: ["id"];
          },
        ];
      };
      member_headings: {
        Row: {
          created_at: string;
          curr_amount: number;
          id: number;
          id_member: number;
          id_society_heading: number | null;
          next_amount: number;
        };
        Insert: {
          created_at?: string;
          curr_amount?: number;
          id?: number;
          id_member: number;
          id_society_heading?: number | null;
          next_amount?: number;
        };
        Update: {
          created_at?: string;
          curr_amount?: number;
          id?: number;
          id_member?: number;
          id_society_heading?: number | null;
          next_amount?: number;
        };
        Relationships: [
          {
            foreignKeyName: "member_headings_id_member_fkey";
            columns: ["id_member"];
            isOneToOne: false;
            referencedRelation: "members";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "member_headings_id_society_heading_fkey";
            columns: ["id_society_heading"];
            isOneToOne: false;
            referencedRelation: "society_headings";
            referencedColumns: ["id"];
          },
        ];
      };
      member_types: {
        Row: {
          id: number;
          name: string;
        };
        Insert: {
          id?: number;
          name: string;
        };
        Update: {
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      members: {
        Row: {
          aadhaar_no: string | null;
          add_premise: string | null;
          area: number | null;
          area_unit: string;
          assoc_mobile: string | null;
          assoc_name: string | null;
          build_name: string | null;
          code: string;
          created_at: string;
          email: string | null;
          flat_no: string | null;
          full_name: string;
          id: number;
          id_member_type: number;
          id_society: number;
          id_tenant: number;
          interest_free_arrears: number;
          interest_op_balance: number;
          mobile: string;
          pan_no: string | null;
          premise_type: string | null;
          premise_unit_type: string | null;
          principle_op_balance: number;
          salutation: string | null;
          status: string;
          step: number;
        };
        Insert: {
          aadhaar_no?: string | null;
          add_premise?: string | null;
          area?: number | null;
          area_unit?: string;
          assoc_mobile?: string | null;
          assoc_name?: string | null;
          build_name?: string | null;
          code: string;
          created_at?: string;
          email?: string | null;
          flat_no?: string | null;
          full_name: string;
          id?: number;
          id_member_type?: number;
          id_society: number;
          id_tenant: number;
          interest_free_arrears?: number;
          interest_op_balance?: number;
          mobile: string;
          pan_no?: string | null;
          premise_type?: string | null;
          premise_unit_type?: string | null;
          principle_op_balance?: number;
          salutation?: string | null;
          status?: string;
          step?: number;
        };
        Update: {
          aadhaar_no?: string | null;
          add_premise?: string | null;
          area?: number | null;
          area_unit?: string;
          assoc_mobile?: string | null;
          assoc_name?: string | null;
          build_name?: string | null;
          code?: string;
          created_at?: string;
          email?: string | null;
          flat_no?: string | null;
          full_name?: string;
          id?: number;
          id_member_type?: number;
          id_society?: number;
          id_tenant?: number;
          interest_free_arrears?: number;
          interest_op_balance?: number;
          mobile?: string;
          pan_no?: string | null;
          premise_type?: string | null;
          premise_unit_type?: string | null;
          principle_op_balance?: number;
          salutation?: string | null;
          status?: string;
          step?: number;
        };
        Relationships: [
          {
            foreignKeyName: "members_id_society_fkey";
            columns: ["id_society"];
            isOneToOne: false;
            referencedRelation: "societies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "members_id_tenant_fkey";
            columns: ["id_tenant"];
            isOneToOne: false;
            referencedRelation: "tenants";
            referencedColumns: ["id"];
          },
        ];
      };
      receipts: {
        Row: {
          amount: number;
          created_at: string;
          id: number;
          id_book_master: number;
          id_member_bill: number;
          id_society: number;
          id_tenant: number;
          mode_bank_name: string | null;
          mode_of_payment: Database["public"]["Enums"]["mode_of_payment"];
          mode_txn_date: string;
          mode_txn_no: string | null;
          notes: string | null;
          receipt_date: string;
          receipt_number: number;
        };
        Insert: {
          amount: number;
          created_at?: string;
          id?: number;
          id_book_master: number;
          id_member_bill: number;
          id_society: number;
          id_tenant: number;
          mode_bank_name?: string | null;
          mode_of_payment: Database["public"]["Enums"]["mode_of_payment"];
          mode_txn_date: string;
          mode_txn_no?: string | null;
          notes?: string | null;
          receipt_date: string;
          receipt_number: number;
        };
        Update: {
          amount?: number;
          created_at?: string;
          id?: number;
          id_book_master?: number;
          id_member_bill?: number;
          id_society?: number;
          id_tenant?: number;
          mode_bank_name?: string | null;
          mode_of_payment?: Database["public"]["Enums"]["mode_of_payment"];
          mode_txn_date?: string;
          mode_txn_no?: string | null;
          notes?: string | null;
          receipt_date?: string;
          receipt_number?: number;
        };
        Relationships: [
          {
            foreignKeyName: "receipts_id_book_master_fkey";
            columns: ["id_book_master"];
            isOneToOne: false;
            referencedRelation: "society_book_master";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "receipts_id_member_bill_fkey";
            columns: ["id_member_bill"];
            isOneToOne: false;
            referencedRelation: "member_bills";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "receipts_id_society_fkey";
            columns: ["id_society"];
            isOneToOne: false;
            referencedRelation: "societies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "receipts_id_tenant_fkey";
            columns: ["id_tenant"];
            isOneToOne: false;
            referencedRelation: "tenants";
            referencedColumns: ["id"];
          },
        ];
      };
      societies: {
        Row: {
          address: string | null;
          bill_frequency: Database["public"]["Enums"]["bill_frequency"];
          bill_lot: number;
          bill_no: number;
          code: string;
          comments: string[] | null;
          created_at: string;
          created_by: string | null;
          credit_adj_first:
            | Database["public"]["Enums"]["credit_adj_first"]
            | null;
          cur_period_from: string;
          cur_period_to: string;
          email: string | null;
          grace_period: number | null;
          gst_no: string | null;
          id: number;
          id_city: number;
          id_state: number;
          id_tenant: number;
          interest_min_rs: number | null;
          interest_period: Database["public"]["Enums"]["interest_period"];
          interest_rate: number | null;
          interest_type: Database["public"]["Enums"]["interest_type"];
          location: string | null;
          name: string;
          next_bill_date: string | null;
          pan_no: string | null;
          payment_due_date: number | null;
          penalty_apply: boolean | null;
          penalty_charged_on: string | null;
          penalty_fixed_amount: number | null;
          penalty_on_bill_exceed: number | null;
          penalty_percentage: number | null;
          period_from: string;
          period_to: string;
          phone_number: string | null;
          pin_code: number | null;
          rebate_apply: boolean;
          rebate_due_date: number | null;
          rebate_fixed_amount: number | null;
          rebate_percentage: number | null;
          rebate_type: string | null;
          receipt_no: number;
          regi_no: string | null;
          round_off_amount: boolean | null;
          sac_code: string | null;
          status: string;
          step: number;
          tan_no: string | null;
        };
        Insert: {
          address?: string | null;
          bill_frequency?: Database["public"]["Enums"]["bill_frequency"];
          bill_lot?: number;
          bill_no?: number;
          code: string;
          comments?: string[] | null;
          created_at?: string;
          created_by?: string | null;
          credit_adj_first?:
            | Database["public"]["Enums"]["credit_adj_first"]
            | null;
          cur_period_from: string;
          cur_period_to: string;
          email?: string | null;
          grace_period?: number | null;
          gst_no?: string | null;
          id?: number;
          id_city?: number;
          id_state?: number;
          id_tenant: number;
          interest_min_rs?: number | null;
          interest_period?: Database["public"]["Enums"]["interest_period"];
          interest_rate?: number | null;
          interest_type?: Database["public"]["Enums"]["interest_type"];
          location?: string | null;
          name: string;
          next_bill_date?: string | null;
          pan_no?: string | null;
          payment_due_date?: number | null;
          penalty_apply?: boolean | null;
          penalty_charged_on?: string | null;
          penalty_fixed_amount?: number | null;
          penalty_on_bill_exceed?: number | null;
          penalty_percentage?: number | null;
          period_from: string;
          period_to: string;
          phone_number?: string | null;
          pin_code?: number | null;
          rebate_apply?: boolean;
          rebate_due_date?: number | null;
          rebate_fixed_amount?: number | null;
          rebate_percentage?: number | null;
          rebate_type?: string | null;
          receipt_no?: number;
          regi_no?: string | null;
          round_off_amount?: boolean | null;
          sac_code?: string | null;
          status?: string;
          step: number;
          tan_no?: string | null;
        };
        Update: {
          address?: string | null;
          bill_frequency?: Database["public"]["Enums"]["bill_frequency"];
          bill_lot?: number;
          bill_no?: number;
          code?: string;
          comments?: string[] | null;
          created_at?: string;
          created_by?: string | null;
          credit_adj_first?:
            | Database["public"]["Enums"]["credit_adj_first"]
            | null;
          cur_period_from?: string;
          cur_period_to?: string;
          email?: string | null;
          grace_period?: number | null;
          gst_no?: string | null;
          id?: number;
          id_city?: number;
          id_state?: number;
          id_tenant?: number;
          interest_min_rs?: number | null;
          interest_period?: Database["public"]["Enums"]["interest_period"];
          interest_rate?: number | null;
          interest_type?: Database["public"]["Enums"]["interest_type"];
          location?: string | null;
          name?: string;
          next_bill_date?: string | null;
          pan_no?: string | null;
          payment_due_date?: number | null;
          penalty_apply?: boolean | null;
          penalty_charged_on?: string | null;
          penalty_fixed_amount?: number | null;
          penalty_on_bill_exceed?: number | null;
          penalty_percentage?: number | null;
          period_from?: string;
          period_to?: string;
          phone_number?: string | null;
          pin_code?: number | null;
          rebate_apply?: boolean;
          rebate_due_date?: number | null;
          rebate_fixed_amount?: number | null;
          rebate_percentage?: number | null;
          rebate_type?: string | null;
          receipt_no?: number;
          regi_no?: string | null;
          round_off_amount?: boolean | null;
          sac_code?: string | null;
          status?: string;
          step?: number;
          tan_no?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "societies_id_city_fkey";
            columns: ["id_city"];
            isOneToOne: false;
            referencedRelation: "city";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "societies_id_state_fkey";
            columns: ["id_state"];
            isOneToOne: false;
            referencedRelation: "state";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "societies_id_tenant_fkey";
            columns: ["id_tenant"];
            isOneToOne: false;
            referencedRelation: "tenants";
            referencedColumns: ["id"];
          },
        ];
      };
      society_account_master: {
        Row: {
          code: string;
          created_at: string;
          id: number;
          id_group: number;
          id_society: number | null;
          id_sub_group: number | null;
          ly_balance: number;
          ly_type: Database["public"]["Enums"]["transaction_type"] | null;
          name: string;
          op_balance: number;
          op_type: Database["public"]["Enums"]["transaction_type"] | null;
        };
        Insert: {
          code: string;
          created_at?: string;
          id?: number;
          id_group: number;
          id_society?: number | null;
          id_sub_group?: number | null;
          ly_balance?: number;
          ly_type?: Database["public"]["Enums"]["transaction_type"] | null;
          name: string;
          op_balance?: number;
          op_type?: Database["public"]["Enums"]["transaction_type"] | null;
        };
        Update: {
          code?: string;
          created_at?: string;
          id?: number;
          id_group?: number;
          id_society?: number | null;
          id_sub_group?: number | null;
          ly_balance?: number;
          ly_type?: Database["public"]["Enums"]["transaction_type"] | null;
          name?: string;
          op_balance?: number;
          op_type?: Database["public"]["Enums"]["transaction_type"] | null;
        };
        Relationships: [
          {
            foreignKeyName: "society_account_master_id_group_fkey";
            columns: ["id_group"];
            isOneToOne: false;
            referencedRelation: "society_heading_groups";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "society_account_master_id_society_fkey";
            columns: ["id_society"];
            isOneToOne: false;
            referencedRelation: "societies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "society_account_master_id_sub_group_fkey";
            columns: ["id_sub_group"];
            isOneToOne: false;
            referencedRelation: "society_heading_groups";
            referencedColumns: ["id"];
          },
        ];
      };
      society_bills: {
        Row: {
          bill_date: string | null;
          bill_frequency: Database["public"]["Enums"]["bill_frequency"];
          bill_lot: number;
          bill_period_from: string;
          bill_period_to: string;
          comments: string[] | null;
          created_at: string;
          credit_adj_first: Database["public"]["Enums"]["credit_adj_first"];
          due_date: string;
          id: number;
          id_society: number;
          id_tenant: number;
          interest_period: Database["public"]["Enums"]["interest_period"];
          interest_rate: number;
          interest_type: Database["public"]["Enums"]["interest_type"];
          start_bill_no: number;
          status: string;
          updated_at: string;
        };
        Insert: {
          bill_date?: string | null;
          bill_frequency: Database["public"]["Enums"]["bill_frequency"];
          bill_lot: number;
          bill_period_from: string;
          bill_period_to: string;
          comments?: string[] | null;
          created_at?: string;
          credit_adj_first?: Database["public"]["Enums"]["credit_adj_first"];
          due_date: string;
          id?: number;
          id_society: number;
          id_tenant: number;
          interest_period?: Database["public"]["Enums"]["interest_period"];
          interest_rate: number;
          interest_type?: Database["public"]["Enums"]["interest_type"];
          start_bill_no?: number;
          status?: string;
          updated_at?: string;
        };
        Update: {
          bill_date?: string | null;
          bill_frequency?: Database["public"]["Enums"]["bill_frequency"];
          bill_lot?: number;
          bill_period_from?: string;
          bill_period_to?: string;
          comments?: string[] | null;
          created_at?: string;
          credit_adj_first?: Database["public"]["Enums"]["credit_adj_first"];
          due_date?: string;
          id?: number;
          id_society?: number;
          id_tenant?: number;
          interest_period?: Database["public"]["Enums"]["interest_period"];
          interest_rate?: number;
          interest_type?: Database["public"]["Enums"]["interest_type"];
          start_bill_no?: number;
          status?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "society_bills_id_society_fkey";
            columns: ["id_society"];
            isOneToOne: false;
            referencedRelation: "societies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "society_bills_id_tenant_fkey";
            columns: ["id_tenant"];
            isOneToOne: false;
            referencedRelation: "tenants";
            referencedColumns: ["id"];
          },
        ];
      };
      society_book_master: {
        Row: {
          acc_no: string | null;
          address: string | null;
          branch_name: string | null;
          code: string;
          created_at: string;
          id: number;
          id_group: number;
          id_society: number;
          id_sub_group: number | null;
          ifsc_code: string | null;
          is_collection_acount: boolean;
          ly_balance: number;
          ly_type: Database["public"]["Enums"]["transaction_type"] | null;
          name: string;
          op_balance: number;
          op_type: Database["public"]["Enums"]["transaction_type"] | null;
          phone_no: string | null;
          type: Database["public"]["Enums"]["book_code_type"];
        };
        Insert: {
          acc_no?: string | null;
          address?: string | null;
          branch_name?: string | null;
          code: string;
          created_at?: string;
          id?: number;
          id_group: number;
          id_society: number;
          id_sub_group?: number | null;
          ifsc_code?: string | null;
          is_collection_acount?: boolean;
          ly_balance?: number;
          ly_type?: Database["public"]["Enums"]["transaction_type"] | null;
          name: string;
          op_balance?: number;
          op_type?: Database["public"]["Enums"]["transaction_type"] | null;
          phone_no?: string | null;
          type?: Database["public"]["Enums"]["book_code_type"];
        };
        Update: {
          acc_no?: string | null;
          address?: string | null;
          branch_name?: string | null;
          code?: string;
          created_at?: string;
          id?: number;
          id_group?: number;
          id_society?: number;
          id_sub_group?: number | null;
          ifsc_code?: string | null;
          is_collection_acount?: boolean;
          ly_balance?: number;
          ly_type?: Database["public"]["Enums"]["transaction_type"] | null;
          name?: string;
          op_balance?: number;
          op_type?: Database["public"]["Enums"]["transaction_type"] | null;
          phone_no?: string | null;
          type?: Database["public"]["Enums"]["book_code_type"];
        };
        Relationships: [
          {
            foreignKeyName: "society_book_master_id_group_fkey";
            columns: ["id_group"];
            isOneToOne: false;
            referencedRelation: "society_heading_groups";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "society_book_master_id_society_fkey";
            columns: ["id_society"];
            isOneToOne: false;
            referencedRelation: "societies";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "society_book_master_id_sub_group_fkey";
            columns: ["id_sub_group"];
            isOneToOne: false;
            referencedRelation: "society_heading_groups";
            referencedColumns: ["id"];
          },
        ];
      };
      society_heading_groups: {
        Row: {
          description: string | null;
          head: Database["public"]["Enums"]["account_heads"];
          id: number;
          id_parent: number | null;
          id_society: number;
          name: string;
        };
        Insert: {
          description?: string | null;
          head?: Database["public"]["Enums"]["account_heads"];
          id?: number;
          id_parent?: number | null;
          id_society?: number;
          name: string;
        };
        Update: {
          description?: string | null;
          head?: Database["public"]["Enums"]["account_heads"];
          id?: number;
          id_parent?: number | null;
          id_society?: number;
          name?: string;
        };
        Relationships: [
          {
            foreignKeyName: "society_heading_groups_id_parent_fkey1";
            columns: ["id_parent"];
            isOneToOne: false;
            referencedRelation: "society_heading_groups";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "society_heading_groups_id_society_fkey";
            columns: ["id_society"];
            isOneToOne: false;
            referencedRelation: "societies";
            referencedColumns: ["id"];
          },
        ];
      };
      society_headings: {
        Row: {
          amount: number;
          created_at: string;
          id: number;
          id_account_master: number;
          id_society: number;
          is_gst: boolean;
          is_interest: boolean;
          rebate_amount: number;
          rebate_percentage: number | null;
        };
        Insert: {
          amount: number;
          created_at?: string;
          id?: number;
          id_account_master: number;
          id_society: number;
          is_gst?: boolean;
          is_interest?: boolean;
          rebate_amount?: number;
          rebate_percentage?: number | null;
        };
        Update: {
          amount?: number;
          created_at?: string;
          id?: number;
          id_account_master?: number;
          id_society?: number;
          is_gst?: boolean;
          is_interest?: boolean;
          rebate_amount?: number;
          rebate_percentage?: number | null;
        };
        Relationships: [
          {
            foreignKeyName: "society_headings_id_account_master_fkey";
            columns: ["id_account_master"];
            isOneToOne: false;
            referencedRelation: "society_account_master";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "society_headings_id_society_fkey";
            columns: ["id_society"];
            isOneToOne: false;
            referencedRelation: "societies";
            referencedColumns: ["id"];
          },
        ];
      };
      state: {
        Row: {
          code: string | null;
          created_at: string | null;
          id: number;
          name: string;
        };
        Insert: {
          code?: string | null;
          created_at?: string | null;
          id?: number;
          name: string;
        };
        Update: {
          code?: string | null;
          created_at?: string | null;
          id?: number;
          name?: string;
        };
        Relationships: [];
      };
      tenants: {
        Row: {
          company_name: string;
          created_at: string;
          id: number;
          mobile: string;
          name: string;
          updated_at: string | null;
        };
        Insert: {
          company_name: string;
          created_at?: string;
          id?: number;
          mobile: string;
          name: string;
          updated_at?: string | null;
        };
        Update: {
          company_name?: string;
          created_at?: string;
          id?: number;
          mobile?: string;
          name?: string;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      users: {
        Row: {
          created_at: string;
          email: string;
          id: string;
          id_tenant: number;
          name: string;
          role: string;
        };
        Insert: {
          created_at?: string;
          email: string;
          id: string;
          id_tenant: number;
          name: string;
          role?: string;
        };
        Update: {
          created_at?: string;
          email?: string;
          id?: string;
          id_tenant?: number;
          name?: string;
          role?: string;
        };
        Relationships: [
          {
            foreignKeyName: "users_id_tenant_fkey";
            columns: ["id_tenant"];
            isOneToOne: false;
            referencedRelation: "tenants";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      account_heads: "assets" | "liabilities" | "incomes" | "expenses";
      bill_frequency:
        | "monthly"
        | "bi-monthly"
        | "quarterly"
        | "half-yearly"
        | "yearly";
      bill_type: "regular" | "initial";
      book_code_type: "bank" | "cash";
      credit_adj_first: "principle" | "interest";
      interest_period:
        | "daily"
        | "monthly"
        | "bi-monthly"
        | "quarterly"
        | "half-yearly"
        | "yearly";
      interest_type: "simple" | "compound";
      mode_of_payment:
        | "check_book"
        | "upi"
        | "net_banking"
        | "cash"
        | "card"
        | "other";
      transaction_type: "credit" | "debit";
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type PublicSchema = Database[Extract<keyof Database, "public">];

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (
      & Database[PublicTableNameOrOptions["schema"]]["Tables"]
      & Database[PublicTableNameOrOptions["schema"]]["Views"]
    )
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database } ? (
    & Database[PublicTableNameOrOptions["schema"]]["Tables"]
    & Database[PublicTableNameOrOptions["schema"]]["Views"]
  )[TableName] extends {
    Row: infer R;
  } ? R
  : never
  : PublicTableNameOrOptions extends keyof (
    & PublicSchema["Tables"]
    & PublicSchema["Views"]
  ) ? (
      & PublicSchema["Tables"]
      & PublicSchema["Views"]
    )[PublicTableNameOrOptions] extends {
      Row: infer R;
    } ? R
    : never
  : never;

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Insert: infer I;
  } ? I
  : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Insert: infer I;
    } ? I
    : never
  : never;

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
    Update: infer U;
  } ? U
  : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
      Update: infer U;
    } ? U
    : never
  : never;

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
  : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database;
  } ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]][
      "CompositeTypes"
    ]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][
    CompositeTypeName
  ]
  : PublicCompositeTypeNameOrOptions extends
    keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
  : never;
