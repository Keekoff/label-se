
import { useEffect } from "react";

interface FormThanksProps {
  onValidityChange: (isValid: boolean) => void;
  formState: Record<string, any>;
  setFormState: (state: Record<string, any>) => void;
}

const FormThanks = ({ onValidityChange, formState, setFormState }: FormThanksProps) => {
  useEffect(() => {
    onValidityChange(true);
  }, []);

  return (
    <div className="max-w-2xl mx-auto text-center space-y-4">
      <h2 className="text-2xl font-semibold">Merci pour votre candidature !</h2>
      <p className="text-gray-600">
        Nous avons bien reçu votre dossier et nous reviendrons vers vous dans les plus brefs délais.
      </p>
    </div>
  );
};

export default FormThanks;
