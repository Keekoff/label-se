import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FormState } from "./types";
import { useNavigate } from "react-router-dom";
import { getJustificatifs } from "@/components/form/steps/FormPart1";
import { getJustificatifsForPart2 } from "@/components/form/steps/FormPart2";
import { getJustificatifsForPart3 } from "@/components/form/steps/FormPart3";

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
      
      // Toutes les questions qui pourraient avoir des justificatifs
      const questionsWithJustificatifs = [
        // Partie 1
        { id: "diversity", dbName: "diversite", displayName: "Diversité", part: 1 },
        { id: "equality", dbName: "egalite", displayName: "Égalité", part: 1 },
        { id: "handicap", dbName: "situation_handicap", displayName: "Handicap", part: 1 },
        { id: "health", dbName: "sante_bien_etre", displayName: "Santé des salariés/bien-être au travail", part: 1 },
        { id: "parentality", dbName: "parentalite", displayName: "Parentalité", part: 1 },
        { id: "training", dbName: "formation", displayName: "Formation", part: 1 },
        { id: "csr", dbName: "politique_rse", displayName: "Politique RSE", part: 1 },
        { id: "privacy", dbName: "confidentialite_donnees", displayName: "Privacy/Data", part: 1 },
        { id: "transport", dbName: "mobilite", displayName: "Transports", part: 1 },
        
        // Partie 2
        { id: "associativeContribution", dbName: "contribution_associative", displayName: "Contribution associative", part: 2 },
        { id: "responsiblePurchasing", dbName: "achats_responsables", displayName: "Politique d'achats responsables", part: 2 },
        { id: "responsibleDigital", dbName: "numerique_responsable", displayName: "Numérique responsable", part: 2 },
        { id: "communication", dbName: "communication_transparente", displayName: "Communication", part: 2 },
        { id: "supplierRelations", dbName: "relations_fournisseurs", displayName: "Relation fournisseurs et prestataires", part: 2 },
        { id: "socialImpact", dbName: "impact_social", displayName: "Prise en compte de l'impact social", part: 2 },
        
        // Partie 3
        { id: "production", dbName: "production_durable", displayName: "Production : énergie & matériaux utilisés", part: 3 },
        { id: "ecoDesign", dbName: "eco_conception", displayName: "Éco-conception", part: 3 },
        { id: "continuousEvaluation", dbName: "evaluation_continue", displayName: "Évaluation permanente", part: 3 },
        { id: "energyManagement", dbName: "gestion_energie", displayName: "Maîtrise et optimisation de la consommation de ressources énergétiques", part: 3 },
        { id: "carbonEmissions", dbName: "emissions_carbone", displayName: "Plan de contrôle / limite des émissions carbones", part: 3 },
        { id: "circularEconomy", dbName: "economie_circulaire", displayName: "Gestion participative & économie circulaire", part: 3 },
        { id: "wasteManagement", dbName: "gestion_dechets", displayName: "Recyclage & gestion des déchets", part: 3 },
      ];
      
      // Préparation pour l'upsert
      const formJustificatifsData: Array<{
        submission_id: string;
        question_identifier: string;
        response: string;
        justificatifs: string[];
      }> = [];
      
      // Pour chaque question avec justificatifs
      for (const question of questionsWithJustificatifs) {
        const responses = formState[question.id] || [];
        
        console.log(`Processing question ${question.id} with responses:`, responses);
        
        // Pour chaque réponse sélectionnée
        for (const response of responses) {
          // Ignorer les réponses "Ne s'applique pas" car elles n'ont pas besoin de justificatifs
          if (response.includes("Ce critère ne s'applique pas")) {
            console.log(`Skipping justificatifs for "${response}" as it's a N/A response`);
            continue;
          }
          
          try {
            // Obtenir les justificatifs associés à cette réponse
            let justificatifs: string[] = [];
            
            // Utiliser la fonction appropriée selon la partie du formulaire
            if (question.part === 1) {
              justificatifs = getJustificatifs(question.id, response);
              console.log(`Got justificatifs for part 1 ${question.id}/${response}:`, justificatifs);
            } else if (question.part === 2) {
              justificatifs = getJustificatifsForPart2(question.id, response);
              console.log(`Got justificatifs for part 2 ${question.id}/${response}:`, justificatifs);
            } else if (question.part === 3) {
              justificatifs = getJustificatifsForPart3(question.id, response);
              console.log(`Got justificatifs for part 3 ${question.id}/${response}:`, justificatifs);
            }
            
            // N'ajouter les données de justificatifs que si des justificatifs existent
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
            // Continuer avec d'autres réponses au lieu d'échouer complètement
          }
        }
      }
      
      // Si des données de justificatifs existent, les insérer dans la base de données
      if (formJustificatifsData.length > 0) {
        console.log("Saving justificatifs data:", formJustificatifsData);
        
        // Upsert chaque justificatif individuellement pour éviter les problèmes avec le format
        for (const justifData of formJustificatifsData) {
          const { error } = await supabase
            .from('form_justificatifs')
            .upsert([justifData], { 
              onConflict: 'submission_id,question_identifier,response' 
            });
          
          if (error) {
            console.error(`Erreur lors de la sauvegarde du justificatif ${justifData.question_identifier}/${justifData.response}:`, error);
          } else {
            console.log(`Justificatif ${justifData.question_identifier}/${justifData.response} sauvegardé avec succès`);
          }
        }
        
        console.log("Tous les justificatifs ont été traités!");
      } else {
        console.log("Aucune donnée de justificatifs à sauvegarder");
      }
    } catch (error) {
      console.error("Erreur lors de la sauvegarde des justificatifs:", error);
      // Au lieu de lancer une erreur et d'échouer la soumission du formulaire, nous nous contenterons de journaliser l'erreur
      // et d'informer l'utilisateur qu'il y a eu un problème avec les justificatifs
      toast({
        title: "Attention",
        description: "Le formulaire a été envoyé mais nous avons rencontré un problème lors de l'enregistrement des justificatifs.",
        variant: "destructive" 
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
    console.log("responsiblePurchasing:", data.responsiblePurchasing);
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
      
      // Partie 2 - Correspondance exacte entre les noms de champs du formulaire et ceux de la BDD
      contribution_associative: formatResponses(data.associativeContribution),
      achats_responsables: formatResponses(data.responsiblePurchasing),
      numerique_responsable: formatResponses(data.responsibleDigital),
      communication_transparente: formatResponses(data.communication),
      relations_fournisseurs: formatResponses(data.supplierRelations),
      impact_social: formatResponses(data.socialImpact),
      
      // Partie 3 - Correspondance exacte entre les noms de champs du formulaire et ceux de la BDD
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
            variant: "destructive"
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
