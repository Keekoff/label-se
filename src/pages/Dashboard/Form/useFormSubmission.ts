
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FormState } from "./types";
import { useNavigate } from "react-router-dom";

export const useFormSubmission = (
  formState: FormState,
  setCurrentStep: (step: number) => void
) => {
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      
      if (!session) {
        toast({
          title: "Authentification requise",
          description: "Veuillez vous connecter pour continuer.",
          variant: "destructive"
        });
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate, toast]);

  const formatSubmissionData = async (data: FormState, status: 'draft' | 'submitted') => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      toast({
        title: "Erreur d'authentification",
        description: "Veuillez vous reconnecter pour continuer.",
        variant: "destructive"
      });
      navigate("/login");
      throw new Error("User must be authenticated to submit form");
    }

    // Ensure all required fields are present
    const formattedData = {
      user_id: user.id,
      first_name: data.firstName || "",
      email: data.email || "",
      company_name: data.companyName || "",
      sectors: Array.isArray(data.sectors) ? data.sectors : [],
      legal_form: data.legalForm || "",
      street_address: data.streetAddress || "",
      postal_code: data.postalCode || "",
      city: data.city || "",
      founding_year: data.foundingYear || "",
      employee_count: data.employeeCount || "",
      has_funding: data.hasFunding || "",
      funding_details: data.fundingDetails || "",
      status: status,
      current_step: status === 'submitted' ? 6 : data.currentStep || 1,
      disclaimer_accepted: !!data.disclaimerAccepted,
      associative_contribution: Array.isArray(data.associativeContribution) ? data.associativeContribution : [],
      responsible_digital: Array.isArray(data.responsibleDigital) ? data.responsibleDigital : [],
      communication: Array.isArray(data.communication) ? data.communication : [],
      supplier_relations: Array.isArray(data.supplierRelations) ? data.supplierRelations : [],
      social_impact: Array.isArray(data.socialImpact) ? data.socialImpact : [],
      production: Array.isArray(data.production) ? data.production : [],
      eco_design: Array.isArray(data.ecoDesign) ? data.ecoDesign : [],
      continuous_evaluation: Array.isArray(data.continuousEvaluation) ? data.continuousEvaluation : [],
      energy_management: Array.isArray(data.energyManagement) ? data.energyManagement : [],
      carbon_emissions: Array.isArray(data.carbonEmissions) ? data.carbonEmissions : [],
      circular_economy: Array.isArray(data.circularEconomy) ? data.circularEconomy : [],
      waste_management: Array.isArray(data.wasteManagement) ? data.wasteManagement : [],
      responsible_purchasing: Array.isArray(data.responsiblePurchasing) ? data.responsiblePurchasing : []
    };

    // Log the formatted data for debugging
    console.log('Formatted submission data:', formattedData);
    return formattedData;
  };

  const handleSave = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentification requise",
        description: "Veuillez vous connecter pour sauvegarder.",
        variant: "destructive"
      });
      return;
    }

    try {
      const submissionData = await formatSubmissionData(formState, 'draft');
      console.log('Saving draft with data:', submissionData);

      if (submissionId) {
        const { error } = await supabase
          .from('label_submissions')
          .update(submissionData)
          .eq('id', submissionId);

        if (error) {
          console.error('Supabase update error:', error);
          throw error;
        }
      } else {
        const { data, error } = await supabase
          .from('label_submissions')
          .insert([submissionData])
          .select('id')
          .single();

        if (error) {
          console.error('Supabase insert error:', error);
          throw error;
        }
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
    if (!isAuthenticated) {
      toast({
        title: "Authentification requise",
        description: "Veuillez vous connecter pour soumettre le formulaire.",
        variant: "destructive"
      });
      return;
    }

    try {
      const submissionData = await formatSubmissionData(formState, 'submitted');
      console.log('Submitting form with data:', submissionData);

      if (submissionId) {
        const { error } = await supabase
          .from('label_submissions')
          .update(submissionData)
          .eq('id', submissionId);

        if (error) {
          console.error('Supabase update error:', error);
          throw error;
        }
      } else {
        const { data, error } = await supabase
          .from('label_submissions')
          .insert([submissionData])
          .select('id')
          .single();

        if (error) {
          console.error('Supabase insert error:', error);
          throw error;
        }
        setSubmissionId(data.id);
      }

      setCurrentStep(6);
      window.scrollTo(0, 0);

      toast({
        title: "Formulaire envoyé",
        description: "Votre demande a été enregistrée avec succès.",
      });
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la soumission du formulaire.",
        variant: "destructive"
      });
    }
  };

  return {
    submissionId,
    handleSave,
    handleSubmit,
    isAuthenticated
  };
};
