
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CreditCard, LayoutDashboard } from "lucide-react";

interface FormThanksProps {
  onValidityChange: (isValid: boolean) => void;
  formState: Record<string, any>;
  setFormState: (state: Record<string, any>) => void;
}

const FormThanks = ({ onValidityChange, formState, setFormState }: FormThanksProps) => {
  const navigate = useNavigate();

  useEffect(() => {
    onValidityChange(true);
  }, []);

  const handlePay = () => {
    // Payment logic will be implemented here
    console.log("Redirecting to payment...");
  };

  return (
    <div className="max-w-2xl mx-auto text-center space-y-8">
      <h2 className="text-2xl font-semibold">Merci pour votre candidature !</h2>
      <p className="text-gray-600">
        Nous avons bien reçu votre dossier et nous reviendrons vers vous dans les plus brefs délais.
      </p>
      <div className="flex justify-center gap-4 pt-4">
        <Button 
          onClick={handlePay}
          className="bg-primary hover:bg-primary/90"
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Payer maintenant
        </Button>
        <Button 
          variant="outline"
          onClick={() => navigate("/dashboard")}
        >
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Tableau de bord
        </Button>
      </div>
    </div>
  );
};

export default FormThanks;
