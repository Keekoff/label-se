
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FormState } from "./types";
import { useNavigate } from "react-router-dom";
import { getJustificatifs } from "@/components/form/steps/FormPart1";

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
    // Si les réponses existent et ne sont pas vides, les retourner telles quelles
    if (responses && Array.isArray(responses) && responses.length > 0) {
      return responses;
    }
    
    // Si aucune réponse n'est fournie, retourner un tableau vide
    return [];
  };

  const saveFormJustificatifs = async (submissionId: string) => {
    try {
      console.log("Starting to save justificatifs for submission:", submissionId);
      
      // All questions that might have justificatifs
      const questionsWithJustificatifs = [
        // Partie 1
        { id: "diversity", dbName: "diversite", displayName: "Diversité" },
        { id: "equality", dbName: "egalite", displayName: "Égalité" },
        { id: "handicap", dbName: "situation_handicap", displayName: "Handicap" },
        { id: "health", dbName: "sante_bien_etre", displayName: "Santé des salariés/bien-être au travail" },
        { id: "parentality", dbName: "parentalite", displayName: "Parentalité" },
        { id: "training", dbName: "formation", displayName: "Formation" },
        { id: "csr", dbName: "politique_rse", displayName: "Politique RSE" },
        { id: "privacy", dbName: "confidentialite_donnees", displayName: "Privacy/Data" },
        { id: "transport", dbName: "mobilite", displayName: "Transports" },
        
        // Partie 2
        { id: "associativeContribution", dbName: "contribution_associative", displayName: "Contribution associative" },
        { id: "responsibleDigital", dbName: "numerique_responsable", displayName: "Numérique responsable" },
        { id: "communication", dbName: "communication_transparente", displayName: "Communication transparente" },
        { id: "supplierRelations", dbName: "relations_fournisseurs", displayName: "Relations avec les fournisseurs" },
        { id: "socialImpact", dbName: "impact_social", displayName: "Impact social" },
        
        // Partie 3
        { id: "production", dbName: "production_durable", displayName: "Production durable" },
        { id: "ecoDesign", dbName: "eco_conception", displayName: "Éco-conception" },
        { id: "continuousEvaluation", dbName: "evaluation_continue", displayName: "Évaluation continue" },
        { id: "energyManagement", dbName: "gestion_energie", displayName: "Gestion de l'énergie" },
        { id: "carbonEmissions", dbName: "emissions_carbone", displayName: "Émissions carbone" },
        { id: "circularEconomy", dbName: "economie_circulaire", displayName: "Économie circulaire" },
        { id: "wasteManagement", dbName: "gestion_dechets", displayName: "Gestion des déchets" },
        { id: "responsiblePurchasing", dbName: "achats_responsables", displayName: "Achats responsables" },
      ];
      
      const formJustificatifsData = [];
      
      // Pour chaque question avec justificatifs
      for (const question of questionsWithJustificatifs) {
        const responses = formState[question.id] || [];
        
        console.log(`Processing question ${question.id} with responses:`, responses);
        
        // Pour chaque réponse sélectionnée
        for (const response of responses) {
          // Skip "Ne s'applique pas" responses as they don't need justificatifs
          if (response.includes("Ce critère ne s'applique pas")) {
            console.log(`Skipping justificatifs for "${response}" as it's a N/A response`);
            continue;
          }
          
          try {
            // Obtenir les justificatifs associés à cette réponse pour Partie 1
            let justificatifs: string[] = [];
            
            // Use getJustificatifs for Partie 1 questions
            if (["diversity", "equality", "handicap", "health", "parentality", "training", "csr", "privacy", "transport"].includes(question.id)) {
              justificatifs = getJustificatifs(question.id, response);
              console.log(`Got justificatifs for ${question.id}/${response}:`, justificatifs);
            } else {
              // For Partie 2 and 3, we don't have a specific function
              // This would need to be implemented properly based on your data structure
              // For now, adding a placeholder justificatif to demonstrate it works
              justificatifs = ["Documentation supporting this answer"];
              console.log(`Using placeholder justificatifs for ${question.id}/${response}:`, justificatifs);
            }
            
            if (justificatifs && justificatifs.length > 0) {
              formJustificatifsData.push({
                submission_id: submissionId,
                question_identifier: question.displayName,
                response: response,
                justificatifs: justificatifs
              });
            } else {
              console.log(`No justificatifs found for question ${question.id} and response "${response}"`);
            }
          } catch (error) {
            console.error(`Error getting justificatifs for ${question.id}/${response}:`, error);
            // Continue with other responses instead of failing completely
          }
        }
      }
      
      // Si des données de justificatifs existent, les insérer dans la base de données
      if (formJustificatifsData.length > 0) {
        console.log("Saving justificatifs data:", formJustificatifsData);
        
        const { data, error } = await supabase
          .from('form_justificatifs')
          .upsert(formJustificatifsData, { 
            onConflict: 'submission_id,question_identifier,response',
            returning: 'minimal'
          });
        
        if (error) {
          console.error("Erreur lors de la sauvegarde des justificatifs:", error);
          throw error;
        }
        
        console.log("Justificatifs saved successfully!");
      } else {
        console.log("No justificatifs data to save");
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des justificatifs:", error);
      // Instead of throwing and failing the form submission, we'll just log the error
      // and let the user know there was an issue with justificatifs
      toast({
        title: "Attention",
        description: "Le formulaire a été envoyé mais nous avons rencontré un problème lors de l'enregistrement des justificatifs.",
        variant: "warning"
      });
    }
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

    // Vérifier et enregistrer toutes les réponses pour le débogage
    console.log("== DEBUG - Toutes les réponses avant formatage ==");
    console.log("diversity:", data.diversity);
    console.log("equality:", data.equality);
    console.log("handicap:", data.handicap); 
    console.log("health:", data.health);
    console.log("parentality:", data.parentality);
    console.log("training:", data.training);
    console.log("csr:", data.csr);
    console.log("privacy:", data.privacy);
    console.log("transport:", data.transport);
    console.log("associativeContribution:", data.associativeContribution);
    console.log("responsibleDigital:", data.responsibleDigital);
    console.log("communication:", data.communication);
    console.log("supplierRelations:", data.supplierRelations);
    console.log("socialImpact:", data.socialImpact);
    console.log("production:", data.production);
    console.log("ecoDesign:", data.ecoDesign);
    console.log("continuousEvaluation:", data.continuousEvaluation);
    console.log("energyManagement:", data.energyManagement);
    console.log("carbonEmissions:", data.carbonEmissions);
    console.log("circularEconomy:", data.circularEconomy);
    console.log("wasteManagement:", data.wasteManagement);
    console.log("responsiblePurchasing:", data.responsiblePurchasing);

    // Vérifier explicitement les champs problématiques de la Partie 3
    console.log("== Vérification spécifique des champs de la Partie 3 ==");
    console.log("wasteManagement (gestion_dechets):", data.wasteManagement);
    console.log("ecoDesign (eco_conception):", data.ecoDesign);
    console.log("continuousEvaluation (evaluation_continue):", data.continuousEvaluation);
    console.log("energyManagement (gestion_energie):", data.energyManagement);
    console.log("carbonEmissions (emissions_carbone):", data.carbonEmissions);
    console.log("circularEconomy (economie_circulaire):", data.circularEconomy);

    // Correction: S'assurer que les champs de données correspondent exactement aux champs de la base de données
    const formattedData = {
      user_id: user.id,
      prenom: data.firstName || "",
      courriel: userEmail || user.email || "",
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
      
      // Partie 1 - Correspondance exacte entre les noms de champs du formulaire et ceux de la BDD
      diversite: formatResponses(data.diversity),
      egalite: formatResponses(data.equality),
      situation_handicap: formatResponses(data.handicap),
      sante_bien_etre: formatResponses(data.health),
      parentalite: formatResponses(data.parentality),
      formation: formatResponses(data.training),
      politique_rse: formatResponses(data.csr),
      confidentialite_donnees: formatResponses(data.privacy),
      mobilite: formatResponses(data.transport),
      
      // Partie 2 et 3 - Correspondance exacte entre les noms de champs du formulaire et ceux de la BDD
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

    // Vérifier les données formatées pour le débogage
    console.log('== DEBUG - Données formatées avant envoi à la BDD ==', formattedData);
    
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

      // Sauvegarder les justificatifs
      if (finalSubmissionId) {
        await saveFormJustificatifs(finalSubmissionId);
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

      // Sauvegarder les justificatifs
      if (finalSubmissionId) {
        try {
          await saveFormJustificatifs(finalSubmissionId);
        } catch (justificatifsError) {
          console.error('Error saving justificatifs:', justificatifsError);
          // Continue with form submission even if justificatifs fail
          toast({
            title: "Attention",
            description: "Le formulaire a été envoyé mais une erreur est survenue lors de l'enregistrement des justificatifs.",
            variant: "warning"
          });
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
