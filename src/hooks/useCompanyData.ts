
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export type CompanyData = {
  companyName: string;
  governanceScore?: number;
  environmentalScore?: number;
  socialImpactScore?: number;
  averageScore?: number;
  echelonTexte?: string;
  logoUrl?: string;
  dateValidation?: string;
  dateFinValidite?: string;
  developpementImpactSocialPositifPercentage?: number;
};

export type FetchCompanyDataResult = {
  isLoading: boolean;
  companyData: CompanyData | null;
  companyName: string;
  error: string | null;
  errorDetails: string | null;
  hasSubmittedForm: boolean;
};

export const useCompanyData = (): FetchCompanyDataResult => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [companyData, setCompanyData] = useState<CompanyData | null>(null);
  const [companyName, setCompanyName] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [hasSubmittedForm, setHasSubmittedForm] = useState<boolean>(false);

  useEffect(() => {
    const fetchCompanyName = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        const { data, error } = await supabase
          .from('label_submissions')
          .select('nom_entreprise, status')
          .eq('user_id', session.user.id)
          .maybeSingle();
        
        if (error) throw error;
        
        if (data && data.nom_entreprise) {
          setCompanyName(data.nom_entreprise);
          setHasSubmittedForm(data.status !== 'draft');
          console.log(`Nom d'entreprise récupéré: ${data.nom_entreprise}`);
          console.log(`Statut du formulaire: ${data.status}`);
        } else {
          console.log('Aucun nom d\'entreprise trouvé');
        }
      } catch (error) {
        console.error('Error fetching company name:', error);
        toast({
          title: "Erreur",
          description: "Impossible de récupérer les données de votre entreprise",
          variant: "destructive"
        });
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
          
          // Traitement spécial pour développement d'impact social positif
          developpementImpactSocialPositifPercentage: 
            data["Développement d'impact social positif (%)"] !== undefined 
              ? parseFloat(data["Développement d'impact social positif (%)"]) 
              : undefined
        };
        
        console.log('Processed company data:', processedData);
        setCompanyData(processedData);
      } catch (error) {
        console.error('Error fetching Airtable data:', error);
        setError(error.message || "Impossible de récupérer vos données depuis Airtable");
        toast({
          title: "Erreur de connexion à Airtable",
          description: "Problème de connexion à la base de données. Veuillez vérifier les autorisations et identifiants Airtable.",
          variant: "destructive"
        });
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
    hasSubmittedForm
  };
};
