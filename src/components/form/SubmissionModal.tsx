
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
  submissionId?: string | null;
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

      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { submissionId }
      });

      if (error) {
        throw error;
      }

      if (!data?.url) {
        throw new Error('URL de paiement non reçue');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.url;
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Une erreur est survenue lors de la redirection vers le paiement");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md shadow-lg bg-white/90 backdrop-blur-sm border border-white/60">
        <DialogTitle className="text-[#27017F] font-semibold">Soumission réussie</DialogTitle>
        <DialogDescription className="py-4 text-gray-700">
          Merci d'avoir soumis votre demande. Vous trouverez les documents à fournir dans votre Dashboard.
        </DialogDescription>
        <div className="flex gap-4 justify-end">
          <Button 
            variant="outline" 
            onClick={() => navigate("/dashboard")}
            className="bg-white/90 backdrop-blur-sm text-[#27017F] hover:bg-[#27017F] hover:text-white shadow-md"
          >
            Tableau de bord
          </Button>
          <Button 
            onClick={handlePayment}
            className="bg-[#35DA56] text-white shadow-md border border-[#35DA56]/20"
          >
            Payer maintenant
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
