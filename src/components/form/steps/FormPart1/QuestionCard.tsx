
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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

  const notApplicableOption = question.options.find(opt => 
    opt.label.includes("Ce critère ne s'applique pas")
  );

  const standardOptions = question.options.filter(opt => 
    !opt.label.includes("Ce critère ne s'applique pas")
  );

  return (
    <Card className="bg-white mb-6">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">{question.title}</CardTitle>
        <p className="text-gray-600 text-sm">{question.description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {standardOptions.map((option) => (
            <QuestionOption
              key={option.value}
              value={option.value}
              label={option.label}
              isSelected={answers?.includes(option.label)}
              onClick={() => handleOptionClick(option.value)}
            />
          ))}
          
          {notApplicableOption && (
            <div className="mt-4 pt-2 border-t border-gray-100">
              <QuestionOption
                key={notApplicableOption.value}
                value={notApplicableOption.value}
                label={notApplicableOption.label}
                isSelected={answers?.includes(notApplicableOption.label)}
                onClick={() => handleOptionClick(notApplicableOption.value)}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
