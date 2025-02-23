
export interface Question {
  id: string;
  title: string;
  description: string;
  options: { value: string; label: string }[];
}

export interface FormPart1Props {
  onValidityChange: (isValid: boolean) => void;
  formState: Record<string, any>;
  setFormState: (state: Record<string, any>) => void;
}

export interface QuestionProps {
  question: Question;
  answers: string[];
  onAnswerToggle: (questionId: string, value: string) => void;
}
