
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { supabase } from "@/integrations/supabase/client";

type Document = {
  id: string;
  title: string;
  description: string;
  file?: File | null;
  status: 'pending' | 'uploaded' | 'validated';
};

const Justificatifs = () => {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      title: 'Extrait Kbis',
      description: 'Document officiel attestant l\'existence juridique de l\'entreprise',
      status: 'pending'
    },
    {
      id: '2',
      title: 'Attestation URSSAF',
      description: 'Attestation de vigilance de moins de 6 mois',
      status: 'pending'
    },
    {
      id: '3',
      title: 'Bilan comptable',
      description: 'Dernier bilan comptable',
      status: 'pending'
    }
  ]);

  const handleFileUpload = async (documentId: string, file: File) => {
    try {
      const document = documents.find(doc => doc.id === documentId);
      if (!document) throw new Error("Document non trouvé");

      const fileExt = file.name.split('.').pop();
      const fileName = `${document.title.toLowerCase().replace(/ /g, '-')}-${Date.now()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('justificatifs')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      setDocuments(docs => 
        docs.map(doc => 
          doc.id === documentId 
            ? { ...doc, file, status: 'uploaded' }
            : doc
        )
      );

      toast.success(`Le fichier ${file.name} a été téléchargé avec succès`);
    } catch (error) {
      console.error('Upload error:', error);
      toast.error("Une erreur est survenue lors du téléchargement");
    }
  };

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
              <TableHead className="w-[200px]">Document</TableHead>
              <TableHead className="w-[300px]">Description</TableHead>
              <TableHead className="w-[200px] text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.map((doc) => (
              <TableRow key={doc.id}>
                <TableCell className="font-medium">{doc.title}</TableCell>
                <TableCell>{doc.description}</TableCell>
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
                        accept=".pdf,.doc,.docx"
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
