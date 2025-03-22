
import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, X, Check, File, Paperclip } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

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
      const timestamp = Date.now();
      
      for (const file of selectedFiles) {
        // Créer un chemin organisé pour les fichiers groupés
        const sanitizedFilename = file.name.replace(/\s+/g, '_');
        const filePath = `${submissionId}/groupe_${timestamp}/${sanitizedFilename}`;
        
        // Télécharger le fichier vers Supabase Storage
        const { data, error } = await supabase.storage
          .from('justificatifs')
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false
          });
        
        if (error) {
          console.error("Erreur lors du téléchargement:", error);
          toast.error(`Erreur lors du téléchargement de ${file.name}`);
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
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
            <Paperclip className="mx-auto h-8 w-8 text-gray-400 mb-2" />
            <p className="text-sm text-gray-500 mb-4">
              Déposez ici vos documents ou cliquez pour parcourir
            </p>
            <div className="relative">
              <input
                type="file"
                multiple
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                disabled={isUploading}
              />
              <Button 
                variant="outline" 
                className="relative pointer-events-none"
                disabled={isUploading}
              >
                <Upload className="mr-2 h-4 w-4" />
                Parcourir les fichiers
              </Button>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              Types acceptés: PDF, DOC, DOCX, JPG, PNG | Max: 10MB par fichier
            </p>
          </div>

          {selectedFiles.length > 0 && (
            <div className="space-y-2">
              <div className="text-sm font-medium">Fichiers sélectionnés ({selectedFiles.length}):</div>
              <ul className="space-y-2 max-h-[200px] overflow-y-auto p-2">
                {selectedFiles.map((file, index) => (
                  <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
                    <div className="flex items-center space-x-2 overflow-hidden">
                      <File className="h-4 w-4 flex-shrink-0 text-[#27017F]" />
                      <span className="text-sm truncate">{file.name}</span>
                      <span className="text-xs text-gray-500">
                        ({(file.size / 1024).toFixed(1)} Ko)
                      </span>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 w-8 p-0"
                      onClick={() => removeFile(index)}
                    >
                      <X className="h-4 w-4 text-gray-500" />
                    </Button>
                  </li>
                ))}
              </ul>
              <div className="flex justify-end">
                <Button 
                  onClick={uploadFiles} 
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
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FileUploader;
