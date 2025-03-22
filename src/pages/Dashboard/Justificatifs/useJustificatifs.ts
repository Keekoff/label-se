
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Justificatif, GroupedJustificatifs } from "./types";
import { getJustificatifs } from "@/components/form/steps/FormPart1";
import { getJustificatifsForPart2 } from "@/components/form/steps/FormPart2";

export const useJustificatifs = () => {
  const [justificatifs, setJustificatifs] = useState<Justificatif[]>([]);
  const [groupedJustificatifs, setGroupedJustificatifs] = useState<GroupedJustificatifs>({});
  const [isLoading, setIsLoading] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [uploading, setUploading] = useState<Record<string, boolean>>({});
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (questionId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  };

  const groupJustificatifs = (items: Justificatif[]) => {
    const grouped: GroupedJustificatifs = {};
    
    items.forEach(item => {
      if (!grouped[item.question_identifier]) {
        grouped[item.question_identifier] = {
          questionId: item.question_identifier,
          questionTitle: item.question_identifier,
          items: []
        };
        setExpandedGroups(prev => ({...prev, [item.question_identifier]: true}));
      }
      
      grouped[item.question_identifier].items.push(item);
    });
    
    return grouped;
  };

  useEffect(() => {
    const fetchJustificatifs = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast.error("Session expirée");
          return;
        }

        console.log("Récupération des soumissions pour l'utilisateur:", session.user.id);
        const { data: submissions, error: submissionError } = await supabase
          .from('label_submissions')
          .select('id, status, payment_status')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (submissionError) {
          console.error('Erreur lors de la récupération des soumissions:', submissionError);
          setSubmitError("Erreur lors de la récupération des soumissions");
          setIsLoading(false);
          return;
        }
        if (!submissions?.length) {
          console.log("Aucune soumission trouvée pour l'utilisateur");
          setIsLoading(false);
          return;
        }
        const latestSubmission = submissions[0];
        console.log("Soumission trouvée:", latestSubmission);
        setSubmissionId(latestSubmission.id);

        if (latestSubmission.status !== 'submitted' && latestSubmission.payment_status !== 'paid') {
          console.log("La soumission n'est pas dans un état approprié pour les justificatifs");
          setSubmitError("Votre soumission n'est pas encore finalisée ou payée");
          setIsLoading(false);
          return;
        }

        console.log("Récupération des justificatifs depuis la base de données pour la soumission:", latestSubmission.id);
        // Appel direct à la base de données Supabase
        const { data: justificatifsData, error: justificatifsError } = await supabase
          .from('form_justificatifs')
          .select('*')
          .eq('submission_id', latestSubmission.id);

        if (justificatifsError) {
          console.error('Erreur lors du chargement des justificatifs:', justificatifsError);
          toast.error("Erreur lors du chargement des justificatifs");
          setIsLoading(false);
          return;
        }

        console.log("Justificatifs récupérés:", justificatifsData?.length || 0);
        
        if (!justificatifsData || justificatifsData.length === 0) {
          console.log("Aucun justificatif trouvé dans la base de données, essai via la fonction edge");
          
          // Essai de récupération via la fonction edge
          try {
            // Récupérer l'URL de l'API Supabase depuis l'environnement
            const baseUrl = import.meta.env.VITE_SUPABASE_URL || "https://xrruijuepuglkguryzlp.supabase.co";
            const apiUrl = `${baseUrl}/functions/v1/get-admission-documents?submissionId=${latestSubmission.id}`;
            
            console.log("Appel de la fonction edge avec l'URL:", apiUrl);
            
            const response = await fetch(
              apiUrl,
              {
                headers: {
                  Authorization: `Bearer ${session.access_token}`,
                  'Content-Type': 'application/json',
                }
              }
            );
            
            if (!response.ok) {
              const errorData = await response.json();
              console.error('Erreur lors de l\'appel à la fonction edge:', errorData);
              throw new Error(errorData.error || "Erreur lors de la récupération des justificatifs");
            }
            
            const edgeData = await response.json();
            console.log("Justificatifs récupérés via edge function:", edgeData?.length || 0);
            
            if (edgeData && edgeData.length > 0) {
              const mappedEdgeData = edgeData.map(item => ({
                id: item.id,
                question_identifier: item.question_identifier,
                response: item.response,
                justificatifs: item.justificatifs,
                file_path: item.file_path,
                file_name: item.file_name,
                status: item.status as JustificatifStatus || 'pending'
              }));
              
              setJustificatifs(mappedEdgeData);
              setGroupedJustificatifs(groupJustificatifs(mappedEdgeData));
              setIsLoading(false);
              return;
            }
          } catch (edgeError) {
            console.error("Erreur lors de l'appel à la fonction edge:", edgeError);
          }
        }

        const mappedJustificatifs = (justificatifsData || []).map(item => ({
          id: item.id,
          question_identifier: item.question_identifier,
          response: item.response,
          justificatifs: item.justificatifs,
          file_path: item.file_path,
          file_name: item.file_name,
          status: item.status as JustificatifStatus || 'pending'
        }));
        
        setJustificatifs(mappedJustificatifs);
        setGroupedJustificatifs(groupJustificatifs(mappedJustificatifs));
      } catch (error) {
        console.error('Erreur lors du chargement des justificatifs:', error);
        toast.error("Erreur lors du chargement des justificatifs");
      } finally {
        setIsLoading(false);
      }
    };
    fetchJustificatifs();
  }, []);

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
      if (!fileExt || !acceptedTypes.some(type => type.includes(fileExt))) {
        toast.error("Type de fichier non accepté. Veuillez utiliser PDF, DOC, DOCX, JPG ou PNG.");
        setUploading(prev => ({ ...prev, [justificatifId]: false }));
        return;
      }
      
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Le fichier est trop volumineux. Taille maximale: 10 MB");
        setUploading(prev => ({ ...prev, [justificatifId]: false }));
        return;
      }

      // Générer un chemin organisé par soumission et justificatif
      if (!submissionId) throw new Error("ID de soumission non trouvé");
      
      // Créer un chemin de fichier unique et organisé: submissionId/questionId/responseId_filename
      const sanitizedQuestionId = justificatif.question_identifier.replace(/\s+/g, '_').toLowerCase();
      const sanitizedResponse = justificatif.response.substring(0, 20).replace(/\s+/g, '_').toLowerCase();
      const timestamp = Date.now();
      const filename = `${timestamp}_${file.name.replace(/\s+/g, '_')}`;
      const filePath = `${submissionId}/${sanitizedQuestionId}/${sanitizedResponse}_${filename}`;
      
      console.log(`Téléchargement du fichier vers le chemin: ${filePath}`);
      
      // Télécharger le fichier vers Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('justificatifs')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });
      
      if (uploadError) {
        console.error("Erreur lors du téléchargement:", uploadError);
        throw uploadError;
      }
      
      console.log("Fichier téléchargé avec succès:", uploadData);
      
      // Mise à jour dans la base de données
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
      
      // Mise à jour du state local
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

      // Vérifier si c'est un fichier stocké localement (compatible avec l'ancien système)
      if (filePath.startsWith('local_')) {
        const base64File = sessionStorage.getItem(`justificatif_${justificatifId}`);
        if (base64File) {
          // Créer un lien de téléchargement à partir du Base64
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
      
      // Télécharger depuis Supabase Storage
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
  };
};
