
import { useEffect, useState } from "react";
import { QUESTIONS } from "./constants";
import QuestionCard from "./QuestionCard";
import { FormPart2Props } from "./types";

/**
 * Récupère les justificatifs pour une question et une réponse spécifiques de la Partie 2
 */
export const getJustificatifsForPart2 = (questionId: string, optionLabel: string): string[] => {
  const question = QUESTIONS.find(q => q.id === questionId);
  if (!question) {
    console.warn(`Question not found with id: ${questionId}`);
    return [];
  }
  
  const option = question.options.find(o => o.label === optionLabel);
  if (!option || !option.justificatifs) {
    console.warn(`Option not found with label "${optionLabel}" for question "${questionId}" or it has no justificatifs`);
    return [];
  }
  
  return option.justificatifs;
};

const FormPart2 = ({ onValidityChange, formState, setFormState }: FormPart2Props) => {
  const [answers, setAnswers] = useState<Record<string, string[]>>(() => {
    const initialAnswers: Record<string, string[]> = {};
    QUESTIONS.forEach(question => {
      initialAnswers[question.id] = Array.isArray(formState[question.id]) 
        ? formState[question.id] 
        : [];
    });
    return initialAnswers;
  });

  // Function to toggle answers with improved handling of exclusive options
  const toggleAnswer = (questionId: string, label: string, forceState?: boolean) => {
    const currentAnswers = answers[questionId] || [];
    let newAnswers: string[];

    // Handle "Ce critère ne s'applique pas" option specially
    if (label.includes("Ce critère ne s'applique pas")) {
      if (forceState !== undefined) {
        newAnswers = forceState ? [label] : [];
      } else {
        newAnswers = currentAnswers.includes(label) ? [] : [label];
      }
    } else {
      // For other options
      if (forceState !== undefined) {
        newAnswers = forceState
          ? [...currentAnswers.filter(a => !a.includes("Ce critère ne s'applique pas")), label]
          : currentAnswers.filter(a => a !== label);
      } else {
        // Toggle behavior
        newAnswers = currentAnswers.includes(label)
          ? currentAnswers.filter(a => a !== label)
          : [...currentAnswers.filter(a => !a.includes("Ce critère ne s'applique pas")), label];
      }
    }
    
    // Update local state and parent form state
    const updatedAnswers = { ...answers, [questionId]: newAnswers };
    setAnswers(updatedAnswers);
    
    // Update form state with the new answers
    setFormState({ ...formState, [questionId]: newAnswers });
    
    // Debug logging
    console.log(`Updated ${questionId} answers:`, newAnswers);
  };

  // Check form validity whenever answers change
  useEffect(() => {
    const isValid = Object.values(answers).every(answer => answer.length > 0);
    onValidityChange(isValid);
    
    // Log current answers state for debugging
    console.log("Current form answers state:", answers);
  }, [answers, onValidityChange]);

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-2">Partie 2 : Économique & Sociétal</h2>
        <p className="text-gray-600">
          Cette section concernera les aspects économiques et sociétaux de votre entreprise.
        </p>
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

export default FormPart2;
