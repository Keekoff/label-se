
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

    // Map form data to correctly renamed database fields
    const formattedData = {
      user_id: user.id,
      prenom: data.firstName || "",
      courriel: data.email || "",
      nom_entreprise: data.companyName || "",
      secteurs_activite: Array.isArray(data.sectors) ? data.sectors : [],
      forme_juridique: data.legalForm || "",
      adresse: data.streetAddress || "",
      code_postal: data.postalCode || "",
      ville: data.city || "",
      annee_creation: data.foundingYear || "",
      nombre_employes: data.employeeCount || "",
      a_financements: data.hasFunding || "",
      details_financement: data.fundingDetails || "",
      status: status,
      current_step: status === 'submitted' ? 6 : data.currentStep || 1,
      disclaimer_accepted: !!data.disclaimerAccepted,
      // Part 1 fields with updated French names
      diversite: Array.isArray(data.diversity) ? data.diversity : [],
      egalite: Array.isArray(data.equality) ? data.equality : [],
      situation_handicap: Array.isArray(data.handicap) ? data.handicap : [],
      sante_bien_etre: Array.isArray(data.health) ? data.health : [],
      parentalite: Array.isArray(data.parentality) ? data.parentality : [],
      formation: Array.isArray(data.training) ? data.training : [],
      politique_rse: Array.isArray(data.csr) ? data.csr : [],
      confidentialite_donnees: Array.isArray(data.privacy) ? data.privacy : [],
      mobilite: Array.isArray(data.transport) ? data.transport : [],
      // Part 2 and 3 fields with updated French names
      contribution_associative: Array.isArray(data.associativeContribution) ? data.associativeContribution : [],
      numerique_responsable: Array.isArray(data.responsibleDigital) ? data.responsibleDigital : [],
      communication_transparente: Array.isArray(data.communication) ? data.communication : [],
      relations_fournisseurs: Array.isArray(data.supplierRelations) ? data.supplierRelations : [],
      impact_social: Array.isArray(data.socialImpact) ? data.socialImpact : [],
      production_durable: Array.isArray(data.production) ? data.production : [],
      eco_conception: Array.isArray(data.ecoDesign) ? data.ecoDesign : [],
      evaluation_continue: Array.isArray(data.continuousEvaluation) ? data.continuousEvaluation : [],
      gestion_energie: Array.isArray(data.energyManagement) ? data.energyManagement : [],
      emissions_carbone: Array.isArray(data.carbonEmissions) ? data.carbonEmissions : [],
      economie_circulaire: Array.isArray(data.circularEconomy) ? data.circularEconomy : [],
      gestion_dechets: Array.isArray(data.wasteManagement) ? data.wasteManagement : [],
      achats_responsables: Array.isArray(data.responsiblePurchasing) ? data.responsiblePurchasing : []
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
