
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Dashboard = () => {
  const [airtableData, setAirtableData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAirtableData = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('airtable-fetch');
        
        if (error) throw error;
        
        setAirtableData(data.data);
        toast.success("Données Airtable récupérées avec succès");
      } catch (error) {
        console.error('Error fetching Airtable data:', error);
        toast.error("Erreur lors de la récupération des données Airtable");
      } finally {
        setLoading(false);
      }
    };

    fetchAirtableData();
  }, []);

  if (loading) {
    return <div>Chargement des données...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Données Airtable</h1>
      <pre className="bg-gray-100 p-4 rounded-lg overflow-auto max-h-[500px]">
        {JSON.stringify(airtableData, null, 2)}
      </pre>
    </div>
  );
};

export default Dashboard;
