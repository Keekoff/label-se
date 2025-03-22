
import React, { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UploadButtonProps {
  isUploading: boolean;
  onUpload: () => void;
  submissionId?: string | null;
}

const UploadButton: React.FC<UploadButtonProps> = ({ isUploading, onUpload, submissionId }) => {
  const [companyData, setCompanyData] = useState<{
    companyName: string;
    userEmail: string;
  } | null>(null);

  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        // Récupérer les données du formulaire
        const { data, error } = await supabase
          .from('label_submissions')
          .select('nom_entreprise, user_id')
          .eq('id', submissionId)
          .single();
        
        if (error) {
          console.error('Erreur lors de la récupération des données:', error);
          return;
        }
        
        if (data) {
          // On utilise l'utilisateur connecté pour l'email si disponible
          setCompanyData({
            companyName: data.nom_entreprise || '',
            userEmail: session.user?.email || '',
          });
        }
      } catch (error) {
        console.error('Erreur:', error);
      }
    };

    if (submissionId) {
      fetchCompanyData();
    }
  }, [submissionId]);

  const handleUpload = async () => {
    // Appel POST à l'API externe
    if (companyData && submissionId) {
      try {
        // Préparation des données pour l'API
        const webhookData = {
          companyName: companyData.companyName,
          formId: submissionId,
          email: companyData.userEmail
        };

        console.log('Envoi des données au webhook:', webhookData);
        
        // Appel du webhook
        const response = await fetch('https://hook.eu1.make.com/yfuhs39w89ryrld6pafrmluupmkjl1sx', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(webhookData)
        });

        if (!response.ok) {
          console.error('Erreur lors de l\'appel au webhook:', response.statusText);
          toast.error('Erreur lors de la notification du téléchargement');
        } else {
          console.log('Notification de téléchargement envoyée avec succès');
        }
      } catch (error) {
        console.error('Erreur lors de l\'appel au webhook:', error);
      }
    }

    // Exécuter la fonction originale d'upload
    onUpload();
  };

  return (
    <div className="flex justify-end">
      <Button 
        onClick={handleUpload} 
        disabled={isUploading}
        className="bg-[#35DA56] hover:bg-[#27017F]"
      >
        {isUploading ? (
          <>
            <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
            Téléchargement en cours...
          </>
        ) : (
          <>
            <Check className="mr-2 h-4 w-4" />
            Envoyer les documents
          </>
        )}
      </Button>
    </div>
  );
};

export default UploadButton;
