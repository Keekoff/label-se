
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { useState } from "react";
import StepProgress from "./StepProgress";
import FormDisclaimer from "./steps/FormDisclaimer";
import FormContact from "./steps/FormContact";
import FormPart1 from "./steps/FormPart1";
import FormPart2 from "./steps/FormPart2";
import FormPart3 from "./steps/FormPart3";
import FormPart4 from "./steps/FormPart4";
import FormThanks from "./steps/FormThanks";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

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
  { id: 6, title: "Partie 4", isValid: false },
  { id: 7, title: "Remerciement", isValid: true },
];

interface MultiStepFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const MultiStepFormDialog = ({ open, onOpenChange }: MultiStepFormDialogProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formState, setFormState] = useState<Record<string, any>>({});
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

  const currentStepIsValid = stepsValidity.find(step => step.id === currentStep)?.isValid;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] md:max-w-[85vw] h-[95vh] md:h-[90vh] p-0 gap-0">
        <div className="flex flex-col h-full">
          {/* Fixed Header with Title */}
          <DialogTitle className="sr-only">Formulaire de candidature</DialogTitle>
          <div className="p-4 md:p-6 border-b">
            <StepProgress steps={steps} currentStep={currentStep} />
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6">
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
              <FormPart4
                onValidityChange={(isValid) => updateStepValidity(6, isValid)}
                formState={formState}
                setFormState={setFormState}
              />
            )}
            {currentStep === 7 && (
              <FormThanks
                onValidityChange={(isValid) => updateStepValidity(7, isValid)}
                formState={formState}
                setFormState={setFormState}
              />
            )}
          </div>

          {/* Sticky Footer */}
          <div className="p-4 md:p-6 border-t bg-white mt-auto">
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
                disabled={!currentStepIsValid || currentStep === steps.length}
                className="flex items-center gap-2"
              >
                Suivant
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MultiStepFormDialog;
