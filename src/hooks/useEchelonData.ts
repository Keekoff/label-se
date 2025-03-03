
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
        // Gérer le cas où echelonTexte pourrait être un tableau
        let echelonValue: string;
        if (Array.isArray(companyData.echelonTexte)) {
          echelonValue = companyData.echelonTexte[0] || '';
        } else {
          echelonValue = companyData.echelonTexte;
        }
        
        console.log('Récupération des données d\'échelon depuis Airtable pour l\'échelon:', echelonValue);
        
        const { data, error } = await supabase.functions.invoke('airtable-echelons', {
          body: { echelon: echelonValue }
        });

        if (error) {
          console.error('Erreur d\'invocation de fonction Supabase:', error);
          throw new Error(`Erreur d'invocation: ${error.message}`);
        }
        
        if (data.error) {
          console.error('Erreur Airtable depuis la fonction:', data.error, data.details || '');
          throw new Error(data.error);
        }
        
        console.log('Données d\'échelon reçues:', data);
        
        // Si nous avons des données et c'est un tableau avec au moins un élément
        if (Array.isArray(data) && data.length > 0) {
          setEchelonData(data[0]);
        } else {
          console.warn('Aucune donnée d\'échelon trouvée pour:', echelonValue);
          setEchelonData(null);
        }
      } catch (error) {
        console.error('Erreur lors de la récupération des données d\'échelon Airtable:', error);
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
