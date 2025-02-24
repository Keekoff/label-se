
export type FormStep = {
  id: number;
  title: string;
  isValid: boolean;
};

export interface FormState {
  firstName: string;
  email: string;
  companyName: string;
  sectors: string[];
  legalForm: string;
  streetAddress: string;
  postalCode: string;
  city: string;
  foundingYear: string;
  employeeCount: string;
  hasFunding: string;
  fundingDetails: string;
  [key: string]: any;
}
