
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuestionProps } from "../types";
import { RadioGroup } from "@/components/ui/radio-group";
import QuestionOption from "./QuestionOption";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const QuestionCard: React.FC<QuestionProps> = ({ question, selectedAnswers, onAnswerToggle }) => {
  const handleToggle = (label: string, selected: boolean) => {
    console.log(`QuestionCard - Toggling ${label} to ${selected} for question ${question.id}`);
    onAnswerToggle(question.id, label, selected);
  };

  const notApplicableOption = question.options.find(opt => 
    opt.label.includes("Ce critère ne s'applique pas")
  );

  const standardOptions = question.options.filter(opt => 
    !opt.label.includes("Ce critère ne s'applique pas")
  );

  return (
    <Card className="bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">{question.title}</CardTitle>
        <p className="text-gray-600 text-sm">{question.description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {standardOptions.map((option) => (
            <QuestionOption
              key={option.value}
              option={option}
              isSelected={selectedAnswers.includes(option.label)}
              onToggle={(selected) => handleToggle(option.label, selected)}
            />
          ))}
          
          {notApplicableOption && (
            <div className="mt-4 pt-2 border-t border-gray-100">
              <QuestionOption
                key={notApplicableOption.value}
                option={notApplicableOption}
                isSelected={selectedAnswers.includes(notApplicableOption.label)}
                onToggle={(selected) => handleToggle(notApplicableOption.label, selected)}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default React.memo(QuestionCard);
