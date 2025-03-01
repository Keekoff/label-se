
import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";

type JustificatifStatus = 'pending' | 'uploaded' | 'validated';

type Justificatif = {
  id: string;
  question_identifier: string;
  response: string;
  justificatifs: string[];
  file?: File | null;
  status: JustificatifStatus;
};

const Justificatifs = () => {
  const [justificatifs, setJustificatifs] = useState<Justificatif[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchJustificatifs = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast.error("Session expirée");
          return;
        }

        // Récupérer la dernière soumission de l'utilisateur
        const { data: submissions, error: submissionError } = await supabase
          .from('label_submissions')
          .select('id')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false })
          .limit(1);

        if (submissionError || !submissions?.length) {
          console.error('Error fetching submissions:', submissionError);
          setIsLoading(false);
          return;
        }

        const submissionId = submissions[0].id;

        // Récupérer les justificatifs associés à cette soumission
        const { data: justificatifsData, error: justificatifsError } = await supabase
          .from('form_justificatifs')
          .select('*')
          .eq('submission_id', submissionId);

        if (justificatifsError) {
          console.error('Error fetching justificatifs:', justificatifsError);
          toast.error("Erreur lors du chargement des justificatifs");
          setIsLoading(false);
          return;
        }

        // Transformer les données pour l'affichage
        const mappedJustificatifs = justificatifsData.map(item => ({
          id: item.id,
          question_identifier: item.question_identifier,
          response: item.response,
          justificatifs: item.justificatifs,
          status: 'pending' as JustificatifStatus
        }));

        setJustificatifs(mappedJustificatifs);
      } catch (error) {
        console.error('Error fetching justificatifs:', error);
        toast.error("Erreur lors du chargement des justificatifs");
      } finally {
        setIsLoading(false);
      }
    };

    fetchJustificatifs();
  }, []);

  const handleFileUpload = async (justificatifId: string, file: File) => {
    try {
      const justificatif = justificatifs.find(j => j.id === justificatifId);
      if (!justificatif) throw new Error("Justificatif non trouvé");

      const fileExt = file.name.split('.').pop();
      const fileName = `${justificatif.question_identifier.toLowerCase().replace(/ /g, '-')}-${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('justificatifs')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      setJustificatifs(docs => 
        docs.map(doc => 
          doc.id === justificatifId 
            ? { ...doc, file, status: 'uploaded' as JustificatifStatus }
            : doc
        )
      );

      toast.success(`Le fichier ${file.name} a été téléchargé avec succès`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Une erreur est survenue lors du téléchargement");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p>Chargement des justificatifs...</p>
      </div>
    );
  }

  // Si aucun justificatif n'est trouvé, afficher des données fictives
  if (justificatifs.length === 0) {
    // Utilisation de données fictives pour le moment
    const mockJustificatifs: Justificatif[] = [
      {
        id: "1",
        question_identifier: "Diversité",
        response: "L'entreprise fournit un espace de travail non-discriminant et offre des outils d'expression",
        justificatifs: ["Affichage dans les locaux", "Messages diffusés à tous les collaborateurs"],
        status: 'pending'
      },
      {
        id: "2",
        question_identifier: "Égalité",
        response: "L'entreprise possède et communique sur un code éthique / charte sociale",
        justificatifs: ["Code éthique", "Charte sociale", "Affichage dans les locaux"],
        status: 'pending'
      },
      {
        id: "3",
        question_identifier: "Handicap",
        response: "L'entreprise précise dans ses offres de stages et d'emploi que les postes sont ouverts aux personnes en situation de handicap",
        justificatifs: ["Publication des offres d'emploi et de stages"],
        status: 'pending'
      }
    ];
    
    return (
      <div className="space-y-6 animate-fadeIn">
        <div>
          <h1 className="text-3xl font-bold">Pièces justificatives</h1>
          <p className="text-gray-500 mt-2">
            Veuillez télécharger les documents demandés ci-dessous pour compléter votre dossier.
          </p>
          <p className="text-sm text-amber-600 mt-2">
            Note: Pour l'instant, cet écran affiche des données d'exemple. La fonctionnalité de téléchargement sera pleinement implémentée prochainement.
          </p>
        </div>

        <Card className="p-6">
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
              {mockJustificatifs.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">{doc.question_identifier}</TableCell>
                  <TableCell>
                    <div className="max-w-md">
                      {doc.response}
                    </div>
                  </TableCell>
                  <TableCell>
                    <ul className="list-disc pl-5 text-sm">
                      {doc.justificatifs.map((justificatif, index) => (
                        <li key={index}>{justificatif}</li>
                      ))}
                    </ul>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {doc.status === 'uploaded' && (
                        <span className="text-sm text-green-600 mr-2">
                          ✓ Téléchargé
                        </span>
                      )}
                      <label>
                        <input
                          type="file"
                          className="hidden"
                          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) handleFileUpload(doc.id, file);
                          }}
                        />
                        <Button 
                          variant={doc.status === 'uploaded' ? "outline" : "default"}
                          className="hover:bg-gray-100"
                        >
                          <Upload className="mr-2 h-4 w-4" />
                          {doc.status === 'uploaded' ? 'Remplacer' : 'Télécharger'}
                        </Button>
                      </label>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold">Pièces justificatives</h1>
        <p className="text-gray-500 mt-2">
          Veuillez télécharger les documents demandés ci-dessous pour compléter votre dossier
        </p>
      </div>

      <Card className="p-6">
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
            {justificatifs.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium">{doc.question_identifier}</TableCell>
                <TableCell>
                  <div className="max-w-md">
                    {doc.response}
                  </div>
                </TableCell>
                <TableCell>
                  <ul className="list-disc pl-5 text-sm">
                    {doc.justificatifs.map((justificatif, index) => (
                      <li key={index}>{justificatif}</li>
                    ))}
                  </ul>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-2">
                    {doc.status === 'uploaded' && (
                      <span className="text-sm text-green-600 mr-2">
                        ✓ Téléchargé
                      </span>
                    )}
                    <label>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileUpload(doc.id, file);
                        }}
                      />
                      <Button 
                        variant={doc.status === 'uploaded' ? "outline" : "default"}
                        className="hover:bg-gray-100"
                      >
                        <Upload className="mr-2 h-4 w-4" />
                        {doc.status === 'uploaded' ? 'Remplacer' : 'Télécharger'}
                      </Button>
                    </label>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default Justificatifs;
