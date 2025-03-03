
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export type EchelonData = {
  id: string;
  nom: string;
  gouvernance: {
    min: number;
    max: number;
  };
  social: {
    min: number;
    max: number;
  };
  environnement: {
    min: number;
    max: number;
  };
  total: {
    min: number;
    max: number;
  };
  couleur?: string;
};

export const useEchelonData = () => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [echelons, setEchelons] = useState<EchelonData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEchelonData = async () => {
      setIsLoading(true);
      setError(null);
      
      try {
        console.log('Fetching echelon data from Airtable');
        
        const { data, error } = await supabase.functions.invoke('airtable-echelons');

        if (error) {
          console.error('Supabase function invocation error:', error);
          throw new Error(`Erreur d'invocation: ${error.message}`);
        }
        
        if (data.error) {
          console.error('Airtable error from function:', data.error, data.details || '');
          throw new Error(data.error);
        }
        
        console.log('Echelon data received:', data);
        setEchelons(data);
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
  }, [toast]);

  return {
    isLoading,
    echelons,
    error
  };
};
