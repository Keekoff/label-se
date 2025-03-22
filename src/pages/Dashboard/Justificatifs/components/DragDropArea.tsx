
import React from "react";
import { Paperclip, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";

interface DragDropAreaProps {
  isUploading: boolean;
  onFileSelect: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const DragDropArea: React.FC<DragDropAreaProps> = ({ isUploading, onFileSelect }) => {
  return (
    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
      <Paperclip className="mx-auto h-8 w-8 text-gray-400 mb-2" />
      <p className="text-sm text-gray-500 mb-4">
        Déposez ici vos documents ou cliquez pour parcourir
      </p>
      <div className="relative">
        <input
          type="file"
          multiple
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={onFileSelect}
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          disabled={isUploading}
        />
        <Button 
          variant="outline" 
          className="relative pointer-events-none"
          disabled={isUploading}
        >
          <Upload className="mr-2 h-4 w-4" />
          Parcourir les fichiers
        </Button>
      </div>
      <p className="mt-2 text-xs text-gray-500">
        Types acceptés: PDF, DOC, DOCX, JPG, PNG | Max: 10MB par fichier
      </p>
    </div>
  );
};

export default DragDropArea;
