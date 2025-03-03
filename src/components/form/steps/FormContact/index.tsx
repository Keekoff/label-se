
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
          // The eligibility form doesn't have a direct has_funding field
          // Let's set a default value - we can adjust based on other fields if needed
          let hasFunding = "Non";
          
          // Adapt employee count from eligibility to match the format in label form
          let employeeCount = data.employee_count;
          if (data.employee_count === "0-10") {
            employeeCount = "0 à 10";
          } else if (data.employee_count === "10-49") {
            employeeCount = "11 à 49";
          } else if (data.employee_count === "50-99") {
            employeeCount = "50 à 99";
          } else if (data.employee_count === "100 et plus") {
            employeeCount = "100 et plus";
          }

          console.log('Legal form from eligibility:', data.legal_form);

          // Populate form with eligibility data
          const updatedFormState = {
            ...formState,
            firstName: data.first_name || formState.firstName,
            lastName: data.last_name || formState.lastName,
            email: data.email || formState.email,
            companyName: data.company_name || formState.companyName,
            // Convert array to single value for sector
            sector: Array.isArray(data.sectors) && data.sectors.length > 0 
              ? data.sectors[0] 
              : formState.sector,
            // Set the legal form from eligibility data
            legalForm: data.legal_form || formState.legalForm,
            employeeCount: employeeCount || formState.employeeCount,
            phone: data.phone || formState.phone,
            hasFunding: hasFunding,
            // Add other relevant fields
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
          readOnly={false}
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
          readOnly={false}
        />
      </div>
    </div>
  );
};

export default FormContact;
