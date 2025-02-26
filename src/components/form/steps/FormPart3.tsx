
import { useEffect, useState } from "react";
import { QUESTIONS } from "./FormPart3/constants";
import QuestionCard from "./FormPart3/QuestionCard";
import { FormPart3Props } from "./FormPart3/types";

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

  const toggleAnswer = (questionId: string, value: string, label: string) => {
    const currentAnswers = answers[questionId] || [];
    let newAnswers: string[];

    // Handle "Non applicable" option
    if (label.includes("Ce critère ne s'applique pas à mon entreprise")) {
      newAnswers = currentAnswers.includes(label) ? [] : [label];
    } else {
      // If selecting a regular option, remove "Non applicable" if present
      newAnswers = currentAnswers.includes(label)
        ? currentAnswers.filter(v => v !== label)
        : [...currentAnswers.filter(v => !v.includes("Ce critère ne s'applique pas à mon entreprise")), label];
    }
    
    const updatedAnswers = { ...answers, [questionId]: newAnswers };
    setAnswers(updatedAnswers);
    setFormState({ ...formState, ...updatedAnswers });
  };

  useEffect(() => {
    const isValid = Object.values(answers).every(answer => answer.length > 0);
    onValidityChange(isValid);
  }, [answers]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Partie 3 : Maîtrise d'impact environnemental & développement durable</h2>
        <p className="text-gray-600">
          Les questions suivantes sont relatives aux actions déployées pour limiter l'empreinte écologique.
        </p>
      </div>

      <div className="space-y-8">
        {QUESTIONS.map((question) => (
          <QuestionCard
            key={question.id}
            question={question}
            selectedAnswers={answers[question.id] || []}
            onAnswerToggle={(questionId, value) => {
              const option = question.options.find(opt => opt.value === value);
              if (option) {
                toggleAnswer(questionId, value, option.label);
              }
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default FormPart3;
