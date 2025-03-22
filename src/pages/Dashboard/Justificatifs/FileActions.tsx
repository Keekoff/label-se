
import { Upload, File, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Justificatif } from "./types";
import JustificatifStatus from "./JustificatifStatus";

interface FileActionsProps {
  doc: Justificatif;
  uploading: Record<string, boolean>;
  onUpload: (id: string, file: File) => void;
  onDownload: (filePath: string, fileName: string, id: string) => void;
}

const FileActions = ({ doc, uploading, onUpload, onDownload }: FileActionsProps) => {
  return (
    <div className="flex flex-col items-end gap-2">
      <div className="flex items-center justify-end gap-2">
        <JustificatifStatus doc={doc} uploading={uploading} />
        <div className="relative">
          <Input 
            type="file" 
            id={`file-upload-${doc.id}`}
            className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" 
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png" 
            onChange={e => {
              const file = e.target.files?.[0];
              if (file) onUpload(doc.id, file);
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
