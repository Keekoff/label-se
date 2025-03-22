
import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

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
  const handleToggle = (checked: boolean | "indeterminate") => {
    const isChecked = checked === true;
    console.log(`QuestionOption - Checkbox toggled: ${option.label} to ${isChecked}`);
    onToggle(isChecked);
  };

  return (
    <div className="flex items-start space-x-2 p-2 rounded hover:bg-gray-50">
      <Checkbox
        id={`option-${option.value}`}
        checked={isSelected}
        onCheckedChange={handleToggle}
        className="mt-1"
      />
      <div className="space-y-1 flex-1">
        <Label
          htmlFor={`option-${option.value}`}
          className="font-medium cursor-pointer"
        >
          {option.label}
        </Label>
        {isSelected && option.justificatifs && option.justificatifs.length > 0 && (
          <div className="text-sm text-gray-600 ml-1 mt-2">
            <p className="font-medium text-[#27017F]">Justificatifs requis :</p>
            <ul className="list-disc pl-5 mt-1">
              {option.justificatifs.map((doc, index) => (
                <li key={index}>{doc}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default React.memo(QuestionOption);
