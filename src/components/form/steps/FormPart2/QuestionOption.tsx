
import React from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, Radio } from "@/components/ui/radio-group";

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
        <Radio
          id={`option-${option.value}`}
          checked={isSelected}
          onClick={handleToggle}
          value={option.value}
          className="h-4 w-4"
        />
      </div>
      <div className="ml-2 text-sm">
        <Label
          htmlFor={`option-${option.value}`}
          className="font-medium cursor-pointer"
        >
          {option.label}
        </Label>
      </div>
    </div>
  );
};

export default React.memo(QuestionOption);
