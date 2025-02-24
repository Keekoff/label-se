
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
          formState={formState}
          setFormState={setFormState}
          onValidityChange={setIsBasicValid}
        />
        <AddressInformation
          formState={formState}
          setFormState={setFormState}
          onValidityChange={setIsAddressValid}
        />
        <CompanyDetails
          formState={formState}
          setFormState={setFormState}
          onValidityChange={setIsDetailsValid}
        />
        <CompanyMetrics
          formState={formState}
          setFormState={setFormState}
          onValidityChange={setIsMetricsValid}
        />
      </div>
    </div>
  );
};

export default FormContact;
