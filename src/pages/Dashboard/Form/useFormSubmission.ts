
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
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
      
      if (session) {
        setUserEmail(session.user.email);
      } else {
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

  // Fonction d'aide pour s'assurer que les réponses sont correctement formatées
  const formatResponses = (responses: string[] | undefined): string[] => {
    if (!responses || !Array.isArray(responses)) return [];
    
    // S'assurer que les réponses vides sont remplacées par "Ce critère ne s'applique pas à mon entreprise"
    if (responses.length === 0) {
      return ["Ce critère ne s'applique pas à mon entreprise"];
    }
    
    return responses;
  };

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

    // S'assurer que chaque champ de réponse est correctement formaté
    // Utiliser l'email de la session au lieu de celui du formulaire
    const formattedData = {
      user_id: user.id,
      prenom: data.firstName || "",
      courriel: userEmail || user.email || "", // Utiliser l'email de l'utilisateur connecté
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
      
      // Part 1 fields with updated French names - assurer que "Ce critère ne s'applique pas à mon entreprise" est inclus
      diversite: formatResponses(data.diversity),
      egalite: formatResponses(data.equality),
      situation_handicap: formatResponses(data.handicap),
      sante_bien_etre: formatResponses(data.health),
      parentalite: formatResponses(data.parentality),
      formation: formatResponses(data.training),
      politique_rse: formatResponses(data.csr),
      confidentialite_donnees: formatResponses(data.privacy),
      mobilite: formatResponses(data.transport),
      
      // Part 2 and 3 fields with updated French names - assurer que "Ce critère ne s'applique pas à mon entreprise" est inclus
      contribution_associative: formatResponses(data.associativeContribution),
      numerique_responsable: formatResponses(data.responsibleDigital),
      communication_transparente: formatResponses(data.communication),
      relations_fournisseurs: formatResponses(data.supplierRelations),
      impact_social: formatResponses(data.socialImpact),
      production_durable: formatResponses(data.production),
      eco_conception: formatResponses(data.ecoDesign),
      evaluation_continue: formatResponses(data.continuousEvaluation),
      gestion_energie: formatResponses(data.energyManagement),
      emissions_carbone: formatResponses(data.carbonEmissions),
      economie_circulaire: formatResponses(data.circularEconomy),
      gestion_dechets: formatResponses(data.wasteManagement),
      achats_responsables: formatResponses(data.responsiblePurchasing)
    };

    // Log the formatted data for debugging
    console.log('Formatted submission data:', formattedData);
    
    return formattedData;
  };

  // Fonction pour créer les justificatifs manquants pour les réponses "Ce critère ne s'applique pas à mon entreprise"
  const createDefaultJustificatifs = async (submissionUuid: string) => {
    try {
      const { data: submission } = await supabase
        .from('label_submissions')
        .select('*')
        .eq('id', submissionUuid)
        .single();
      
      if (!submission) return;
      
      const formFields = [
        { dbField: 'diversite', name: 'diversite' },
        { dbField: 'egalite', name: 'egalite' },
        { dbField: 'situation_handicap', name: 'situation_handicap' },
        { dbField: 'sante_bien_etre', name: 'sante_bien_etre' },
        { dbField: 'parentalite', name: 'parentalite' },
        { dbField: 'formation', name: 'formation' },
        { dbField: 'politique_rse', name: 'politique_rse' },
        { dbField: 'confidentialite_donnees', name: 'confidentialite_donnees' },
        { dbField: 'mobilite', name: 'mobilite' },
        { dbField: 'contribution_associative', name: 'contribution_associative' },
        { dbField: 'achats_responsables', name: 'achats_responsables' },
        { dbField: 'numerique_responsable', name: 'numerique_responsable' },
        { dbField: 'communication_transparente', name: 'communication_transparente' },
        { dbField: 'relations_fournisseurs', name: 'relations_fournisseurs' },
        { dbField: 'impact_social', name: 'impact_social' },
        { dbField: 'production_durable', name: 'production_durable' },
        { dbField: 'gestion_dechets', name: 'gestion_dechets' },
        { dbField: 'eco_conception', name: 'eco_conception' },
        { dbField: 'evaluation_continue', name: 'evaluation_continue' },
        { dbField: 'gestion_energie', name: 'gestion_energie' },
        { dbField: 'emissions_carbone', name: 'emissions_carbone' },
        { dbField: 'economie_circulaire', name: 'economie_circulaire' }
      ];
      
      // Pour chaque champ du formulaire
      for (const field of formFields) {
        const responses = submission[field.dbField] as string[];
        
        // Si "Ce critère ne s'applique pas à mon entreprise" est une réponse
        if (responses && responses.some(r => r === "Ce critère ne s'applique pas à mon entreprise")) {
          // Vérifier si un justificatif existe déjà pour cette réponse et cette question
          const { data: existingJustificatif } = await supabase
            .from('justificatifs')
            .select('*')
            .eq('questions', field.name)
            .eq('reponses', "Ce critère ne s'applique pas à mon entreprise")
            .eq('submission_id', submissionUuid);
          
          // Si aucun justificatif n'existe, en créer un
          if (!existingJustificatif || existingJustificatif.length === 0) {
            await supabase
              .from('justificatifs')
              .insert([{
                questions: field.name,
                reponses: "Ce critère ne s'applique pas à mon entreprise",
                submission_id: submissionUuid
              }]);
          }
        }
      }
    } catch (error) {
      console.error('Erreur lors de la création des justificatifs par défaut:', error);
    }
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

      let finalSubmissionId = submissionId;

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
        finalSubmissionId = data.id;
        setSubmissionId(data.id);
      }

      // Associer les justificatifs existants à la soumission
      if (finalSubmissionId) {
        try {
          // Appeler la fonction PostgreSQL pour associer les justificatifs
          const { error } = await supabase.rpc('link_justificatifs_to_submission', {
            submission_uuid: finalSubmissionId
          });

          if (error) {
            console.error('Erreur lors de l\'association des justificatifs:', error);
          }

          // Créer des justificatifs pour les réponses "Ce critère ne s'applique pas à mon entreprise"
          await createDefaultJustificatifs(finalSubmissionId);
        } catch (err) {
          console.error('Erreur lors de l\'appel à la fonction RPC:', err);
        }
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
