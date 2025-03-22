
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";

interface QuestionOptionProps {
  option: {
    value: string;
    label: string;
    justificatifs?: string[];
  };
  isSelected: boolean;
  onToggle: (selected: boolean) => void;
}

const QuestionOption: React.FC<QuestionOptionProps> = ({ option, isSelected, onToggle }) => {
  const handleToggle = () => {
    onToggle(!isSelected);
  };

  return (
    <div className="flex items-start space-x-2 p-2 rounded hover:bg-gray-50">
      <div className="flex items-center h-5">
        <div className={`h-4 w-4 rounded-full border ${isSelected ? 'border-[#35DA56] bg-[#35DA56]' : 'border-gray-300'}`} onClick={handleToggle}>
          {isSelected && (
            <div className="h-2 w-2 rounded-full bg-white m-[3px]"></div>
          )}
        </div>
      </div>
      <div className="ml-2 text-sm">
        <Label
          htmlFor={`option-${option.value}`}
          className="font-medium cursor-pointer"
          onClick={handleToggle}
        >
          {option.label}
        </Label>
      </div>
    </div>
  );
};

export default React.memo(QuestionOption);
