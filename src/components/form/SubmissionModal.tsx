
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SubmissionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  submissionId?: string;
}

export function SubmissionModal({ open, onOpenChange, submissionId }: SubmissionModalProps) {
  const navigate = useNavigate();

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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogTitle>Soumission réussie</DialogTitle>
        <DialogDescription className="py-4">
          Merci d'avoir soumis votre demande. Vous trouverez les documents à fournir dans votre Dashboard.
        </DialogDescription>
        <div className="flex gap-4 justify-end">
          <Button variant="outline" onClick={() => navigate("/dashboard")}>
            Tableau de bord
          </Button>
          <Button onClick={handlePayment}>
            Payer maintenant
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
