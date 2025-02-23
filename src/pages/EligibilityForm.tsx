
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Step1Form from "@/components/eligibility/Step1Form";
import Step2Form from "@/components/eligibility/Step2Form";
import Step3Form from "@/components/eligibility/Step3Form";
import StepIndicator from "@/components/eligibility/StepIndicator";
import { toast } from "sonner";
import { FormData } from "@/types/eligibility";
import { supabase } from "@/integrations/supabase/client";

const EligibilityForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    // Step 1
    firstName: "",
    lastName: "",
    companyName: "",
    siret: "",
    legalForm: "",
    isMissionDriven: "",
    
    // Step 2
    sectors: [],
    growthStage: "",
    employeeCount: "",
    
    // Step 3
    roles: [],
    responsibilities: [],
    motivations: [],
    implementedActions: [],
    certificationStatus: "",
    email: "",
    phone: "",
  });
  
  const navigate = useNavigate();

  const handleNext = async (stepData: Partial<FormData>) => {
    const updatedFormData = { ...formData, ...stepData };
    setFormData(updatedFormData);

    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      try {
        // Map form data to match database schema
        const submissionData = {
          first_name: updatedFormData.firstName,
          last_name: updatedFormData.lastName,
          company_name: updatedFormData.companyName,
          siret: updatedFormData.siret,
          legal_form: updatedFormData.legalForm,
          is_mission_driven: updatedFormData.isMissionDriven,
          sectors: updatedFormData.sectors,
          growth_stage: updatedFormData.growthStage,
          employee_count: updatedFormData.employeeCount,
          roles: updatedFormData.roles,
          responsibilities: updatedFormData.responsibilities,
          motivations: updatedFormData.motivations,
          implemented_actions: updatedFormData.implementedActions,
          certification_status: updatedFormData.certificationStatus,
          email: updatedFormData.email,
          phone: updatedFormData.phone
        };

        // Submit to Supabase
        const { error } = await supabase
          .from('eligibility_submissions')
          .insert([submissionData]);

        if (error) throw error;

        toast.success("Formulaire envoyé avec succès !");
        navigate("/dashboard");
      } catch (error) {
        console.error('Error submitting form:', error);
        toast.error("Une erreur est survenue lors de l'envoi du formulaire. Veuillez réessayer.");
      }
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      <h1 className="text-2xl font-bold text-center mb-8">
        Formulaire d'éligibilité
      </h1>
      
      <StepIndicator currentStep={currentStep} />
      
      <Card className="p-6">
        {currentStep === 1 && (
          <Step1Form
            initialData={formData}
            onSubmit={handleNext}
          />
        )}
        
        {currentStep === 2 && (
          <Step2Form
            initialData={formData}
            onSubmit={handleNext}
            onBack={handleBack}
          />
        )}
        
        {currentStep === 3 && (
          <Step3Form
            initialData={formData}
            onSubmit={handleNext}
            onBack={handleBack}
          />
        )}
      </Card>
    </div>
  );
};

export default EligibilityForm;
