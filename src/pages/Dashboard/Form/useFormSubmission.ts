
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FormState } from "./types";
import { useNavigate } from "react-router-dom";
import { getJustificatifs } from "@/components/form/steps/FormPart1";
import { getJustificatifsForPart2 } from "@/components/form/steps/FormPart2/index";
import { getJustificatifsForPart3 } from "@/components/form/steps/FormPart3";

// Make.com webhook URL
const MAKE_WEBHOOK_URL = "https://hook.eu1.make.com/20xuorrw61s481mz4f7lwqrdfgotq5qj";
// Airtable webhook URL
const AIRTABLE_WEBHOOK_URL = "https://hooks.airtable.com/workflows/v1/genericWebhook/app7al7op0zAJYssh/wflbARC3gzJSHop4x/wtrKWQPw2IQft4ctV";

export const useFormSubmission = (
  formState: FormState,
  setCurrentStep: (step: number) => void
) => {
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { toast } = useToast();
  const navigate = useNavigate();

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

  const formatResponses = (responses: string[] | undefined): string[] => {
    if (responses && Array.isArray(responses) && responses.length > 0) {
      return responses;
    }
    return [];
  };

  const saveFormJustificatifs = async (submissionId: string) => {
    try {
      console.log("Starting to save justificatifs for submission:", submissionId);
      
      const questionsWithJustificatifs = [
        { id: "diversity", dbName: "diversite", displayName: "Diversité", part: 1 },
        { id: "equality", dbName: "egalite", displayName: "Égalité", part: 1 },
        { id: "handicap", dbName: "situation_handicap", displayName: "Handicap", part: 1 },
        { id: "health", dbName: "sante_bien_etre", displayName: "Santé des salariés/bien-être au travail", part: 1 },
        { id: "parentality", dbName: "parentalite", displayName: "Parentalité", part: 1 },
        { id: "training", dbName: "formation", displayName: "Formation", part: 1 },
        { id: "csr", dbName: "politique_rse", displayName: "Politique RSE", part: 1 },
        { id: "privacy", dbName: "confidentialite_donnees", displayName: "Privacy/Data", part: 1 },
        { id: "transport", dbName: "mobilite", displayName: "Transports", part: 1 },
        
        { id: "associativeContribution", dbName: "contribution_associative", displayName: "Contribution associative", part: 2 },
        { id: "responsiblePurchasing", dbName: "achats_responsables", displayName: "Politique d'achats responsables", part: 2 },
        { id: "responsibleDigital", dbName: "numerique_responsable", displayName: "Numérique responsable", part: 2 },
        { id: "communication", dbName: "communication_transparente", displayName: "Communication", part: 2 },
        { id: "supplierRelations", dbName: "relations_fournisseurs", displayName: "Relation fournisseurs et prestataires", part: 2 },
        { id: "socialImpact", dbName: "impact_social", displayName: "Prise en compte de l'impact social", part: 2 },
        
        { id: "production", dbName: "production_durable", displayName: "Production : énergie & matériaux utilisés", part: 3 },
        { id: "ecoDesign", dbName: "eco_conception", displayName: "Éco-conception", part: 3 },
        { id: "continuousEvaluation", dbName: "evaluation_continue", displayName: "Évaluation permanente", part: 3 },
        { id: "energyManagement", dbName: "gestion_energie", displayName: "Maîtrise et optimisation de la consommation de ressources énergétiques", part: 3 },
        { id: "carbonEmissions", dbName: "emissions_carbone", displayName: "Plan de contrôle / limite des émissions carbones", part: 3 },
        { id: "circularEconomy", dbName: "economie_circulaire", displayName: "Gestion participative & économie circulaire", part: 3 },
        { id: "wasteManagement", dbName: "gestion_dechets", displayName: "Recyclage & gestion des déchets", part: 3 },
      ];

      const formJustificatifsData: Array<{
        submission_id: string;
        question_identifier: string;
        response: string;
        justificatifs: string[];
      }> = [];

      for (const question of questionsWithJustificatifs) {
        const responses = formState[question.id] || [];
        
        console.log(`Processing question ${question.id} with responses:`, responses);
        
        for (const response of responses) {
          if (response.includes("Ce critère ne s'applique pas")) {
            console.log(`Skipping justificatifs for "${response}" as it's a N/A response`);
            continue;
          }
          
          try {
            let justificatifs: string[] = [];
            
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
          }
        }
      }
      
      if (formJustificatifsData.length > 0) {
        console.log("Saving justificatifs data:", formJustificatifsData);
        
        // First, clear existing justificatifs for this submission to avoid duplicates
        const { error: clearError } = await supabase
          .from('form_justificatifs')
          .delete()
          .eq('submission_id', submissionId);
        
        if (clearError) {
          console.error("Error clearing existing justificatifs:", clearError);
        } else {
          console.log("Successfully cleared existing justificatifs");
        }
        
        // Now insert all the new justificatifs
        for (const justifData of formJustificatifsData) {
          const { error } = await supabase
            .from('form_justificatifs')
            .insert([justifData]);
          
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
      
      diversite: formatResponses(data.diversity),
      egalite: formatResponses(data.equality),
      situation_handicap: formatResponses(data.handicap),
      sante_bien_etre: formatResponses(data.health),
      parentalite: formatResponses(data.parentality),
      formation: formatResponses(data.training),
      politique_rse: formatResponses(data.csr),
      confidentialite_donnees: formatResponses(data.privacy),
      mobilite: formatResponses(data.transport),
      
      contribution_associative: formatResponses(data.associativeContribution),
      achats_responsables: formatResponses(data.responsiblePurchasing),
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
      gestion_dechets: formatResponses(data.wasteManagement)
    };

    console.log('== DEBUG - Données formatées avant envoi à la BDD ==', formattedData);
    
    return formattedData;
  };

  const formatDataForWebhook = (data: any) => {
    console.log('Formatage des données pour le webhook Make.com');
    
    // Créer un tableau pour stocker toutes les réponses
    const réponses = [];
    
    // Regrouper toutes les questions et leurs réponses dans des collections
    // Partie 1: Questions humaines et sociales
    if (data.diversite && data.diversite.length > 0) {
      réponses.push({
        question: "Diversité",
        catégorie: "Humain & Social",
        partie: 1,
        réponses: data.diversite
      });
    }
    
    if (data.egalite && data.egalite.length > 0) {
      réponses.push({
        question: "Égalité",
        catégorie: "Humain & Social",
        partie: 1,
        réponses: data.egalite
      });
    }
    
    if (data.situation_handicap && data.situation_handicap.length > 0) {
      réponses.push({
        question: "Situation de handicap",
        catégorie: "Humain & Social",
        partie: 1,
        réponses: data.situation_handicap
      });
    }
    
    if (data.sante_bien_etre && data.sante_bien_etre.length > 0) {
      réponses.push({
        question: "Santé des salariés/bien-être au travail",
        catégorie: "Humain & Social",
        partie: 1,
        réponses: data.sante_bien_etre
      });
    }
    
    if (data.parentality && data.parentality.length > 0) {
      réponses.push({
        question: "Parentalité",
        catégorie: "Humain & Social",
        partie: 1,
        réponses: data.parentality
      });
    }
    
    if (data.formation && data.formation.length > 0) {
      réponses.push({
        question: "Formation",
        catégorie: "Humain & Social",
        partie: 1,
        réponses: data.formation
      });
    }
    
    if (data.politique_rse && data.politique_rse.length > 0) {
      réponses.push({
        question: "Politique RSE",
        catégorie: "Humain & Social",
        partie: 1,
        réponses: data.politique_rse
      });
    }
    
    if (data.confidentialite_donnees && data.confidentialite_donnees.length > 0) {
      réponses.push({
        question: "Privacy/Data",
        catégorie: "Humain & Social",
        partie: 1,
        réponses: data.confidentialite_donnees
      });
    }
    
    if (data.mobilite && data.mobilite.length > 0) {
      réponses.push({
        question: "Transports",
        catégorie: "Humain & Social",
        partie: 1,
        réponses: data.mobilite
      });
    }
    
    // Partie 2: Questions économiques et sociétales
    if (data.contribution_associative && data.contribution_associative.length > 0) {
      réponses.push({
        question: "Contribution associative",
        catégorie: "Économique & Sociétal",
        partie: 2,
        réponses: data.contribution_associative
      });
    }
    
    if (data.achats_responsables && data.achats_responsables.length > 0) {
      réponses.push({
        question: "Politique d'achats responsables",
        catégorie: "Économique & Sociétal",
        partie: 2,
        réponses: data.achats_responsables
      });
    }
    
    if (data.numerique_responsable && data.numerique_responsable.length > 0) {
      réponses.push({
        question: "Numérique responsable",
        catégorie: "Économique & Sociétal",
        partie: 2,
        réponses: data.numerique_responsable
      });
    }
    
    if (data.communication_transparente && data.communication_transparente.length > 0) {
      réponses.push({
        question: "Communication",
        catégorie: "Économique & Sociétal",
        partie: 2,
        réponses: data.communication_transparente
      });
    }
    
    if (data.relations_fournisseurs && data.relations_fournisseurs.length > 0) {
      réponses.push({
        question: "Relation fournisseurs et prestataires",
        catégorie: "Économique & Sociétal",
        partie: 2,
        réponses: data.relations_fournisseurs
      });
    }
    
    if (data.impact_social && data.impact_social.length > 0) {
      réponses.push({
        question: "Prise en compte de l'impact social",
        catégorie: "Économique & Sociétal",
        partie: 2,
        réponses: data.impact_social
      });
    }
    
    // Partie 3: Questions environnementales
    if (data.production_durable && data.production_durable.length > 0) {
      réponses.push({
        question: "Production : énergie & matériaux utilisés",
        catégorie: "Environnemental",
        partie: 3,
        réponses: data.production_durable
      });
    }
    
    if (data.eco_conception && data.eco_conception.length > 0) {
      réponses.push({
        question: "Éco-conception",
        catégorie: "Environnemental",
        partie: 3,
        réponses: data.eco_conception
      });
    }
    
    if (data.evaluation_continue && data.evaluation_continue.length > 0) {
      réponses.push({
        question: "Évaluation permanente",
        catégorie: "Environnemental",
        partie: 3,
        réponses: data.evaluation_continue
      });
    }
    
    if (data.gestion_energie && data.gestion_energie.length > 0) {
      réponses.push({
        question: "Maîtrise et optimisation de la consommation de ressources énergétiques",
        catégorie: "Environnemental",
        partie: 3,
        réponses: data.gestion_energie
      });
    }
    
    if (data.emissions_carbone && data.emissions_carbone.length > 0) {
      réponses.push({
        question: "Plan de contrôle / limite des émissions carbones",
        catégorie: "Environnemental",
        partie: 3,
        réponses: data.emissions_carbone
      });
    }
    
    if (data.economie_circulaire && data.economie_circulaire.length > 0) {
      réponses.push({
        question: "Gestion participative & économie circulaire",
        catégorie: "Environnemental",
        partie: 3,
        réponses: data.economie_circulaire
      });
    }
    
    if (data.gestion_dechets && data.gestion_dechets.length > 0) {
      réponses.push({
        question: "Recyclage & gestion des déchets",
        catégorie: "Environnemental",
        partie: 3,
        réponses: data.gestion_dechets
      });
    }
    
    // Informations de l'entreprise
    const informationsEntreprise = {
      nom_entreprise: data.nom_entreprise,
      secteurs_activite: data.secteurs_activite,
      forme_juridique: data.forme_juridique,
      adresse: data.adresse,
      code_postal: data.code_postal,
      ville: data.ville,
      annee_creation: data.annee_creation,
      nombre_employes: data.nombre_employes,
      a_financements: data.a_financements,
      details_financement: data.details_financement,
    };
    
    // Informations du contact
    const informationsContact = {
      prenom: data.prenom,
      courriel: data.courriel,
      user_id: data.user_id,
    };
    
    // Objet final pour le webhook
    const webhookPayload = {
      réponses: réponses,
      informations_entreprise: informationsEntreprise,
      informations_contact: informationsContact,
      date_soumission: new Date().toISOString(),
      id_soumission: data.id
    };
    
    console.log('Payload formaté pour le webhook:', webhookPayload);
    return webhookPayload;
  };

  const sendToMakeWebhook = async (data: any) => {
    try {
      console.log('Préparation de l\'envoi des données au webhook Make.com');
      
      // Formatage des données selon la structure demandée
      const formattedData = formatDataForWebhook(data);
      
      // Assurons-nous que le contenu est bien un objet JSON valide
      const jsonPayload = JSON.stringify(formattedData);
      console.log('Payload JSON à envoyer:', jsonPayload);
      
      // Utilisation directe de fetch avec timeout pour éviter les problèmes de connexion
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout
      
      const response = await fetch(MAKE_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: jsonPayload,
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      const responseText = await response.text();
      console.log('Réponse du webhook:', responseText);
      
      if (!response.ok) {
        console.error('Erreur lors de l\'envoi au webhook Make.com:', response.status);
        console.error('Détails de l\'erreur:', responseText);
        throw new Error(`Erreur HTTP: ${response.status}`);
      }
      
      console.log('Données envoyées avec succès au webhook Make.com');
      return true;
    } catch (error) {
      console.error('Erreur lors de l\'envoi au webhook:', error);
      // Continue with form submission even if webhook call fails
      return false;
    }
  };

  const sendToAirtableWebhook = async (data: any) => {
    try {
      console.log('Envoi des données au webhook Airtable');
      
      // Format the data for Airtable webhook
      const webhookPayload = {
        company_name: data.nom_entreprise || "Non spécifié",
        company_sector: Array.isArray(data.secteurs_activite) && data.secteurs_activite.length > 0 
          ? data.secteurs_activite.join(", ") 
          : "Non spécifié",
        legal_form: data.forme_juridique || "Non spécifié",
        employee_count: data.nombre_employes || "Non spécifié",
        contact_email: data.courriel || "Non spécifié",
        submission_date: new Date().toISOString(),
        submission_id: data.id || null
      };
      
      console.log('Payload pour Airtable:', webhookPayload);
      
      // Utiliser XMLHttpRequest au lieu de fetch pour éviter les problèmes CORS
      return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open('POST', AIRTABLE_WEBHOOK_URL, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        
        xhr.onload = function() {
          if (this.status >= 200 && this.status < 300) {
            console.log('Données envoyées avec succès au webhook Airtable');
            resolve(true);
          } else {
            console.error('Erreur lors de l\'envoi au webhook Airtable:', this.status);
            console.error('Détails de l\'erreur:', this.responseText);
            // On continue quand même
            resolve(false);
          }
        };
        
        xhr.onerror = function() {
          console.error('Erreur réseau lors de l\'envoi au webhook Airtable');
          // On continue quand même
          resolve(false);
        };
        
        xhr.send(JSON.stringify(webhookPayload));
      });
    } catch (error) {
      console.error('Erreur lors de l\'envoi au webhook Airtable:', error);
      // Continue with form submission even if webhook call fails
      return false;
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

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      const submissionData = await formatSubmissionData(formState, 'submitted');
      console.log('Submitting form with data:', submissionData);

      // Send data to Make.com webhook first
      const webhookSuccess = await sendToMakeWebhook(submissionData);
      console.log('Résultat de l\'envoi au webhook Make.com:', webhookSuccess ? 'Succès' : 'Échec');
      
      // Send data to Airtable webhook
      const airtableWebhookSuccess = await sendToAirtableWebhook(submissionData);
      console.log('Résultat de l\'envoi au webhook Airtable:', airtableWebhookSuccess ? 'Succès' : 'Échec');

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

      if (finalSubmissionId) {
        try {
          await saveFormJustificatifs(finalSubmissionId);
        } catch (justificatifsError) {
          console.error('Error saving justificatifs:', justificatifsError);
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    submissionId,
    handleSave,
    handleSubmit,
    isAuthenticated,
    isSubmitting
  };
};
