
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Question } from "./types";
import QuestionOption from "./QuestionOption";

interface QuestionCardProps {
  question: Question;
  selectedAnswers: string[];
  onAnswerToggle: (questionId: string, value: string) => void;
}

const QuestionCard = ({ question, selectedAnswers, onAnswerToggle }: QuestionCardProps) => {
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
              isSelected={selectedAnswers?.includes(option.label)}
              onClick={() => onAnswerToggle(question.id, option.value)}
            />
          ))}
          
          {notApplicableOption && (
            <div className="mt-4 pt-2 border-t border-gray-100">
              <QuestionOption
                key={notApplicableOption.value}
                value={notApplicableOption.value}
                label={notApplicableOption.label}
                isSelected={selectedAnswers?.includes(notApplicableOption.label)}
                onClick={() => onAnswerToggle(question.id, notApplicableOption.value)}
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
