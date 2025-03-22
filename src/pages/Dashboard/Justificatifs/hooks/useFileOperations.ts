
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Justificatif, JustificatifStatus } from "../types";

interface UseFileOperationsProps {
  justificatifs: Justificatif[];
  submissionId: string | null;
  setJustificatifs: React.Dispatch<React.SetStateAction<Justificatif[]>>;
  groupJustificatifs: (items: Justificatif[]) => any;
  setGroupedJustificatifs: React.Dispatch<React.SetStateAction<any>>;
}

export const useFileOperations = ({
  justificatifs, 
  submissionId, 
  setJustificatifs, 
  groupJustificatifs,
  setGroupedJustificatifs
}: UseFileOperationsProps) => {
  const [uploading, setUploading] = useState<Record<string, boolean>>({});

  const handleFileUpload = async (justificatifId: string, file: File) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Session expirée");
        return;
      }
      
      setUploading(prev => ({ ...prev, [justificatifId]: true }));
      
      const justificatif = justificatifs.find(j => j.id === justificatifId);
      if (!justificatif) throw new Error("Justificatif non trouvé");
      
      const acceptedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      const fileExtWithDot = fileExt ? `.${fileExt}` : '';
      
      if (!fileExt || !acceptedTypes.includes(fileExtWithDot)) {
        toast.error("Type de fichier non accepté. Veuillez utiliser PDF, DOC, DOCX, JPG ou PNG.");
        setUploading(prev => ({ ...prev, [justificatifId]: false }));
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Le fichier est trop volumineux. Taille maximale: 10 MB");
        setUploading(prev => ({ ...prev, [justificatifId]: false }));
        return;
      }

      if (!submissionId) throw new Error("ID de soumission non trouvé");
      
      // Nettoyer complètement le nom du fichier pour éviter tous caractères problématiques
      const baseName = file.name.substring(0, file.name.lastIndexOf('.'));
      
      // Remplacer tous les caractères spéciaux et espaces par des underscores
      const cleanBaseName = baseName
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
        .replace(/[^a-zA-Z0-9]/g, '_')   // Remplacer caractères spéciaux par _
        .replace(/_+/g, '_')             // Éviter les underscores multiples
        .replace(/^_|_$/g, '');          // Supprimer les underscores au début et à la fin
        
      const timestamp = Date.now();
      const uniqueFileName = `justif_${timestamp}_${cleanBaseName}.${fileExt}`;
      const filePath = `docs/${submissionId}/${justificatifId}_${uniqueFileName}`;
      
      console.log(`Téléchargement du fichier "${file.name}" vers le chemin: ${filePath}`);
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('justificatifs')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });
      
      if (uploadError) {
        console.error("Erreur lors du téléchargement:", uploadError);
        throw uploadError;
      }
      
      console.log("Fichier téléchargé avec succès:", uploadData);
      
      const { error: updateError } = await supabase
        .from('form_justificatifs')
        .update({
          file_name: file.name,
          file_path: filePath,
          status: 'uploaded',
          user_id: session.user.id
        })
        .eq('id', justificatifId);
        
      if (updateError) {
        console.error("Erreur lors de la mise à jour du statut:", updateError);
        throw updateError;
      }
      
      const updatedJustificatifs = justificatifs.map(doc => 
        doc.id === justificatifId 
          ? {
              ...doc,
              file_path: filePath,
              file_name: file.name,
              status: 'uploaded' as JustificatifStatus
            } 
          : doc
      );
      
      setJustificatifs(updatedJustificatifs);
      setGroupedJustificatifs(groupJustificatifs(updatedJustificatifs));
      
      toast.success(`Le fichier ${file.name} a été téléchargé avec succès`);
    } catch (error) {
      console.error('Erreur de téléchargement:', error);
      toast.error("Une erreur est survenue lors du téléchargement");
    } finally {
      setUploading(prev => ({ ...prev, [justificatifId]: false }));
    }
  };

  const handleFileDownload = async (filePath: string, fileName: string, justificatifId: string) => {
    try {
      if (!filePath) {
        toast.error("Aucun fichier disponible");
        return;
      }

      if (filePath.startsWith('local_')) {
        const base64File = sessionStorage.getItem(`justificatif_${justificatifId}`);
        if (base64File) {
          const link = document.createElement('a');
          link.href = base64File;
          link.download = fileName || 'document';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          return;
        } else {
          toast.error("Fichier local non trouvé, essayez de télécharger à nouveau");
          return;
        }
      }

      console.log(`Téléchargement du fichier depuis le chemin: ${filePath}`);
      
      const { data, error } = await supabase.storage
        .from('justificatifs')
        .download(filePath);

      if (error) {
        console.error('Erreur lors du téléchargement du fichier:', error);
        toast.error("Erreur lors du téléchargement du fichier");
        return;
      }

      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName || 'document';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      toast.error("Une erreur est survenue lors du téléchargement");
    }
  };

  return {
    uploading,
    handleFileUpload,
    handleFileDownload
  };
};
