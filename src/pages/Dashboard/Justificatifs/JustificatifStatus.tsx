
import { CheckCircle, FileCheck } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Justificatif } from "./types";

interface JustificatifStatusProps {
  doc: Justificatif;
  uploading: Record<string, boolean>;
}

const JustificatifStatus = ({ doc, uploading }: JustificatifStatusProps) => {
  if (uploading[doc.id]) {
    return (
      <span className="text-sm text-amber-600 flex items-center">
        <Skeleton className="h-4 w-4 mr-2 rounded-full animate-pulse" />
        Téléchargement...
      </span>
    );
  }
  
  if (doc.status === 'uploaded') {
    return (
      <span className="text-sm text-green-600 flex items-center">
        <CheckCircle className="h-4 w-4 mr-2" />
        Téléchargé
      </span>
    );
  }
  
  if (doc.status === 'validated') {
    return (
      <span className="text-sm text-blue-600 flex items-center">
        <FileCheck className="h-4 w-4 mr-2" />
        Validé
      </span>
    );
  }
  
  return null;
};

export default JustificatifStatus;
