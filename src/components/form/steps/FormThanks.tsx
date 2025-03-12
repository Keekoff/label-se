
import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { CreditCard, LayoutDashboard } from "lucide-react";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FormThanksProps {
  onValidityChange: (isValid: boolean) => void;
  formState: Record<string, any>;
  setFormState: (state: Record<string, any>) => void;
  submissionId?: string | null;
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

const FormThanks = ({ onValidityChange, formState, submissionId }: FormThanksProps) => {
  const navigate = useNavigate();
  const currentTier = getPricingTier(formState.employeeCount || "0");

  useEffect(() => {
    onValidityChange(true);
  }, [onValidityChange]);

  const handlePayment = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error("Veuillez vous connecter pour continuer");
        navigate("/login");
        return;
      }

      if (!submissionId) {
        toast.error("Une erreur est survenue");
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ submissionId }),
        }
      );

      const { url, error } = await response.json();
      
      if (error) {
        throw new Error(error);
      }

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Une erreur est survenue lors de la redirection vers le paiement");
    }
  };

  return (
    <div className="max-w-4xl mx-auto text-center space-y-8">
      <h2 className="text-2xl font-semibold">Merci pour votre candidature !</h2>
      <p className="text-gray-600">
        Nous avons bien reçu votre dossier et nous reviendrons vers vous dans les plus brefs délais.
        Vous trouverez les documents à fournir dans votre Dashboard.
      </p>

      <Card className="p-6 mt-8 shadow-md bg-white/95 backdrop-blur-sm hover:shadow-lg transition-all duration-300">
        <h3 className="text-xl font-semibold mb-6">Grille tarifaire</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="font-semibold text-gray-600">Nombre de collaborateurs</div>
          <div className="font-semibold text-gray-600">Prix</div>
          {pricingTiers.map((tier) => (
            <React.Fragment key={tier.range}>
              <div className={`py-2 ${tier.range === currentTier ? 'bg-[#35DA56]/10 font-medium' : ''}`}>
                {tier.range}
              </div>
              <div className={`py-2 ${tier.range === currentTier ? 'bg-[#35DA56]/10 font-medium' : ''}`}>
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
          onClick={handlePayment}
          className="bg-[#35DA56] hover:bg-[#35DA56]/90 shadow-sm hover:shadow-md"
        >
          <CreditCard className="mr-2 h-4 w-4" />
          Payer maintenant
        </Button>
        <Button 
          variant="outline"
          onClick={() => navigate("/dashboard")}
          className="shadow-sm hover:shadow-md"
        >
          <LayoutDashboard className="mr-2 h-4 w-4" />
          Tableau de bord
        </Button>
      </div>
    </div>
  );
};

export default FormThanks;
