
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface SubmissionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaymentClick: () => void;
}

export function SubmissionModal({ open, onOpenChange, onPaymentClick }: SubmissionModalProps) {
  const navigate = useNavigate();

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
          <Button onClick={onPaymentClick}>
            Payer maintenant
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
