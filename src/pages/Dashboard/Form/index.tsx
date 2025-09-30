
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import StepProgress from "@/components/form/StepProgress";
import FormDisclaimer from "@/components/form/steps/FormDisclaimer";
import FormContact from "@/components/form/steps/FormContact";
import FormPart1 from "@/components/form/steps/FormPart1";
import FormPart2 from "@/components/form/steps/FormPart2";
import FormPart3 from "@/components/form/steps/FormPart3";
import FormThanks from "@/components/form/steps/FormThanks";
import { FormState, FormStep } from "./types";
import { FORM_STEPS, INITIAL_FORM_STATE } from "./constants";
import { useFormSubmission } from "./useFormSubmission";
import { FormNavigation } from "./FormNavigation";

const Form = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formState, setFormState] = useState<FormState>(INITIAL_FORM_STATE);
  const [stepsValidity, setStepsValidity] = useState<FormStep[]>(FORM_STEPS);
  const [isLoadingDraft, setIsLoadingDraft] = useState(true);

  const { submissionId, setSubmissionId, handleSave, handleSubmit, isSubmitting } = useFormSubmission(formState, setCurrentStep);

  // Charger les données du draft au démarrage
  useEffect(() => {
    const loadDraft = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        const { data, error } = await supabase
          .from('label_submissions')
          .select('*')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          // Sauvegarder l'ID de la soumission pour éviter les duplications
          if (data.id) {
            setSubmissionId(data.id);
          }
          
          // Restaurer l'état du formulaire en mappant les champs de la DB vers le FormState
          const loadedState: FormState = {
            disclaimerAccepted: data.disclaimer_accepted || false,
            firstName: data.prenom || '',
            email: data.courriel || '',
            companyName: data.nom_entreprise || '',
            sectors: data.secteurs_activite || [],
            legalForm: data.forme_juridique || '',
            streetAddress: data.adresse || '',
            postalCode: data.code_postal || '',
            city: data.ville || '',
            foundingYear: data.annee_creation || '',
            employeeCount: data.nombre_employes || '',
            hasFunding: data.a_financements || '',
            fundingDetails: data.details_financement || '',
            politiqueRSE: data.politique_rse || [],
            contributionAssociative: data.contribution_associative || [],
            achatsResponsables: data.achats_responsables || [],
            numeriqueResponsable: data.numerique_responsable || [],
            communicationTransparente: data.communication_transparente || [],
            relationsFournisseurs: data.relations_fournisseurs || [],
            impactSocial: data.impact_social || [],
            productionDurable: data.production_durable || [],
            gestionDechets: data.gestion_dechets || [],
            ecoConception: data.eco_conception || [],
            evaluationContinue: data.evaluation_continue || [],
            gestionEnergie: data.gestion_energie || [],
            emissionsCarbone: data.emissions_carbone || [],
            economieCirculaire: data.economie_circulaire || [],
            diversite: data.diversite || [],
            egalite: data.egalite || [],
            situationHandicap: data.situation_handicap || [],
            santeBienEtre: data.sante_bien_etre || [],
            parentalite: data.parentalite || [],
            formation: data.formation || [],
            confidentialiteDonnees: data.confidentialite_donnees || [],
            mobilite: data.mobilite || []
          };
          setFormState(loadedState);
          
          // Restaurer l'étape actuelle
          if (data.current_step) {
            setCurrentStep(data.current_step);
          }
        }
      } catch (error) {
        console.error('Erreur lors du chargement du draft:', error);
      } finally {
        setIsLoadingDraft(false);
      }
    };

    loadDraft();
  }, []);

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

  const onSubmit = async () => {
    if (isSubmitting) return;
    
    // Check if all required steps are valid before submission
    const allStepsValid = stepsValidity.slice(0, 5).every(step => step.isValid); // Steps 1-5 (excluding thanks step)
    if (!allStepsValid) {
      console.warn("Cannot submit: not all steps are valid");
      return;
    }
    
    try {
      await handleSubmit();
      // Instead of showing the modal, we now directly move to step 6 (already handled in handleSubmit)
    } catch (error) {
      console.error("Erreur lors de la soumission:", error);
    }
  };

  if (isLoadingDraft) {
    return (
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <p className="text-center text-gray-600">Chargement de votre formulaire...</p>
        </div>
      </div>
    );
  }

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
              submissionId={submissionId}
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
            onSubmit={onSubmit}
            isDisabled={
              (currentStep === 1 && !formState.disclaimerAccepted) || 
              isSubmitting ||
              (currentStep === 5 && !stepsValidity.slice(0, 5).every(step => step.isValid)) // Disable submit on step 5 if not all steps valid
            }
          />
        </div>
      </div>
    </div>
  );
};

export default Form;
