
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

export interface SubmissionData {
  user_id: string;
  first_name: string;
  last_name: string;
  company_name: string;
  siret: string;
  legal_form: string;
  is_mission_driven: string;
  sectors: string[];
  growth_stage: string;
  employee_count: string;
  roles: string[];
  responsibilities: string[];
  motivations: string[];
  implemented_actions: string[];
  certification_status: string;
  email: string;
  phone: string;
}
