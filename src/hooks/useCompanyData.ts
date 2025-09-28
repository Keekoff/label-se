
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type CompanyData = {
  companyName: string;
  governanceScore?: number;
  environmentalScore?: number;
  socialImpactScore?: number;
  averageScore?: number;
  echelonTexte?: string | string[];
  logoUrl?: string;
  dateValidation?: string;
  dateFinValidite?: string;
  developpementImpactSocialPositifPercentage?: number;
  insufficientScore?: boolean;
  criteriaScores?: {
    [key: string]: number;
  };
};

export type FetchCompanyDataResult = {
  isLoading: boolean;
  companyData: CompanyData | null;
  companyName: string;
  error: string | null;
  errorDetails: string | null;
  hasSubmittedForm: boolean;
  isPremium: boolean;
};

export const useCompanyData = (): FetchCompanyDataResult => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [companyName, setCompanyName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [hasSubmittedForm, setHasSubmittedForm] = useState<boolean>(false);
  const [isPremium, setIsPremium] = useState<boolean>(false);

  useEffect(() => {
    const fetchCompanyName = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        // Vérifier d'abord s'il y a une soumission dans label_submissions
        const { data: labelData, error: labelError } = await supabase
          .from('label_submissions')
          .select('nom_entreprise, status, payment_status')
          .eq('user_id', session.user.id)
          .maybeSingle();
        
        if (labelError) throw labelError;
        
        if (labelData) {
          setCompanyName(labelData.nom_entreprise);
          setHasSubmittedForm(true); // Si une entrée existe dans label_submissions, le formulaire d'éligibilité a été soumis
          setIsPremium(labelData.payment_status === 'paid');
          console.log(`Nom d'entreprise récupéré: ${labelData.nom_entreprise}`);
          console.log(`Statut du formulaire: ${labelData.status}`);
          console.log(`Statut premium: ${labelData.payment_status === 'paid'}`);
        } else {
          // Si pas de soumission dans label_submissions, vérifier eligibility_submissions
          const { data: eligibilityData, error: eligibilityError } = await supabase
            .from('eligibility_submissions')
            .select('legal_form')
            .eq('user_id', session.user.id)
            .single();
          
          if (eligibilityError) {
            console.log('Aucune soumission d\'éligibilité trouvée');
          } else if (eligibilityData) {
            // L'utilisateur a soumis le formulaire d'éligibilité mais pas encore commencé le formulaire de labélisation
            setHasSubmittedForm(true);
            console.log('Formulaire d\'éligibilité soumis, redirection vers le formulaire de labélisation');
          }
        }
      } catch (error) {
        console.error('Error fetching company data:', error);
      }
    };

    fetchCompanyName();
  }, [toast]);

  useEffect(() => {
    const fetchAirtableData = async () => {
      if (!companyName) return;
      
      setIsLoading(true);
      setError(null);
      setErrorDetails(null);
      
      try {
        console.log(`Fetching Airtable data for company: ${companyName}`);
        
        const { data, error } = await supabase.functions.invoke('airtable-fetch', {
          body: { companyName }
        });

        if (error) {
          console.error('Supabase function invocation error:', error);
          throw new Error(`Erreur d'invocation: ${error.message}`);
        }
        
        if (data.error) {
          console.error('Airtable error from function:', data.error, data.details || '');
          setErrorDetails(data.details || 'Aucun détail disponible');
          throw new Error(data.error);
        }
        
        console.log('Airtable data received:', data);
        console.log('Echelon texte reçu:', data.echelonTexte);

        // Transformation des données pour s'assurer que les valeurs sont en pourcentages
        const processedData = {
          ...data,
          // Conversion de governanceScore en pourcentage si nécessaire
          governanceScore: data.governanceScore !== undefined 
            ? (data.governanceScore <= 1 ? data.governanceScore : data.governanceScore / 100) 
            : undefined,
          
          // Conversion de environmentalScore en pourcentage si nécessaire
          environmentalScore: data.environmentalScore !== undefined 
            ? (data.environmentalScore <= 1 ? data.environmentalScore : data.environmentalScore / 100) 
            : undefined,
          
          // Conversion de socialImpactScore en pourcentage si nécessaire
          socialImpactScore: data.socialImpactScore !== undefined 
            ? (data.socialImpactScore <= 1 ? data.socialImpactScore : data.socialImpactScore / 100) 
            : undefined,
          
          // Conversion de averageScore en pourcentage si nécessaire
          averageScore: data.averageScore !== undefined 
            ? (data.averageScore <= 1 ? data.averageScore : data.averageScore / 100) 
            : undefined,
          
          // Traitement du champ développement d'impact social positif
          developpementImpactSocialPositifPercentage: data.developpementImpactSocialPositifPercentage !== undefined
            ? parseFloat(data.developpementImpactSocialPositifPercentage)
            : undefined,
            
          // On conserve les scores des critères tels quels
          criteriaScores: data.criteriaScores || {},
          
          // On conserve le champ insufficientScore tel quel
          insufficientScore: data.insufficientScore || false,
          
          // S'assurer que echelonTexte est bien passé
          echelonTexte: data.echelonTexte || ''
        };
        
        console.log('Processed company data:', processedData);
        setCompanyData(processedData);
      } catch (error) {
        console.error('Error fetching Airtable data:', error);
        setError(error.message || "Impossible de récupérer vos données depuis Airtable");
        // Suppression du toast d'erreur pour ne pas afficher la notification
      } finally {
        setIsLoading(false);
      }
    };

    if (companyName) {
      fetchAirtableData();
    } else {
      setIsLoading(false);
    }
  }, [companyName, toast]);

  return {
    isLoading,
    companyData,
    companyName,
    error,
    errorDetails,
    hasSubmittedForm,
    isPremium
  };
};
