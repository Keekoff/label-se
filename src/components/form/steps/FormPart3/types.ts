
export interface FormPart3Props {
  onValidityChange: (isValid: boolean) => void;
  formState: Record<string, any>;
  setFormState: (state: Record<string, any>) => void;
}

export interface Question {
  id: string;
  title: string;
  description: string;
  options: { value: string; label: string }[];
}
