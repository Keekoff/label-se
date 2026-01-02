import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Save, Loader2 } from "lucide-react";

interface FormNavigationProps {
  currentStep: number;
  maxSteps: number;
  onPrevious: () => void;
  onNext: () => void;
  onSave: () => void;
  onSubmit: () => void;
  isDisabled?: boolean;
  isSaving?: boolean;
}

export const FormNavigation = ({
  currentStep,
  maxSteps,
  onPrevious,
  onNext,
  onSave,
  onSubmit,
  isDisabled = false,
  isSaving = false,
}: FormNavigationProps) => {
  const renderNextButton = () => {
    if (currentStep === 5) {
      return (
        <Button
          onClick={onSubmit}
          className="flex items-center gap-2 bg-[#27017F] text-white"
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
        disabled={currentStep === 1 || currentStep === 6}
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
            disabled={isSaving}
            className="flex items-center gap-2"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Save className="w-4 h-4" />
            )}
            {isSaving ? 'Sauvegarde...' : 'Sauvegarder'}
          </Button>
        )}
        {renderNextButton()}
      </div>
    </div>
  );
};
