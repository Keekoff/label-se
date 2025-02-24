
import { useState, useEffect } from "react";
import BasicInformation from "./BasicInformation";
import AddressInformation from "./AddressInformation";
import CompanyDetails from "./CompanyDetails";
import CompanyMetrics from "./CompanyMetrics";

interface FormContactProps {
  onValidityChange: (isValid: boolean) => void;
  formState: Record<string, any>;
  setFormState: (state: Record<string, any>) => void;
}

const FormContact = ({ onValidityChange, formState, setFormState }: FormContactProps) => {
  const [isBasicValid, setIsBasicValid] = useState(false);
  const [isAddressValid, setIsAddressValid] = useState(false);
  const [isDetailsValid, setIsDetailsValid] = useState(false);
  const [isMetricsValid, setIsMetricsValid] = useState(false);

  useEffect(() => {
    onValidityChange(isBasicValid && isAddressValid && isDetailsValid && isMetricsValid);
  }, [isBasicValid, isAddressValid, isDetailsValid, isMetricsValid, onValidityChange]);

  const updateFormField = (field: string, value: any) => {
    setFormState((prev: Record<string, any>) => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Contact et Entreprise</h2>
        <p className="text-gray-500">
          Merci de renseigner les informations concernant votre entreprise. 
          <span className="text-red-500 ml-1">*</span>
          <span className="text-sm ml-1">Champs obligatoires</span>
        </p>
      </div>

      <div className="space-y-6">
        <BasicInformation
          form={formState}
          updateForm={updateFormField}
          onValidityChange={setIsBasicValid}
        />
        <AddressInformation
          form={formState}
          updateForm={updateFormField}
          onValidityChange={setIsAddressValid}
        />
        <CompanyDetails
          form={formState}
          updateForm={updateFormField}
          onValidityChange={setIsDetailsValid}
        />
        <CompanyMetrics
          form={formState}
          updateForm={updateFormField}
          onValidityChange={setIsMetricsValid}
        />
      </div>
    </div>
  );
};

export default FormContact;
