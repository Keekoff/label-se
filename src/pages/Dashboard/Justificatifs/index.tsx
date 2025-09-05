
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
    handleFileDownload,
    handleFileUpload
  } = useJustificatifs();

  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);

  useEffect(() => {
    const fetchUploadedFiles = async () => {
      if (!submissionId) return;
      
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) return;

        console.log(`Recherche des fichiers dans le dossier docs/${submissionId}`);
        
        // Mise à jour du chemin pour la nouvelle structure
        const { data, error } = await supabase.storage
          .from('justificatifs')
          .list(`docs/${submissionId}`, {
            limit: 100,
            offset: 0,
            sortBy: { column: 'name', order: 'desc' } // Les plus récents d'abord
          });

        if (error) {
          console.error('Erreur lors du chargement des fichiers:', error);
          return;
        }

        if (!data || data.length === 0) {
          console.log('Aucun fichier trouvé');
          return;
        }

        console.log('Fichiers trouvés:', data);

        const formattedFiles = data
          .filter(item => !item.name.includes('.emptyFolderPlaceholder'))
          .map(item => {
            // Extraction du nom original du fichier
            let displayName = item.name;
            
            // Si le nom contient un préfixe comme file_1234567890_
            if (displayName.match(/^(file|justif)_\d+_/)) {
              // Récupérer le nom après le timestamp
              const parts = displayName.split('_');
              if (parts.length > 2) {
                // Reconstruire le nom sans le préfixe
                displayName = parts.slice(2).join('_');
              }
            }
            
            // Si le nom contient un ID de justificatif, le supprimer
            if (displayName.includes('_')) {
              const idMatch = displayName.match(/^[0-9a-f-]+_/);
              if (idMatch) {
                displayName = displayName.substring(idMatch[0].length);
              }
            }
            
            return {
              name: displayName,
              path: `docs/${submissionId}/${item.name}`,
              uploadDate: new Date(item.created_at).toLocaleDateString('fr-FR', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })
            };
          });

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
        <div className="mt-6 space-y-4 text-gray-700 leading-relaxed">
          <p>
            Veuillez télécharger les documents demandés ci-dessous pour finaliser votre dossier de labellisation.
          </p>
          <p>
            Afin de garantir la crédibilité du label Startup Engagée, chaque candidature fait l'objet d'un audit basé sur les réponses que vous avez fournies dans le questionnaire.
          </p>
          <p>
            Ces pièces nous permettent simplement de vérifier certains éléments clés de votre démarche, en toute bienveillance.
          </p>
          <p>
            <strong>Pas d'inquiétude :</strong> Nous vous proposons des exemples de justificatifs acceptés, mais la liste n'est pas exhaustive. L'idée est surtout de mieux comprendre votre démarche concrète, quels que soient vos moyens ou votre stade d'avancement.
          </p>
          <p>
            Si vous ne trouvez pas le bon document ou si vous avez un doute, écrivez-nous simplement à{" "}
            <a href="mailto:bonjour@startupengagee.com" className="text-[#35DA56] hover:text-[#27017F] transition-colors">
              bonjour@startupengagee.com
            </a>
            {" "}- nous sommes là pour vous aider 🙂
          </p>
          <p>
            <strong>L'objectif :</strong> Faire de cette étape est de faire la lumière sur ce que vous avez déjà mis en place et de vous permettre d'obtenir un label aligné avec vos engagements.
          </p>
        </div>
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
            onDownload={handleFileDownload}
          />
        ))}
      </div>
    </div>
  );
};

export default Justificatifs;
