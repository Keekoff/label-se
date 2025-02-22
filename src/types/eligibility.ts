
export interface FormData {
  // Step 1
  firstName: string;
  lastName: string;
  companyName: string;
  siret: string;
  legalForm: string;
  isMissionDriven: string;
  
  // Step 2
  sectors: string[];
  growthStage: string;
  employeeCount: string;
  
  // Step 3
  roles: string[];
  responsibilities: string[];
  motivations: string[];
  implementedActions: string[];
  certificationStatus: string;
  email: string;
  phone: string;
}
