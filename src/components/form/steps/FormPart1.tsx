
import { useState, useEffect } from "react";

interface FormPart1Props {
  onValidityChange: (isValid: boolean) => void;
  formState: Record<string, any>;
  setFormState: (state: Record<string, any>) => void;
}

const FormPart1 = ({ onValidityChange, formState, setFormState }: FormPart1Props) => {
  useEffect(() => {
    // Temporary: set as valid for testing
    onValidityChange(true);
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Partie 1</h2>
      <p className="text-gray-500">Contenu à venir...</p>
    </div>
  );
};

export default FormPart1;
