
import { QUESTIONS } from "./questions";
import { getJustificatifsForQuestion } from "./questions";

// Fonction pour récupérer les justificatifs pour une question et une réponse spécifiques
export const getJustificatifsForPart2 = (questionId: string, optionLabel: string): string[] => {
  return getJustificatifsForQuestion(questionId, optionLabel);
};

// Re-exporter la fonction pour qu'elle soit accessible via import depuis FormPart2/index
export { getJustificatifsForQuestion };
export { QUESTIONS };
