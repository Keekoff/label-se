
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

  const handleNext = (stepData: Partial<FormData>) => {
    setFormData(prev => ({ ...prev, ...stepData }));
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      // Handle form submission
      console.log("Form submitted:", { ...formData, ...stepData });
      toast.success("Formulaire envoyé avec succès !");
      navigate("/dashboard");
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
