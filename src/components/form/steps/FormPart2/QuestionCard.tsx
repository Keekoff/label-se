
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuestionProps } from "../types";
import QuestionOption from "./QuestionOption";

const QuestionCard: React.FC<QuestionProps> = ({ question, selectedAnswers, onAnswerToggle }) => {
  const handleOptionToggle = (label: string, selected: boolean) => {
    console.log(`QuestionCard - Toggling ${label} to ${selected} for question ${question.id}`);
    onAnswerToggle(question.id, label, selected);
  };

  return (
    <Card className="bg-white">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">{question.title}</CardTitle>
        <p className="text-gray-600 text-sm">{question.description}</p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {question.options.map((option) => (
            <QuestionOption
              key={option.value}
              option={option}
              isSelected={selectedAnswers.includes(option.label)}
              onToggle={(selected) => handleOptionToggle(option.label, selected)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default React.memo(QuestionCard);
