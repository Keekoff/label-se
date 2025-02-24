
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";

interface FormNavigationProps {
  currentStep: number;
  maxSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onSave: () => void;
  onSubmit: () => void;
  isDisabled?: boolean;
}

export const FormNavigation = ({
  currentStep,
  maxSteps,
  onPrevious,
  onNext,
  onSave,
  onSubmit,
  isDisabled = false,
}: FormNavigationProps) => {
  const renderNextButton = () => {
    if (currentStep === 5) {
      return (
        <Button
          onClick={onSubmit}
          className="flex items-center gap-2 bg-primary"
        >
          Envoyer ma demande
        </Button>
      );
    }
    
    if (currentStep === 6) {
      return null;
    }

    return (
      <Button
        onClick={onNext}
        disabled={isDisabled}
        className="flex items-center gap-2"
      >
        Suivant
        <ArrowRight className="w-4 h-4" />
      </Button>
    );
  };

  return (
    <div className="flex justify-between items-center">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentStep === 1}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Retour
      </Button>
      <div className="flex items-center gap-3">
        {currentStep < maxSteps && (
          <Button
            variant="outline"
            onClick={onSave}
            className="flex items-center gap-2"
          >
            <Save className="w-4 w-4" />
            Sauvegarder
          </Button>
        )}
        {renderNextButton()}
      </div>
    </div>
  );
};
