
import React from "react";
import FormPart2 from "./FormPart2";
import { FormPart2Props } from "./FormPart2/types";

// Composant FormPart2 avec les props nécessaires
const FormPart2Component: React.FC<FormPart2Props> = ({ onValidityChange, formState, setFormState }) => {
  return (
    <FormPart2 
      onValidityChange={onValidityChange}
      formState={formState} 
      setFormState={setFormState}
    />
  );
};

export default FormPart2Component;
