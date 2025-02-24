
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";
import { toast } from "sonner";

type Document = {
  id: string;
  title: string;
  description: string;
  file?: File;
};

const Justificatifs = () => {
  const [documents] = useState<Document[]>([
    { 
      id: '1', 
      title: 'Extrait Kbis',
      description: 'Document officiel attestant l\'existence juridique de l\'entreprise'
    },
    { 
      id: '2', 
      title: 'Attestation URSSAF',
      description: 'Attestation de vigilance de moins de 6 mois'
    },
    { 
      id: '3', 
      title: 'Bilan comptable',
      description: 'Dernier bilan comptable'
    },
  ]);

  const handleFileUpload = async (documentId: string, file: File) => {
    try {
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
          Veuillez télécharger les documents demandés ci-dessous
        </p>
      </div>

      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b">
                <th className="text-left p-4 font-medium text-gray-600">Document</th>
                <th className="text-left p-4 font-medium text-gray-600">Description</th>
                <th className="text-right p-4 font-medium text-gray-600">Action</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc, index) => (
                <tr 
                  key={doc.id} 
                  className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                >
                  <td className="p-4">{doc.title}</td>
                  <td className="p-4">{doc.description}</td>
                  <td className="p-4 text-right">
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
                      <Button variant="outline" className="hover:bg-gray-100">
                        <Upload className="mr-2 h-4 w-4" />
                        Télécharger
                      </Button>
                    </label>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default Justificatifs;
