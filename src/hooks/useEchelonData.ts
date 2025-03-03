
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useCompanyData } from '@/hooks/useCompanyData';

export type EchelonData = {
  id: string;
  echelon: string;
  governanceAverage: number;
  socialImpactAverage: number;
  environmentalAverage: number;
  totalAverage: number;
};

export const useEchelonData = () => {
  const { toast } = useToast();
  const { companyData } = useCompanyData();
  const [isLoading, setIsLoading] = useState(true);
  const [echelonData, setEchelonData] = useState<EchelonData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEchelonData = async () => {
      if (!companyData?.echelonTexte) {
        setIsLoading(false);
        return;
      }
      
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('Fetching echelon data from Airtable for echelon:', companyData.echelonTexte);
        
        const { data, error } = await supabase.functions.invoke('airtable-echelons', {
          body: { echelon: companyData.echelonTexte }
        });

        if (error) {
          console.error('Supabase function invocation error:', error);
          throw new Error(`Erreur d'invocation: ${error.message}`);
        }
        
        if (data.error) {
          console.error('Airtable error from function:', data.error, data.details || '');
          throw new Error(data.error);
        }
        
        console.log('Echelon data received:', data);
        
        // If we have data and it's an array with at least one element
        if (Array.isArray(data) && data.length > 0) {
          setEchelonData(data[0]);
        } else {
          console.warn('No echelon data found for:', companyData.echelonTexte);
          setEchelonData(null);
        }
      } catch (error) {
        console.error('Error fetching Airtable echelon data:', error);
        setError(error.message || "Impossible de récupérer les données d'échelons depuis Airtable");
        toast({
          title: "Erreur de connexion à Airtable",
          description: "Problème lors de la récupération des données d'échelons.",
          variant: "destructive"
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchEchelonData();
  }, [companyData?.echelonTexte, toast]);

  return {
    isLoading,
    echelonData,
    error
  };
};
