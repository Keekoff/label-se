
import { useEffect, useState } from "react";
import { FormPart3Props } from "./types";
import { QUESTIONS } from "./constants";
import QuestionCard from "./QuestionCard";

const FormPart3 = ({ onValidityChange, formState, setFormState }: FormPart3Props) => {
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
    let newAnswers: string[];

    // Handle "Non applicable" option
    if (value.includes("Non applicable")) {
      newAnswers = currentAnswers.includes(value) ? [] : [value];
    } else {
      // If selecting a regular option, remove "Non applicable" if present
      newAnswers = currentAnswers.includes(value)
        ? currentAnswers.filter(v => v !== value)
        : [...currentAnswers.filter(v => !v.includes("Non applicable")), value];
    }
    
    const updatedAnswers = { ...answers, [questionId]: newAnswers };
    setAnswers(updatedAnswers);
    setFormState({ ...formState, ...updatedAnswers });
  };

  // Check form validity whenever answers change
  useEffect(() => {
    const isValid = QUESTIONS.every(question => 
      answers[question.id] && answers[question.id].length > 0
    );
    onValidityChange(isValid);
  }, [answers, onValidityChange]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Partie 3 : Maîtrise d'impact environnemental & développement durable</h2>
        <p className="text-gray-600 mb-4">
          Les questions suivantes sont relatives aux actions déployées pour limiter l'empreinte écologique.
        </p>
        <div className="bg-gray-50 p-4 rounded-lg space-y-3">
          <p className="text-gray-700">
            Cette partie porte sur les actions mises en place pour mesurer, limiter et réduire l'empreinte
            environnementale de votre activité.
          </p>
          <p className="text-gray-700">
            Qu'il s'agisse de vos bureaux, de vos produits, de vos usages numériques ou de vos
            déplacements, chaque geste compte pour inscrire votre startup dans une trajectoire plus
            durable.
          </p>
          <p className="text-gray-700">
            <strong>Important :</strong> Vos réponses doivent s'appuyer sur des éléments tangibles : actions mises en œuvre
            documents ou outils utilisés au quotidien.
          </p>
        </div>
      </div>

      <div className="space-y-8">
        {QUESTIONS.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            selectedAnswers={answers[question.id] || []}
            onAnswerToggle={toggleAnswer}
          />
        ))}
      </div>
    </div>
  );
};

export default FormPart3;
