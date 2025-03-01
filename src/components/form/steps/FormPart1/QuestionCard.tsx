
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { ChevronsUpDown } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import QuestionOption from "./QuestionOption";
import { QuestionProps } from "./types";

const QuestionCard = ({ question, answers, onAnswerToggle }: QuestionProps) => {
  const handleOptionClick = (value: string) => {
    // Find the label for this value
    const option = question.options.find(opt => opt.value === value);
    if (!option) return;
    
    if (option.label.includes("Ce critère ne s'applique pas à mon entreprise")) {
      // If clicking "Non applicable", toggle clear mode
      const isAlreadySelected = answers.includes(option.label);
      onAnswerToggle(question.id, option.label, !isAlreadySelected);
    } else {
      // If clicking other option, make sure to remove "Non applicable" if present
      const nonApplicableOption = question.options.find(o => 
        o.label.includes("Ce critère ne s'applique pas à mon entreprise")
      );
      
      if (nonApplicableOption && answers.includes(nonApplicableOption.label)) {
        onAnswerToggle(question.id, nonApplicableOption.label, false);
      }
      
      // Toggle the selected option
      onAnswerToggle(question.id, option.label);
    }
  };

  return (
    <div className="space-y-4 pb-6 border-b last:border-0">
      <div>
        <h3 className="text-lg font-medium flex items-start gap-1">
          {question.title}
          <span className="text-red-500">*</span>
        </h3>
        <p className="text-gray-600 mt-1 text-sm">{question.description}</p>
      </div>

      <div className="space-y-2">
        <Label>Votre réponse</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              className="w-full justify-between"
            >
              {answers?.length > 0
                ? `${answers.length} réponse${answers.length > 1 ? 's' : ''} sélectionnée${answers.length > 1 ? 's' : ''}`
                : "Sélectionner vos réponses"}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[--radix-popover-trigger-width] p-0" align="start">
            <div className="max-h-[300px] overflow-auto p-1">
              {question.options.map((option) => (
                <QuestionOption
                  key={option.value}
                  value={option.value}
                  label={option.label}
                  isSelected={answers?.includes(option.label)}
                  onClick={() => handleOptionClick(option.value)}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};

export default QuestionCard;
