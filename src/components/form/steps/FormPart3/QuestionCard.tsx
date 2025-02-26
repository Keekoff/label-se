
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronsUpDown } from "lucide-react";
import { Question } from "./types";
import QuestionOption from "./QuestionOption";

interface QuestionCardProps {
  question: Question;
  selectedAnswers: string[];
  onAnswerToggle: (questionId: string, value: string) => void;
}

const QuestionCard = ({ question, selectedAnswers, onAnswerToggle }: QuestionCardProps) => {
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
              {selectedAnswers?.length > 0
                ? `${selectedAnswers.length} réponse${selectedAnswers.length > 1 ? 's' : ''} sélectionnée${selectedAnswers.length > 1 ? 's' : ''}`
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
                  isSelected={selectedAnswers?.includes(option.label)}
                  onClick={() => onAnswerToggle(question.id, option.value)}
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
