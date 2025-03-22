
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Justificatif, JustificatifStatus } from "../types";
import { groupJustificatifs } from "./utils";

export const useFetchJustificatifs = () => {
  const [justificatifs, setJustificatifs] = useState<Justificatif[]>([]);
  const [groupedJustificatifs, setGroupedJustificatifs] = useState<Record<string, any>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({});

  const toggleGroup = (questionId: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
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
          
          try {
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
              const grouped = groupJustificatifs(mappedEdgeData);
              setGroupedJustificatifs(grouped);
              
              // Initialize expanded groups
              const initialExpandedState: Record<string, boolean> = {};
              Object.keys(grouped).forEach(key => {
                initialExpandedState[key] = true;
              });
              setExpandedGroups(initialExpandedState);
              
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
        const grouped = groupJustificatifs(mappedJustificatifs);
        setGroupedJustificatifs(grouped);
        
        // Initialize expanded groups
        const initialExpandedState: Record<string, boolean> = {};
        Object.keys(grouped).forEach(key => {
          initialExpandedState[key] = true;
        });
        setExpandedGroups(initialExpandedState);
        
      } catch (error) {
        console.error('Erreur lors du chargement des justificatifs:', error);
        toast.error("Erreur lors du chargement des justificatifs");
      } finally {
        setIsLoading(false);
      }
    };
    fetchJustificatifs();
  }, []);

  return {
    justificatifs,
    setJustificatifs,
    groupedJustificatifs,
    setGroupedJustificatifs,
    isLoading,
    submitError,
    submissionId,
    expandedGroups,
    toggleGroup
  };
};
