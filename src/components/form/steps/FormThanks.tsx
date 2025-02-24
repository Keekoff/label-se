
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CreditCard, LayoutDashboard } from "lucide-react";
import { Card } from "@/components/ui/card";

interface FormThanksProps {
  onValidityChange: (isValid: boolean) => void;
  formState: Record<string, any>;
  setFormState: (state: Record<string, any>) => void;
}

const pricingTiers = [
  { range: "0 à 10 salariés", price: "99€ HT" },
  { range: "11 à 49 salariés", price: "199€ HT" },
  { range: "50 à 99 salariés", price: "249€ HT" },
  { range: "Plus de 100 salariés", price: "349€ HT" }
];

const getPricingTier = (employeeCount: string) => {
  const count = parseInt(employeeCount);
  if (count <= 10) return "0 à 10 salariés";
  if (count <= 49) return "11 à 49 salariés";
  if (count <= 99) return "50 à 99 salariés";
  return "Plus de 100 salariés";
};

const FormThanks = ({ onValidityChange, formState }: FormThanksProps) => {
  const navigate = useNavigate();
  const currentTier = getPricingTier(formState.employeeCount || "0");

  useEffect(() => {
    onValidityChange(true);
  }, [onValidityChange]);

  const handlePay = () => {
    console.log("Redirecting to payment...");
  };

  return (
    <div className="max-w-4xl mx-auto text-center space-y-8">
      <h2 className="text-2xl font-semibold">Merci pour votre candidature !</h2>
      <p className="text-gray-600">
        Nous avons bien reçu votre dossier et nous reviendrons vers vous dans les plus brefs délais.
      </p>

      <Card className="p-6 mt-8">
        <h3 className="text-xl font-semibold mb-6">Grille tarifaire</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="font-semibold text-gray-600">Nombre de collaborateurs</div>
          <div className="font-semibold text-gray-600">Prix</div>
          {pricingTiers.map((tier) => (
            <React.Fragment key={tier.range}>
              <div className={`py-2 ${tier.range === currentTier ? 'bg-primary/5 font-medium' : ''}`}>
                {tier.range}
              </div>
              <div className={`py-2 ${tier.range === currentTier ? 'bg-primary/5 font-medium' : ''}`}>
                {tier.price}
              </div>
            </React.Fragment>
          ))}
        </div>
        <div className="mt-6 text-sm text-gray-500">
          * Prix basé sur votre effectif déclaré
        </div>
      </Card>

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
