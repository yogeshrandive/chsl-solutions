export const DEFAULT_HEAD_GROUPS = [
  {
    head: 'incomes',
    name: 'Maintenance Charges',
    description: 'Maintenance Charges',
    parent: null,
  },
  {
    head: 'expenses',
    name: 'Repairs and Maintenance',
    description: 'Repairs and Maintenance',
    parent: null,
  },
  {
    head: 'expenses',
    name: 'Electricity',
    description: 'Electricity',
    parent: null,
  },
  {
    head: 'assets',
    name: 'Bank Accounts',
    description: 'Bank Accounts',
    parent: null,
  },
  {
    head: 'liabilities',
    name: 'Loans',
    description: 'Loans',
    parent: null,
  },
  {
    head: 'incomes',
    parent: 'Maintenance Charges',
    name: 'Residential',
    description: 'Residential',
  },
  {
    head: 'incomes',
    parent: 'Maintenance Charges',
    name: 'Commercial',
    description: 'Commercial',
  },
  {
    head: 'expenses',
    parent: 'Repairs and Maintenance',
    name: 'Plumbing',
    description: 'Plumbing',
  },
  {
    head: 'expenses',
    parent: 'Electricity',
    name: 'Common Area',
    description: 'Common Area',
  },
  {
    head: 'assets',
    parent: 'Bank Accounts',
    name: 'Savings Account',
    description: 'Savings Account',
  },
  {
    head: 'liabilities',
    parent: 'Loans',
    name: 'Bank Loan',
    description: 'Bank Loan',
  },
] as const;
