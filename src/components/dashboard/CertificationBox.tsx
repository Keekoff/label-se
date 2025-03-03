
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Award } from "lucide-react";

type CertificationData = {
  level: string;
  logo?: { url: string; filename: string; size: number; type: string; thumbnails?: any; } | null;
  startDate: string | null;
  endDate: string | null;
};

export const CertificationBox = ({ companyName }: { companyName: string }) => {
  const [certificationData, setCertificationData] = useState<CertificationData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCertificationData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!companyName) {
          setIsLoading(false);
          return;
        }

        const { data, error: fetchError } = await supabase.functions.invoke('airtable-fetch', {
          body: { companyName }
        });

        if (fetchError) {
          throw new Error(fetchError.message);
        }

        console.log('Airtable data received:', data);

        if (data?.certification) {
          setCertificationData(data.certification);
        }
      } catch (err) {
        console.error('Error fetching certification data:', err);
        setError('Impossible de récupérer les données de certification');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCertificationData();
  }, [companyName]);

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Non définie';
    try {
      return format(new Date(dateString), 'dd/MM/yyyy', { locale: fr });
    } catch (e) {
      return 'Format invalide';
    }
  };

  if (isLoading) {
    return (
      <Card className="p-6 mb-6 border-[#35DA56] flex items-center justify-center h-32">
        <p className="text-gray-500">Chargement des données de certification...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 mb-6 border-[#35DA56] shadow-sm">
        <p className="text-red-500">{error}</p>
      </Card>
    );
  }

  // Display a default certification card even if no data
  return (
    <Card className="p-6 mb-6 border-[#35DA56] shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Award className="h-6 w-6 text-[#35DA56]" />
            <h3 className="font-bold text-lg">Certification : Label Startup Engagée</h3>
          </div>
          <p className="text-gray-700">Niveau : {certificationData?.level || 'Non défini'}</p>
          <p className="text-gray-700">Début de validité : {formatDate(certificationData?.startDate)}</p>
          <p className="text-gray-700">Fin de validité : {formatDate(certificationData?.endDate)}</p>
        </div>
        <div className="w-full md:w-auto">
          {certificationData?.logo ? (
            <img 
              src={certificationData.logo.url} 
              alt="Logo certification" 
              className="h-24 object-contain rounded-md"
            />
          ) : (
            <div className="bg-gray-100 h-24 w-40 rounded-md flex items-center justify-center">
              <p className="text-gray-400 text-sm">Image du label<br/>(à venir)</p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};
