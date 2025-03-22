
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
    // Vérifier que les données sont disponibles avant l'appel webhook
    if (!companyData || !submissionId) {
      console.error('Données manquantes pour l\'appel webhook');
      toast.error('Erreur: données incomplètes');
      onUpload(); // Continuer l'upload malgré l'erreur webhook
      return;
    }

    try {
      // Préparation des données pour l'API avec validation
      const webhookData = {
        companyName: companyData.companyName || 'Non spécifié',
        formId: submissionId,
        email: companyData.userEmail || 'Non spécifié'
      };

      console.log('Envoi des données au webhook:', webhookData);
      
      // Appel du webhook avec timeout et retry
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 secondes timeout
      
      try {
        const response = await fetch('https://hook.eu1.make.com/yfuhs39w89ryrld6pafrmluupmkjl1sx', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'Cache-Control': 'no-cache'
          },
          body: JSON.stringify(webhookData),
          signal: controller.signal,
          mode: 'cors',
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`Erreur HTTP: ${response.status} ${response.statusText}`);
        }
        
        // Tentative de lecture de la réponse pour vérifier
        const responseText = await response.text();
        console.log('Réponse du webhook:', responseText);
        
        toast.success('Notification de téléchargement envoyée');
      } catch (fetchError) {
        clearTimeout(timeoutId);
        console.error('Erreur lors de l\'appel au webhook:', fetchError);
        
        // Seconde tentative après échec
        console.log('Tentative #2 d\'envoi au webhook...');
        
        try {
          const retryResponse = await fetch('https://hook.eu1.make.com/yfuhs39w89ryrld6pafrmluupmkjl1sx', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(webhookData)
          });
          
          if (!retryResponse.ok) {
            throw new Error('Échec de la seconde tentative');
          }
          
          console.log('Seconde tentative réussie');
        } catch (retryError) {
          console.error('Échec de la seconde tentative:', retryError);
          toast.error('Impossible de notifier le téléchargement');
        }
      }
    } catch (error) {
      console.error('Erreur générale lors de l\'appel webhook:', error);
      toast.error('Erreur de communication avec le serveur');
    }

    // Exécuter la fonction originale d'upload quoi qu'il arrive
    onUpload();
  };

  return (
    <div className="flex justify-end">
      <Button 
        onClick={handleUpload} 
        disabled={isUploading}
        className="bg-[#35DA56] hover:bg-[#27017F]"
        aria-label="Envoyer les documents"
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
