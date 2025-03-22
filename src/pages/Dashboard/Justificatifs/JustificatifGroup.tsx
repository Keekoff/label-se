
import { ChevronDown, ChevronUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { GroupedJustificatifs, Justificatif } from "./types";
import FileActions from "./FileActions";

interface JustificatifGroupProps {
  group: GroupedJustificatifs[string];
  expanded: boolean;
  uploading: Record<string, boolean>;
  onToggle: (questionId: string) => void;
  onDownload: (filePath: string, fileName: string, id: string) => void;
}

const JustificatifGroup = ({ 
  group, 
  expanded, 
  uploading, 
  onToggle, 
  onDownload 
}: JustificatifGroupProps) => {
  return (
    <Card className="p-0 bg-white">
      <CardHeader 
        className="p-4 cursor-pointer border-b flex flex-row items-center justify-between" 
        onClick={() => onToggle(group.questionId)}
      >
        <CardTitle className="text-lg font-semibold">{group.questionTitle}</CardTitle>
        <div className="flex items-center">
          {expanded ? 
            <ChevronUp className="h-5 w-5 text-[#27017F]" /> : 
            <ChevronDown className="h-5 w-5 text-[#27017F]" />
          }
        </div>
      </CardHeader>
      
      {expanded && (
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-2/5">Réponse</TableHead>
                <TableHead className="w-2/5">Justificatifs demandés</TableHead>
                <TableHead className="text-right w-1/5">Statut / Fichier</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {group.items.map((doc: Justificatif) => (
                <TableRow key={doc.id}>
                  <TableCell className="font-medium">
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
                    <FileActions 
                      doc={doc} 
                      uploading={uploading} 
                      onDownload={onDownload} 
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      )}
    </Card>
  );
};

export default JustificatifGroup;
