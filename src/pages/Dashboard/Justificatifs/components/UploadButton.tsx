
import React from "react";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UploadButtonProps {
  isUploading: boolean;
  onUpload: () => void;
}

const UploadButton: React.FC<UploadButtonProps> = ({ isUploading, onUpload }) => {
  return (
    <div className="flex justify-end">
      <Button 
        onClick={onUpload} 
        disabled={isUploading}
        className="bg-[#35DA56] hover:bg-[#27017F]"
      >
        {isUploading ? (
          <>
            <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
            Téléchargement en cours...
          </>
        ) : (
          <>
            <Check className="mr-2 h-4 w-4" />
            Envoyer les documents
          </>
        )}
      </Button>
    </div>
  );
};

export default UploadButton;
