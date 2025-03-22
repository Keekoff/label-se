import { useState, useEffect } from "react";
import { useJustificatifs } from "./useJustificatifs";
import JustificatifGroup from "./JustificatifGroup";
import EmptyState from "./EmptyState";
import FileUploader from "./FileUploader";
import UploadedFilesList from "./UploadedFilesList";
import { supabase } from "@/integrations/supabase/client";

interface UploadedFile {
  name: string;
  path: string;
  uploadDate?: string;
}

const Justificatifs = () => {
  const {
    justificatifs,
    groupedJustificatifs,
    isLoading,
    submitError,
    submissionId,
    uploading,
    expandedGroups,
    toggleGroup,
    handleFileUpload,
    handleFileDownload
  } = useJustificatifs();

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  useEffect(() => {
    const fetchUploadedFiles = async () => {
      if (!submissionId) return;
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        const { data, error } = await supabase.storage
          .from('justificatifs')
          .list(`${submissionId}`, {
            limit: 100,
            offset: 0,
            sortBy: { column: 'name', order: 'asc' }
          });

        if (error) {
          console.error('Erreur lors du chargement des fichiers:', error);
          return;
        }

        const formattedFiles = data
          .filter(item => !item.id.includes('groupe_'))
          .map(item => ({
            name: item.name,
            path: `${submissionId}/${item.name}`,
            uploadDate: new Date(item.created_at).toLocaleDateString('fr-FR', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })
          }));

        setUploadedFiles(formattedFiles);
      } catch (error) {
        console.error('Erreur lors du chargement des fichiers:', error);
      }
    };

    fetchUploadedFiles();
  }, [submissionId]);

  const handleFilesUploaded = (files: {name: string, path: string}[]) => {
    const newFiles = files.map(file => ({
      ...file,
      uploadDate: new Date().toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      })
    }));
    
    setUploadedFiles(prev => [...newFiles, ...prev]);
  };

  const handleFileDeleted = (path: string) => {
    setUploadedFiles(prev => prev.filter(file => file.path !== path));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Chargement des justificatifs...</p>
      </div>
    );
  }

  if (justificatifs.length === 0) {
    return <EmptyState error={submitError} />;
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold">Pièces justificatives</h1>
        <p className="text-gray-500 mt-2">
          Veuillez télécharger les documents demandés ci-dessous pour compléter votre dossier
        </p>
      </div>

      <FileUploader 
        submissionId={submissionId} 
        onFilesUploaded={handleFilesUploaded} 
      />

      <UploadedFilesList 
        files={uploadedFiles} 
        onFileDeleted={handleFileDeleted} 
      />

      <div className="space-y-6">
        {Object.values(groupedJustificatifs).map(group => (
          <JustificatifGroup
            key={group.questionId}
            group={group}
            expanded={expandedGroups[group.questionId]}
            uploading={uploading}
            onToggle={toggleGroup}
            onUpload={handleFileUpload}
            onDownload={handleFileDownload}
          />
        ))}
      </div>
    </div>
  );
};

export default Justificatifs;
