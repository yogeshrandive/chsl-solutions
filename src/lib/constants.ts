export const SOCIETY_FORM_STEPS = [
  { title: 'Basic Info', action: 'step1' },
  { title: 'Interest Formula', action: 'step2' },
  { title: 'Outgoings', action: 'step3' },
  { title: 'Rebate Calculation', action: 'step4' },
  { title: 'Penalty Calculation', action: 'step5' },
  { title: 'Conditions', action: 'step6' },
];

export const MEMBER_FORM_STEPS = [
  { title: 'Basic Info', action: 'step1' },
  { title: 'Interest Formula', action: 'step2' },
  { title: 'Outgoings', action: 'step3' },
];

export const billTypes = [
  { value: 'monthly', label: 'Monthly' },
  { value: 'bi-monthly', label: 'Bi-Monthly' },
  { value: 'quarterly', label: 'Quarterly' },
  { value: 'half-yearly', label: 'Half-Yearly' },
  { value: 'yearly', label: 'Yearly' },
];

export const premiseTypes = [
  { value: 'commercial', label: 'Commercial' },
  { value: 'residential', label: 'Residential' },
];

export const premiseUnitType = [
  { value: 'flat', label: 'Flat' },
  { value: 'shop', label: 'Shop' },
  { value: 'office', label: 'Office' },
  { value: 'warehouse', label: 'Warehouse' },
  { value: 'gala', label: 'Gala' },
];

export const areaUnits = [
  { value: 'sq_ft', label: 'Square Feet' },
  { value: 'sq_m', label: 'Square Meters' },
];

// Add this type
export type AppUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  id_tenant: number;
  created_at: string;
};

export const SOCIETY_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
};
