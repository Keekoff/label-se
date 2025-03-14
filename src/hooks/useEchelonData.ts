
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
  tier1Total: number;
  tier2Total: number;
  tier3Total: number;
};

export const useEchelonData = () => {
  const { toast } = useToast();
  const { companyData, isPremium } = useCompanyData();
  const [isLoading, setIsLoading] = useState(true);
  const [echelonData, setEchelonData] = useState<EchelonData[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEchelonData = async () => {
      setIsLoading(true);
      setError(null);
      
      // Si l'utilisateur n'est pas premium, ne pas appeler l'Edge Function
      if (!isPremium) {
        setIsLoading(false);
        return;
      }
      
      try {
        console.log('Récupération des données d\'échelon depuis Airtable');
        
        // Appeler l'Edge Function sans filtre pour récupérer toutes les données d'échelons
        const { data, error } = await supabase.functions.invoke('airtable-echelons', {
          body: { echelon: null } // Pas de filtre pour récupérer tous les échelons
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
        
        // Si nous avons des données et c'est un tableau
        if (Array.isArray(data) && data.length > 0) {
          // S'assurer que les valeurs sont des nombres
          const processedData = data.map(item => ({
            ...item,
            governanceAverage: typeof item.governanceAverage === 'number' ? item.governanceAverage : 0,
            socialImpactAverage: typeof item.socialImpactAverage === 'number' ? item.socialImpactAverage : 0,
            environmentalAverage: typeof item.environmentalAverage === 'number' ? item.environmentalAverage : 0,
            totalAverage: typeof item.totalAverage === 'number' ? item.totalAverage : 0,
            tier1Total: typeof item.tier1Total === 'number' ? item.tier1Total : 95,
            tier2Total: typeof item.tier2Total === 'number' ? item.tier2Total : 75,
            tier3Total: typeof item.tier3Total === 'number' ? item.tier3Total : 55
          }));
          
          console.log('Données d\'échelon traitées:', processedData);
          setEchelonData(processedData);
        } else {
          console.warn('Aucune donnée d\'échelon trouvée');
          // Créer des données par défaut
          setEchelonData([{
            id: "default",
            echelon: "Default",
            governanceAverage: 0,
            socialImpactAverage: 0,
            environmentalAverage: 0,
            totalAverage: 0,
            tier1Total: 95,
            tier2Total: 75,
            tier3Total: 55
          }]);
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
  }, [isPremium, toast]);

  return {
    isLoading,
    echelonData,
    error
  };
};
