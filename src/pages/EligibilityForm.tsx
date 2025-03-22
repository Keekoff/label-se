
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import Step1Form from "@/components/eligibility/Step1Form";
import Step2Form from "@/components/eligibility/Step2Form";
import Step3Form from "@/components/eligibility/Step3Form";
import StepIndicator from "@/components/eligibility/StepIndicator";
import { toast } from "sonner";
import { FormData, SubmissionData } from "@/types/eligibility";
import { supabase } from "@/integrations/supabase/client";

const INELIGIBLE_LEGAL_FORMS = ["Association Loi 1901", "EI (auto-entrepreneur, micro-entreprise)"];

const IneligibleMessage = () => (
  <div className="text-center space-y-4">
    <h2 className="text-xl font-semibold">Vous n'êtes pas encore éligible.</h2>
    <p className="text-gray-600">
      Le label Startup Engagée n'est pas adapté aux Associations Loi 1901 et aux EI (auto-entrepreneur, micro-entreprise). 
      Nous reviendrons vers vous dès que ce sera le cas. Merci de votre confiance.
    </p>
    <p className="font-medium">L'équipe KeekOff</p>
  </div>
);

const EligibilityForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isIneligible, setIsIneligible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [existingSubmission, setExistingSubmission] = useState<null | any>(null);
  const [userEmail, setUserEmail] = useState<string>("");
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

  useEffect(() => {
    const checkExistingSubmission = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate('/login');
          return;
        }

        // Récupérer l'email de l'utilisateur
        setUserEmail(session.user.email || "");
        // Mettre à jour le formData avec l'email de l'utilisateur
        setFormData(prev => ({
          ...prev,
          email: session.user.email || ""
        }));

        const { data: submission, error } = await supabase
          .from('eligibility_submissions')
          .select('*')
          .eq('user_id', session.user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows" error
          throw error;
        }

        if (submission) {
          setExistingSubmission(submission);
          // Check if the existing submission has an ineligible legal form
          if (INELIGIBLE_LEGAL_FORMS.includes(submission.legal_form)) {
            setIsIneligible(true);
          } else {
            navigate('/dashboard');
          }
        }
      } catch (error) {
        console.error('Error checking submission:', error);
        toast.error("Une erreur est survenue lors de la vérification de votre éligibilité.");
      } finally {
        setLoading(false);
      }
    };

    checkExistingSubmission();
  }, [navigate]);

  const handleNext = async (stepData: Partial<FormData>) => {
    const updatedFormData = { ...formData, ...stepData };
    setFormData(updatedFormData);

    // Check ineligibility when legal form is selected in step 1
    if (currentStep === 1 && INELIGIBLE_LEGAL_FORMS.includes(updatedFormData.legalForm)) {
      setIsIneligible(true);
    }

    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          navigate('/login');
          return;
        }

        const submissionData: SubmissionData = {
          user_id: session.user.id,
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
          email: session.user.email || updatedFormData.email, // Utiliser l'email de session en priorité
          phone: updatedFormData.phone
        };

        const { error } = await supabase
          .from('eligibility_submissions')
          .insert([submissionData]);

        if (error) throw error;

        if (INELIGIBLE_LEGAL_FORMS.includes(updatedFormData.legalForm)) {
          setIsIneligible(true);
        } else {
          toast.success("Formulaire envoyé avec succès !");
          navigate("/dashboard");
        }
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

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto p-4 text-center">
        Chargement...
      </div>
    );
  }

  if (isIneligible) {
    return (
      <div className="max-w-2xl mx-auto p-4">
        <Card className="p-6">
          <IneligibleMessage />
        </Card>
      </div>
    );
  }

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
