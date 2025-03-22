
import { File, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Justificatif } from "./types";
import JustificatifStatus from "./JustificatifStatus";

interface FileActionsProps {
  doc: Justificatif;
  uploading: Record<string, boolean>;
  onDownload: (filePath: string, fileName: string, id: string) => void;
}

const FileActions = ({ doc, uploading, onDownload }: FileActionsProps) => {
  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex items-center justify-end gap-2">
        <JustificatifStatus doc={doc} uploading={uploading} />
      </div>
      
      {doc.file_name && doc.file_path && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="text-[#27017F] hover:text-[#35DA56] hover:bg-transparent"
          onClick={() => onDownload(doc.file_path!, doc.file_name!, doc.id)}
        >
          <File className="h-4 w-4 mr-2" />
          <span className="text-xs truncate max-w-[150px]">{doc.file_name}</span>
          <Download className="h-3 w-3 ml-2" />
        </Button>
      )}
    </div>
  );
};

export default FileActions;
