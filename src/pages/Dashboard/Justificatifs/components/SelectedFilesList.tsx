
import React from "react";
import { File, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SelectedFilesListProps {
  files: File[];
  onRemoveFile: (index: number) => void;
}

const SelectedFilesList: React.FC<SelectedFilesListProps> = ({ files, onRemoveFile }) => {
  if (files.length === 0) return null;

  return (
    <div className="space-y-2">
      <div className="text-sm font-medium">Fichiers sélectionnés ({files.length}):</div>
      <ul className="space-y-2 max-h-[200px] overflow-y-auto p-2">
        {files.map((file, index) => (
          <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-md">
            <div className="flex items-center space-x-2 overflow-hidden">
              <File className="h-4 w-4 flex-shrink-0 text-[#27017F]" />
              <span className="text-sm truncate">{file.name}</span>
              <span className="text-xs text-gray-500">
                ({(file.size / 1024).toFixed(1)} Ko)
              </span>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="h-8 w-8 p-0"
              onClick={() => onRemoveFile(index)}
            >
              <X className="h-4 w-4 text-gray-500" />
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SelectedFilesList;
