
import { useState } from "react";
import StepProgress from "@/components/form/StepProgress";
import FormDisclaimer from "@/components/form/steps/FormDisclaimer";
import FormContact from "@/components/form/steps/FormContact";
import FormPart1 from "@/components/form/steps/FormPart1";
import FormPart2 from "@/components/form/steps/FormPart2";
import FormPart3 from "@/components/form/steps/FormPart3";
import FormThanks from "@/components/form/steps/FormThanks";
import { SubmissionModal } from "@/components/form/SubmissionModal";
import { FormState, FormStep } from "./types";
import { FORM_STEPS, INITIAL_FORM_STATE } from "./constants";
import { useFormSubmission } from "./useFormSubmission";
import { FormNavigation } from "./FormNavigation";

const Form = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formState, setFormState] = useState<FormState>(INITIAL_FORM_STATE);
  const [stepsValidity, setStepsValidity] = useState<FormStep[]>(FORM_STEPS);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);

  const { handleSave, handleSubmit } = useFormSubmission(formState, setCurrentStep);

  const updateStepValidity = (stepId: number, isValid: boolean) => {
    setStepsValidity(prev => 
      prev.map(step => 
        step.id === stepId ? { ...step, isValid } : step
      )
    );
  };

  const handleNext = () => {
    if (currentStep < FORM_STEPS.length) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="bg-white rounded-lg shadow-sm">
        <div className="p-6 border-b">
          <StepProgress steps={stepsValidity} currentStep={currentStep} />
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
          <FormNavigation
            currentStep={currentStep}
            maxSteps={FORM_STEPS.length}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSave={handleSave}
            onSubmit={handleSubmit}
            isDisabled={currentStep === 1 && !formState.disclaimerAccepted}
          />
        </div>
      </div>

      <SubmissionModal 
        open={showSubmissionModal}
        onOpenChange={setShowSubmissionModal}
        onPaymentClick={() => {
          console.log("Redirecting to payment...");
        }}
      />
    </div>
  );
};

export default Form;
