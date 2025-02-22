
import { useEffect } from "react";

interface FormPart1Props {
  onValidityChange: (isValid: boolean) => void;
  formState: Record<string, any>;
  setFormState: (state: Record<string, any>) => void;
}

const FormPart1 = ({ onValidityChange }: FormPart1Props) => {
  useEffect(() => {
    // Always valid since content moved to Contact section
    onValidityChange(true);
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <h2 className="text-2xl font-semibold mb-6">Partie 1</h2>
      <p className="text-gray-500">Cette section sera implémentée prochainement.</p>
    </div>
  );
};

export default FormPart1;
