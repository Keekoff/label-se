
import { QUESTIONS } from "./constants";

/**
 * Récupère les justificatifs pour une question et une réponse spécifiques de la Partie 2
 */
export const getJustificatifsForPart2 = (questionId: string, response: string): string[] => {
  // Trouver la question correspondante
  const question = QUESTIONS.find(q => q.id === questionId);
  if (!question) return [];

  // Trouver l'option correspondant à la réponse
  const option = question.options.find(o => o.label === response);
  if (!option) return [];

  // Retourner les justificatifs
  return option.justificatifs || [];
};

// Export FormPart2 by default
export { default } from "../FormPart2";
