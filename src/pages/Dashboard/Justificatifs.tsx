
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileCheck, CheckCircle, Download, File } from "lucide-react";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";

type JustificatifStatus = 'pending' | 'uploaded' | 'validated';
type Justificatif = {
  id: string;
  question_identifier: string;
  response: string;
  justificatifs: string[];
  file_path?: string;
  file_name?: string;
  status: JustificatifStatus;
};

const Justificatifs = () => {
  const [justificatifs, setJustificatifs] = useState<Justificatif[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [uploading, setUploading] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const fetchJustificatifs = async () => {
      try {
        const {
          data: {
            session
          }
        } = await supabase.auth.getSession();
        if (!session) {
          toast.error("Session expirée");
          return;
        }
        console.log("Récupération des justificatifs pour l'utilisateur:", session.user.id);

        // Récupérer la dernière soumission de l'utilisateur
        const {
          data: submissions,
          error: submissionError
        } = await supabase.from('label_submissions').select('id, status, payment_status').eq('user_id', session.user.id).order('created_at', {
          ascending: false
        }).limit(1);
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

        // Vérifier si la soumission est dans un état approprié
        if (latestSubmission.status !== 'submitted' && latestSubmission.payment_status !== 'paid') {
          console.log("La soumission n'est pas dans un état approprié pour les justificatifs");
          setSubmitError("Votre soumission n'est pas encore finalisée ou payée");
          setIsLoading(false);
          return;
        }

        // Récupérer les justificatifs associés à cette soumission
        const {
          data: justificatifsData,
          error: justificatifsError
        } = await supabase.from('form_justificatifs').select('*').eq('submission_id', latestSubmission.id);
        if (justificatifsError) {
          console.error('Erreur lors du chargement des justificatifs:', justificatifsError);
          toast.error("Erreur lors du chargement des justificatifs");
          setIsLoading(false);
          return;
        }
        console.log("Données des justificatifs récupérées:", justificatifsData);

        // Transformer les données pour l'affichage
        const mappedJustificatifs = justificatifsData.map(item => ({
          id: item.id,
          question_identifier: item.question_identifier,
          response: item.response,
          justificatifs: item.justificatifs,
          file_path: item.file_path,
          file_name: item.file_name,
          status: item.status as JustificatifStatus || 'pending'
        }));
        setJustificatifs(mappedJustificatifs);
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
      if (!submissionId) {
        toast.error("Aucune soumission active trouvée");
        return;
      }
      
      setUploading(prev => ({ ...prev, [justificatifId]: true }));
      
      const justificatif = justificatifs.find(j => j.id === justificatifId);
      if (!justificatif) throw new Error("Justificatif non trouvé");
      
      // Vérification du type de fichier
      const acceptedTypes = ['.pdf', '.doc', '.docx', '.jpg', '.jpeg', '.png'];
      const fileExt = file.name.split('.').pop()?.toLowerCase();
      if (!fileExt || !acceptedTypes.some(type => type.includes(fileExt))) {
        toast.error("Type de fichier non accepté. Veuillez utiliser PDF, DOC, DOCX, JPG ou PNG.");
        return;
      }
      
      // Vérification de la taille du fichier (max 10 MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("Le fichier est trop volumineux. Taille maximale: 10 MB");
        return;
      }

      const fileName = `${justificatifId}-${Date.now()}.${fileExt}`;
      // Créer un chemin qui inclut l'ID de soumission
      const filePath = `${submissionId}/${fileName}`;
      
      // Téléchargement du fichier
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('justificatifs')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });
        
      if (uploadError) {
        console.error('Erreur lors du téléchargement:', uploadError);
        throw uploadError;
      }
      
      console.log('Fichier téléchargé avec succès:', uploadData);

      // Mettre à jour le statut du justificatif dans la base de données
      const { error: updateError } = await supabase
        .from('form_justificatifs')
        .update({
          file_path: filePath,
          file_name: file.name,
          status: 'uploaded'
        })
        .eq('id', justificatifId);
        
      if (updateError) {
        console.error('Erreur lors de la mise à jour du statut du justificatif:', updateError);
        throw updateError;
      }
      
      // Mettre à jour l'état local
      setJustificatifs(docs => docs.map(doc => 
        doc.id === justificatifId 
          ? {
              ...doc,
              file_path: filePath,
              file_name: file.name,
              status: 'uploaded' as JustificatifStatus
            } 
          : doc
      ));
      
      toast.success(`Le fichier ${file.name} a été téléchargé avec succès`);
    } catch (error) {
      console.error('Erreur de téléchargement:', error);
      toast.error("Une erreur est survenue lors du téléchargement");
    } finally {
      setUploading(prev => ({ ...prev, [justificatifId]: false }));
    }
  };

  const handleFileDownload = async (filePath: string, fileName: string) => {
    try {
      if (!filePath) {
        toast.error("Aucun fichier disponible");
        return;
      }

      const { data, error } = await supabase.storage
        .from('justificatifs')
        .download(filePath);

      if (error) {
        console.error('Erreur lors du téléchargement du fichier:', error);
        toast.error("Erreur lors du téléchargement du fichier");
        return;
      }

      // Créer un URL pour le fichier et déclencher le téléchargement
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

  const renderStatus = (doc: Justificatif) => {
    if (uploading[doc.id]) {
      return <span className="text-sm text-amber-600 flex items-center">
        <Skeleton className="h-4 w-4 mr-2 rounded-full animate-pulse" />
        Téléchargement...
      </span>;
    }
    
    if (doc.status === 'uploaded') {
      return <span className="text-sm text-green-600 flex items-center">
        <CheckCircle className="h-4 w-4 mr-2" />
        Téléchargé
      </span>;
    }
    
    if (doc.status === 'validated') {
      return <span className="text-sm text-blue-600 flex items-center">
        <FileCheck className="h-4 w-4 mr-2" />
        Validé
      </span>;
    }
    
    return null;
  };

  if (isLoading) {
    return <div className="flex items-center justify-center h-64">
        <p>Chargement des justificatifs...</p>
      </div>;
  }

  // Si aucun justificatif n'est trouvé, afficher un message d'erreur ou des données d'exemple
  if (justificatifs.length === 0) {
    return <div className="space-y-6 animate-fadeIn">
        <div>
          <h1 className="text-3xl font-bold">Pièces justificatives</h1>
          <p className="text-gray-500 mt-2">
            Veuillez télécharger les documents demandés ci-dessous pour compléter votre dossier.
          </p>
          {submitError ? <p className="text-sm text-red-600 mt-2">
              {submitError}
            </p> : <p className="text-sm text-amber-600 mt-2">
              Aucun justificatif trouvé pour votre dernière soumission. Veuillez soumettre le formulaire complet ou contacter l'administrateur.
            </p>}
        </div>

        <Card className="p-6">
          <div className="text-center p-8">
            <p className="text-lg text-gray-600">
              Vous devez d'abord compléter et soumettre le formulaire de labellisation.
            </p>
            <Button className="mt-4 bg-[#35DA56] hover:bg-[#27017F]" onClick={() => window.location.href = "/dashboard/form"}>
              Aller au formulaire
            </Button>
          </div>
        </Card>
      </div>;
  }

  return <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold">Pièces justificatives</h1>
        <p className="text-gray-500 mt-2">
          Veuillez télécharger les documents demandés ci-dessous pour compléter votre dossier
        </p>
      </div>

      <Card className="p-6 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Critère</TableHead>
              <TableHead>Réponse</TableHead>
              <TableHead>Justificatifs demandés</TableHead>
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {justificatifs.map(doc => <TableRow key={doc.id}>
                <TableCell className="font-medium">{doc.question_identifier}</TableCell>
                <TableCell>
                  <div className="max-w-md">
                    {doc.response}
                  </div>
                </TableCell>
                <TableCell>
                  <ul className="list-disc pl-5 text-sm">
                    {doc.justificatifs.map((justificatif, index) => <li key={index}>{justificatif}</li>)}
                  </ul>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex flex-col items-end gap-2">
                    <div className="flex items-center justify-end gap-2">
                      {renderStatus(doc)}
                      <div className="relative">
                        <Input 
                          type="file" 
                          id={`file-upload-${doc.id}`}
                          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" 
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" 
                          onChange={e => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(doc.id, file);
                            // Réinitialiser l'input pour permettre le téléchargement du même fichier
                            e.target.value = '';
                          }} 
                          aria-label="Télécharger un justificatif" 
                          disabled={uploading[doc.id]}
                        />
                        <Button 
                          variant={doc.status === 'uploaded' ? "outline" : "default"} 
                          className={`${doc.status !== 'uploaded' ? 'bg-[#35DA56] hover:bg-[#27017F]' : ''} hover:bg-gray-100`}
                          disabled={uploading[doc.id]}
                          type="button"
                        >
                          <Upload className="mr-2 h-4 w-4" aria-hidden="true" />
                          {doc.status === 'uploaded' ? 'Remplacer' : 'Télécharger'}
                        </Button>
                      </div>
                    </div>
                    
                    {doc.file_name && doc.file_path && (
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-[#27017F] hover:text-[#35DA56] hover:bg-transparent"
                        onClick={() => handleFileDownload(doc.file_path!, doc.file_name!)}
                      >
                        <File className="h-4 w-4 mr-2" />
                        <span className="text-xs truncate max-w-[150px]">{doc.file_name}</span>
                        <Download className="h-3 w-3 ml-2" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>)}
          </TableBody>
        </Table>
      </Card>
    </div>;
};

export default Justificatifs;
