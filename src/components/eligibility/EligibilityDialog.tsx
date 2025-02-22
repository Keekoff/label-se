
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import EligibilityForm from "@/pages/EligibilityForm";
import { CheckCircle } from "lucide-react";

const EligibilityDialog = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" className="w-full justify-start hover:bg-secondary hover:text-white">
          <CheckCircle className="h-4 w-4 mr-2" />
          <span>Vérifier l'éligibilité</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <EligibilityForm />
      </DialogContent>
    </Dialog>
  );
};

export default EligibilityDialog;
