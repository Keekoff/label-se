
import { useState, useEffect } from "react";
import BasicInformation from "./BasicInformation";
import CompanyDetails from "./CompanyDetails";
import AddressInformation from "./AddressInformation";
import CompanyMetrics from "./CompanyMetrics";

interface FormContactProps {
  onValidityChange: (isValid: boolean) => void;
  formState: Record<string, any>;
  setFormState: (state: Record<string, any>) => void;
}

export const SECTORS = [
  "Food", "Agro-alimentaire", "Mode/Beauté", "Luxe", "Industrie", "Santé/Pharma",
  "Banque/Assurance", "Environnement", "Social", "ESS", "Data & IT", "E-commerce",
  "Legal", "Finance", "Marketing", "Ressources Humaines", "Agence", "Cabinet de conseil",
  "Autre"
];

export const LEGAL_FORMS = ["SAS", "SASU", "SA", "SARL", "EURL", "Autre"];
export const EMPLOYEE_COUNTS = ["0-10", "10-49", "50-99", "100 et plus"];
export const FUNDING_OPTIONS = ["Oui", "Non", "Je ne souhaite pas partager cette information"];

const FormContact = ({ onValidityChange, formState, setFormState }: FormContactProps) => {
  const [form, setForm] = useState({
    firstName: formState.firstName || "",
    email: formState.email || "",
    companyName: formState.companyName || "",
    sectors: formState.sectors || [],
    legalForm: formState.legalForm || "",
    streetAddress: formState.streetAddress || "",
    postalCode: formState.postalCode || "",
    city: formState.city || "",
    foundingYear: formState.foundingYear || "",
    employeeCount: formState.employeeCount || "",
    hasFunding: formState.hasFunding || "",
    fundingDetails: formState.fundingDetails || ""
  });

  const updateForm = (field: string, value: any) => {
    const newForm = { ...form, [field]: value };
    setForm(newForm);
    setFormState({ ...formState, ...newForm });
    validateForm(newForm);
  };

  const validateForm = (data: typeof form) => {
    const requiredFields = [
      'firstName', 'email', 'companyName', 'legalForm',
      'streetAddress', 'postalCode', 'city', 'employeeCount', 'hasFunding'
    ];
    
    const isValid = requiredFields.every(field => data[field]?.toString().trim() !== "") &&
                   data.sectors.length > 0;
    
    onValidityChange(isValid);
  };

  useEffect(() => {
    validateForm(form);
  }, []);

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h2 className="text-2xl font-semibold mb-8">Contact et Entreprise</h2>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-8">
          <BasicInformation
            form={form}
            updateForm={updateForm}
          />
          <CompanyDetails
            form={form}
            updateForm={updateForm}
          />
        </div>
        
        <div className="space-y-8">
          <AddressInformation
            form={form}
            updateForm={updateForm}
          />
          <CompanyMetrics
            form={form}
            updateForm={updateForm}
          />
        </div>
      </div>
    </div>
  );
};

export default FormContact;
