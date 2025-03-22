
import React from "react";
import { Label } from "@/components/ui/label";

interface QuestionOptionProps {
  value: string;
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

const QuestionOption = ({ value, label, isSelected, onClick }: QuestionOptionProps) => {
  return (
    <div className="flex items-start space-x-2 p-2 rounded hover:bg-gray-50" onClick={onClick}>
      <div className="flex items-center h-5">
        <div className={`h-4 w-4 rounded-full border ${isSelected ? 'border-[#35DA56] bg-[#35DA56]' : 'border-gray-300'}`}>
          {isSelected && (
            <div className="h-2 w-2 rounded-full bg-white m-[3px]"></div>
          )}
        </div>
      </div>
      <div className="ml-2 text-sm">
        <Label
          htmlFor={`option-${value}`}
          className="font-medium cursor-pointer"
        >
          {label}
        </Label>
      </div>
    </div>
  );
};

export default QuestionOption;
