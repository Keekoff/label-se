
import { useEffect, useState } from "react";
import { QUESTIONS, getJustificatifsForQuestion } from "./questions";
import QuestionCard from "./QuestionCard";
import { FormPart2Props } from "./types";

/**
 * Récupère les justificatifs pour une question et une réponse spécifiques de la Partie 2
 */
export const getJustificatifsForPart2 = (questionId: string, optionLabel: string): string[] => {
  return getJustificatifsForQuestion(questionId, optionLabel);
};

const FormPart2 = ({ onValidityChange, formState, setFormState }: FormPart2Props) => {
  // Initialiser l'état des réponses à partir du formState
  const [answers, setAnswers] = useState<Record<string, string[]>>(() => {
    const initialAnswers: Record<string, string[]> = {};
    
    // Remplir avec les réponses existantes ou des tableaux vides
    QUESTIONS.forEach(question => {
      initialAnswers[question.id] = formState[question.id] 
        ? [...formState[question.id]] 
        : [];
    });
    
    return initialAnswers;
  });

  // Fonction pour basculer les réponses avec une meilleure gestion des options exclusives
  const toggleAnswer = (questionId: string, label: string, selected: boolean) => {
    console.log(`FormPart2 - Toggling answer for ${questionId}, label: ${label}, selected: ${selected}`);
    
    // Trouver la question correspondante pour vérifier ses options
    const question = QUESTIONS.find(q => q.id === questionId);
    if (!question) {
      console.warn(`Question non trouvée: ${questionId}`);
      return;
    }
    
    const currentAnswers = [...(answers[questionId] || [])];
    let newAnswers: string[];

    // Gestion spéciale pour l'option "Ce critère ne s'applique pas"
    if (label.includes("Ce critère ne s'applique pas")) {
      // Si cette option est sélectionnée, on efface toutes les autres
      newAnswers = selected ? [label] : [];
    } else {
      // Pour les autres options
      if (selected) {
        // Ajout d'une option normale doit supprimer "Ce critère ne s'applique pas" si présent
        newAnswers = [
          ...currentAnswers.filter(a => !a.includes("Ce critère ne s'applique pas")), 
          label
        ];
      } else {
        // Suppression d'une option normale
        newAnswers = currentAnswers.filter(a => a !== label);
      }
    }
    
    // Mettre à jour l'état local de manière immutable
    setAnswers(prevAnswers => ({
      ...prevAnswers,
      [questionId]: newAnswers
    }));
    
    // Mettre à jour l'état du formulaire parent
    setFormState({
      ...formState,
      [questionId]: newAnswers
    });
    
    console.log(`FormPart2 - Updated ${questionId} answers:`, newAnswers);
  };

  // Vérifier la validité du formulaire chaque fois que les réponses changent
  useEffect(() => {
    const isValid = Object.values(answers).every(answer => answer.length > 0);
    console.log("FormPart2 - Checking validity:", isValid, answers);
    onValidityChange(isValid);
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
