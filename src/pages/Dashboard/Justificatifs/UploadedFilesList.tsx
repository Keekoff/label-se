
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { File, Download, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface UploadedFile {
  id?: string;
  name: string;
  path: string;
  uploadDate?: string;
}

interface UploadedFilesListProps {
  files: UploadedFile[];
  onFileDeleted?: (path: string) => void;
}

const UploadedFilesList: React.FC<UploadedFilesListProps> = ({ files, onFileDeleted }) => {
  const [deletingFile, setDeletingFile] = useState<string | null>(null);

  const handleDownload = async (file: UploadedFile) => {
    try {
      console.log(`Téléchargement du fichier: ${file.path}`);
      
      const { data, error } = await supabase.storage
        .from('justificatifs')
        .download(file.path);

      if (error) {
        console.error('Erreur lors du téléchargement du fichier:', error);
        toast.error(`Erreur lors du téléchargement: ${error.message}`);
        return;
      }

      const url = URL.createObjectURL(data);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Erreur lors du téléchargement:', error);
      toast.error("Une erreur est survenue lors du téléchargement");
    }
  };

  const handleDelete = async (file: UploadedFile) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer ce fichier ?")) {
      return;
    }

    setDeletingFile(file.path);
    
    try {
      console.log(`Suppression du fichier: ${file.path}`);
      
      const { error } = await supabase.storage
        .from('justificatifs')
        .remove([file.path]);

      if (error) {
        console.error('Erreur lors de la suppression du fichier:', error);
        toast.error(`Erreur lors de la suppression: ${error.message}`);
        return;
      }

      toast.success("Fichier supprimé avec succès");
      
      if (onFileDeleted) {
        onFileDeleted(file.path);
      }
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      toast.error("Une erreur est survenue lors de la suppression");
    } finally {
      setDeletingFile(null);
    }
  };

  if (files.length === 0) {
    return null;
  }

  return (
    <Card className="bg-white mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">Documents téléchargés</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 max-h-[300px] overflow-y-auto">
          {files.map((file, index) => (
            <div 
              key={index} 
              className="flex items-center justify-between p-3 rounded-md border border-gray-200"
            >
              <div className="flex items-center space-x-3 overflow-hidden">
                <File className="h-5 w-5 text-[#27017F] flex-shrink-0" />
                <div className="overflow-hidden">
                  <p className="text-sm font-medium truncate">{file.name}</p>
                  {file.uploadDate && (
                    <p className="text-xs text-gray-500">
                      Téléchargé le {file.uploadDate}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-[#27017F] hover:text-[#35DA56]"
                  onClick={() => handleDownload(file)}
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-500 hover:bg-red-50"
                  onClick={() => handleDelete(file)}
                  disabled={deletingFile === file.path}
                >
                  {deletingFile === file.path ? (
                    <div className="animate-spin h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UploadedFilesList;
