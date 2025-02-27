
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
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
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch eligibility data and pre-populate the form
    const fetchEligibilityData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data, error } = await supabase
          .from('eligibility_submissions')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (error) {
          console.error('Error fetching eligibility data:', error);
          return;
        }

        if (data) {
          // Populate form with eligibility data
          const updatedFormState = {
            ...formState,
            firstName: data.first_name || formState.firstName,
            lastName: data.last_name || formState.lastName,
            email: data.email || formState.email,
            companyName: data.company_name || formState.companyName,
            // Map sectors if available
            sectors: data.sectors || formState.sectors,
            legalForm: data.legal_form || formState.legalForm,
            employeeCount: data.employee_count || formState.employeeCount,
            phone: data.phone || formState.phone,
            // Add other fields if they exist in the eligibility form
          };
          
          setFormState(updatedFormState);
        }
      } catch (error) {
        console.error('Error in fetchEligibilityData:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEligibilityData();
  }, []);

  useEffect(() => {
    onValidityChange(isBasicValid && isAddressValid && isDetailsValid && isMetricsValid);
  }, [isBasicValid, isAddressValid, isDetailsValid, isMetricsValid, onValidityChange]);

  if (isLoading) {
    return <div className="py-8 text-center">Chargement des informations...</div>;
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Contact et Entreprise</h2>
        <p className="text-gray-500">
          Informations concernant votre entreprise.
          <span className="text-red-500 ml-1">*</span>
          <span className="text-sm ml-1">Champs obligatoires</span>
        </p>
      </div>

      <div className="space-y-6">
        <BasicInformation
          formState={formState}
          setFormState={setFormState}
          onValidityChange={setIsBasicValid}
          readOnly={true}
        />
        <AddressInformation
          formState={formState}
          setFormState={setFormState}
          onValidityChange={setIsAddressValid}
          readOnly={true}
        />
        <CompanyDetails
          formState={formState}
          setFormState={setFormState}
          onValidityChange={setIsDetailsValid}
          readOnly={true}
        />
        <CompanyMetrics
          formState={formState}
          setFormState={setFormState}
          onValidityChange={setIsMetricsValid}
          readOnly={true}
        />
      </div>
    </div>
  );
};

export default FormContact;
