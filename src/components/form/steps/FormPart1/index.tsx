
import { useEffect, useState } from "react";
import { QUESTIONS } from "./constants";
import QuestionCard from "./QuestionCard";
import { FormPart1Props } from "./types";

const FormPart1 = ({ onValidityChange, formState, setFormState }: FormPart1Props) => {
  const [answers, setAnswers] = useState<Record<string, string[]>>(() => {
    const initialAnswers: Record<string, string[]> = {};
    QUESTIONS.forEach(question => {
      initialAnswers[question.id] = Array.isArray(formState[question.id]) 
        ? formState[question.id] 
        : [];
    });
    return initialAnswers;
  });

  const toggleAnswer = (questionId: string, value: string) => {
    const currentAnswers = answers[questionId] || [];
    const newAnswers = currentAnswers.includes(value)
      ? currentAnswers.filter(v => v !== value)
      : [...currentAnswers, value];
    
    const updatedAnswers = { ...answers, [questionId]: newAnswers };
    setAnswers(updatedAnswers);
    setFormState({ ...formState, ...updatedAnswers });
    
    console.log('Updated answers:', updatedAnswers);
    const isValid = Object.values(updatedAnswers).every(answer => answer.length > 0);
    console.log('Form valid:', isValid);
    onValidityChange(isValid);
  };

  useEffect(() => {
    const isValid = Object.values(answers).every(answer => answer.length > 0);
    console.log('Initial form validation:', isValid);
    onValidityChange(isValid);
  }, [answers]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Partie 1 : Gouvernance interne juste et inclusive</h2>
        <p className="text-gray-600">
          Les questions suivantes concernent la gestion interne et la culture de l'entreprise, particulièrement la lutte contre les discriminations et les conditions de travail.
        </p>
      </div>

      <div className="space-y-8">
        {QUESTIONS.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            answers={answers[question.id] || []}
            onAnswerToggle={toggleAnswer}
          />
        ))}
      </div>
    </div>
  );
};

export default FormPart1;
