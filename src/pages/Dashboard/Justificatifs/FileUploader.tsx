
import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import DragDropArea from "./components/DragDropArea";
import SelectedFilesList from "./components/SelectedFilesList";
import UploadButton from "./components/UploadButton";

interface FileUploaderProps {
  submissionId: string | null;
  onFilesUploaded: (files: {name: string, path: string}[]) => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ submissionId, onFilesUploaded }) => {
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileSelect = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    // Vérifier les types de fichiers acceptés
    const acceptedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
    const newFiles: File[] = [];
    
    Array.from(files).forEach(file => {
      const fileExt = `.${file.name.split('.').pop()?.toLowerCase()}`;
      if (!acceptedTypes.includes(fileExt)) {
        toast.error(`Type de fichier non accepté: ${file.name}`);
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`Fichier trop volumineux: ${file.name} (max 10 MB)`);
        return;
      }
      
      newFiles.push(file);
    });

    setSelectedFiles(prev => [...prev, ...newFiles]);
    // Réinitialiser l'input
    event.target.value = '';
  }, []);

  const removeFile = useCallback((index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const uploadFiles = async () => {
    if (selectedFiles.length === 0) {
      toast.warning("Veuillez sélectionner des fichiers à télécharger");
      return;
    }

    if (!submissionId) {
      toast.error("Erreur: aucune soumission trouvée");
      return;
    }

    setIsUploading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Session expirée");
        setIsUploading(false);
        return;
      }

      const uploadedFiles = [];
      
      for (const file of selectedFiles) {
        // Nettoyer complètement le nom du fichier pour éviter tous caractères problématiques
        const fileExt = file.name.split('.').pop() || '';
        const baseName = file.name.substring(0, file.name.lastIndexOf('.'));
        
        // Remplacer tous les caractères spéciaux et espaces par des underscores
        const cleanBaseName = baseName
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '') // Supprimer les accents
          .replace(/[^a-zA-Z0-9]/g, '_')   // Remplacer caractères spéciaux par _
          .replace(/_+/g, '_')             // Éviter les underscores multiples
          .replace(/^_|_$/g, '');          // Supprimer les underscores au début et à la fin
          
        const timestamp = Date.now();
        const uniqueFileName = `file_${timestamp}_${cleanBaseName}.${fileExt}`;
        const filePath = `docs/${submissionId}/${uniqueFileName}`;
        
        console.log(`Tentative de téléchargement du fichier "${file.name}" vers: ${filePath}`);
        
        // Upload to Supabase Storage
        const { data, error } = await supabase.storage
          .from('justificatifs')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: true
          });
        
        if (error) {
          console.error("Erreur lors du téléchargement:", error);
          toast.error(`Erreur lors du téléchargement de ${file.name}: ${error.message}`);
          continue;
        }
        
        uploadedFiles.push({
          name: file.name,
          path: filePath
        });
      }

      if (uploadedFiles.length > 0) {
        onFilesUploaded(uploadedFiles);
        setSelectedFiles([]);
        toast.success(`${uploadedFiles.length} fichier(s) téléchargé(s) avec succès`);
      }
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      toast.error("Une erreur est survenue lors du téléchargement");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="bg-white mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Téléchargement de documents</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <DragDropArea 
            isUploading={isUploading}
            onFileSelect={handleFileSelect}
          />

          <SelectedFilesList 
            files={selectedFiles}
            onRemoveFile={removeFile}
          />

          {selectedFiles.length > 0 && (
            <UploadButton 
              isUploading={isUploading}
              onUpload={uploadFiles}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUploader;
