
import React, { useState } from "react";
import { FormState } from "@/pages/Dashboard/Form/types";
import { SubmissionModal } from "@/components/form/SubmissionModal";
import { toast } from "sonner";

interface FormThanksProps {
  onValidityChange: (isValid: boolean) => void;
  formState: FormState;
  setFormState: React.Dispatch<React.SetStateAction<FormState>>;
  submissionId?: string | null;
}

const FormThanks = ({ 
  onValidityChange, 
  formState, 
  setFormState,
  submissionId
}: FormThanksProps) => {
  const [showModal, setShowModal] = useState(true);

  React.useEffect(() => {
    // Marquer cette étape comme valide
    onValidityChange(true);
  }, [onValidityChange]);
  
  return (
    <div className="space-y-8">
      <div className="text-center py-12">
        <h2 className="text-3xl font-bold mb-6 text-[#27017F]">
          Merci pour votre soumission !
        </h2>
        <p className="text-lg max-w-2xl mx-auto mb-8 text-gray-700">
          Votre demande de labellisation a été enregistrée. 
          Pour finaliser le processus, veuillez procéder au paiement.
        </p>
        
        <SubmissionModal 
          open={showModal} 
          onOpenChange={setShowModal}
          submissionId={submissionId}
        />
      </div>
    </div>
  );
};

export default FormThanks;
