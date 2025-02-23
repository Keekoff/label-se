
import { useState } from "react";
import StepProgress from "@/components/form/StepProgress";
import FormDisclaimer from "@/components/form/steps/FormDisclaimer";
import FormContact from "@/components/form/steps/FormContact";
import FormPart1 from "@/components/form/steps/FormPart1";
import FormPart2 from "@/components/form/steps/FormPart2";
import FormPart3 from "@/components/form/steps/FormPart3";
import FormThanks from "@/components/form/steps/FormThanks";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

export type FormStep = {
  id: number;
  title: string;
  isValid: boolean;
};

const steps: FormStep[] = [
  { id: 1, title: "Disclaimer", isValid: false },
  { id: 2, title: "Contact et Entreprise", isValid: false },
  { id: 3, title: "Partie 1", isValid: false },
  { id: 4, title: "Partie 2", isValid: false },
  { id: 5, title: "Partie 3", isValid: false },
  { id: 6, title: "Remerciement", isValid: true },
];

const initialFormState = {
  // Contact form initial state
  firstName: "",
  email: "",
  companyName: "",
  sectors: [], 
  legalForm: "",
  streetAddress: "",
  postalCode: "",
  city: "",
  foundingYear: "",
  employeeCount: "",
  hasFunding: "",
  fundingDetails: "",
};

const Form = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formState, setFormState] = useState<Record<string, any>>(initialFormState);
  const [stepsValidity, setStepsValidity] = useState<FormStep[]>(steps);

  const updateStepValidity = (stepId: number, isValid: boolean) => {
    setStepsValidity(prev => 
      prev.map(step => 
        step.id === stepId ? { ...step, isValid } : step
      )
    );
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      // Only validate when moving to the final "Thanks" step
      if (currentStep === steps.length - 2) {
        const allStepsValid = stepsValidity
          .slice(0, -1) // Exclude the "Thanks" step
          .every(step => step.isValid);
        
        if (!allStepsValid) {
          // Prevent moving to Thanks if form is incomplete
          return;
        }
      }
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <StepProgress steps={steps} currentStep={currentStep} />
        </div>

        <div className="p-6">
          {currentStep === 1 && (
            <FormDisclaimer
              onValidityChange={(isValid) => updateStepValidity(1, isValid)}
              formState={formState}
              setFormState={setFormState}
            />
          )}
          {currentStep === 2 && (
            <FormContact
              onValidityChange={(isValid) => updateStepValidity(2, isValid)}
              formState={formState}
              setFormState={setFormState}
            />
          )}
          {currentStep === 3 && (
            <FormPart1
              onValidityChange={(isValid) => updateStepValidity(3, isValid)}
              formState={formState}
              setFormState={setFormState}
            />
          )}
          {currentStep === 4 && (
            <FormPart2
              onValidityChange={(isValid) => updateStepValidity(4, isValid)}
              formState={formState}
              setFormState={setFormState}
            />
          )}
          {currentStep === 5 && (
            <FormPart3
              onValidityChange={(isValid) => updateStepValidity(5, isValid)}
              formState={formState}
              setFormState={setFormState}
            />
          )}
          {currentStep === 6 && (
            <FormThanks
              onValidityChange={(isValid) => updateStepValidity(6, isValid)}
              formState={formState}
              setFormState={setFormState}
            />
          )}
        </div>

        <div className="p-6 border-t">
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
            <Button
              onClick={handleNext}
              // Only disable the button on the last step if form is incomplete
              disabled={currentStep === steps.length - 1 && !stepsValidity.every(step => step.isValid)}
              className="flex items-center gap-2"
            >
              Suivant
              <ArrowRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Form;
