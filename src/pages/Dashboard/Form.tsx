import { useState } from "react";
import StepProgress from "@/components/form/StepProgress";
import FormDisclaimer from "@/components/form/steps/FormDisclaimer";
import FormContact from "@/components/form/steps/FormContact";
import FormPart1 from "@/components/form/steps/FormPart1";
import FormPart2 from "@/components/form/steps/FormPart2";
import FormPart3 from "@/components/form/steps/FormPart3";
import FormThanks from "@/components/form/steps/FormThanks";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { SubmissionModal } from "@/components/form/SubmissionModal";

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
  const { toast } = useToast();
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [showSubmissionModal, setShowSubmissionModal] = useState(false);

  const updateStepValidity = (stepId: number, isValid: boolean) => {
    console.log(`Updating step ${stepId} validity to:`, isValid);
    setStepsValidity(prev => 
      prev.map(step => 
        step.id === stepId ? { ...step, isValid } : step
      )
    );
  };

  const handleSave = async () => {
    try {
      const submissionData = {
        ...formState,
        current_step: currentStep,
        status: 'draft'
      };

      if (submissionId) {
        const { error } = await supabase
          .from('label_submissions')
          .update(submissionData)
          .eq('id', submissionId);

        if (error) throw error;
      } else {
        const { data, error } = await supabase
          .from('label_submissions')
          .insert([submissionData])
          .select('id')
          .single();

        if (error) throw error;
        setSubmissionId(data.id);
      }

      toast({
        title: "Brouillon sauvegardé",
        description: "Votre progression a été enregistrée avec succès.",
      });
    } catch (error) {
      console.error('Error saving draft:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde.",
        variant: "destructive"
      });
    }
  };

  const handleSubmit = async () => {
    try {
      if (submissionId) {
        const { error } = await supabase
          .from('label_submissions')
          .update({ status: 'submitted' })
          .eq('id', submissionId);

        if (error) throw error;

        setShowSubmissionModal(true);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la soumission du formulaire.",
        variant: "destructive"
      });
    }
  };

  const handlePay = () => {
    toast({
      title: "Redirection vers le paiement",
      description: "Vous allez être redirigé vers la page de paiement.",
    });
    // Here you would implement the actual payment logic
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
              onClick={() => {
                if (currentStep > 1) {
                  setCurrentStep(prev => prev - 1);
                  window.scrollTo(0, 0);
                }
              }}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Retour
            </Button>
            <div className="flex items-center gap-3">
              {currentStep < steps.length && (
                <Button
                  variant="outline"
                  onClick={handleSave}
                  className="flex items-center gap-2"
                >
                  <Save className="w-4 w-4" />
                  Sauvegarder
                </Button>
              )}
              {currentStep === steps.length ? (
                <Button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 bg-primary"
                >
                  Envoyer ma demande
                </Button>
              ) : (
                <Button
                  onClick={() => {
                    if (currentStep < steps.length) {
                      setCurrentStep(prev => prev + 1);
                      window.scrollTo(0, 0);
                    }
                  }}
                  disabled={currentStep === 1 && !formState.disclaimerAccepted}
                  className="flex items-center gap-2"
                >
                  Suivant
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <SubmissionModal 
        open={showSubmissionModal}
        onOpenChange={setShowSubmissionModal}
        onPaymentClick={handlePay}
      />
    </div>
  );
};

export default Form;
