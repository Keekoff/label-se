
import { Justificatif, GroupedJustificatifs } from "../types";

/**
 * Groups justificatifs by their question identifier
 */
export const groupJustificatifs = (items: Justificatif[]): GroupedJustificatifs => {
  const grouped: GroupedJustificatifs = {};
  
  items.forEach(item => {
    if (!grouped[item.question_identifier]) {
      grouped[item.question_identifier] = {
        questionId: item.question_identifier,
        questionTitle: item.question_identifier,
        items: []
      };
    }
    
    grouped[item.question_identifier].items.push(item);
  });
  
  return grouped;
};
