
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Upload, CreditCard } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface SubmissionCardProps {
  paymentStatus: 'unpaid' | 'pending' | 'paid' | null;
  isLoading: boolean;
  onPayment: () => void;
}

export const SubmissionCard = ({
  paymentStatus,
  isLoading,
  onPayment
}: SubmissionCardProps) => {
  const navigate = useNavigate();
  
  return (
    <Card className="border-none shadow-lg bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl transition-all duration-300 hover:shadow-xl hover:scale-[1.01] backdrop-blur-sm">
      <CardContent className="p-6 bg-amber-200/90 backdrop-blur-sm">
        <div className="space-y-6">
          <p className="text-base text-stone-950">
            Bravo, nous avons bien reçu votre formulaire de labellisation. 
            {paymentStatus === 'unpaid' ? " Merci de procéder au paiement pour accéder aux pièces justificatives à nous envoyer, nécessaire à la validation de votre dossier." : " Vous pouvez maintenant accéder aux pièces justificatives nécessaires à la validation de votre dossier."}
          </p>
          <div className="flex gap-4">
            {paymentStatus === 'unpaid' && (
              <Button 
                onClick={onPayment} 
                className="bg-[#35DA56] hover:bg-[#2EB449] shadow-sm hover:shadow-md" 
                disabled={isLoading}
              >
                <CreditCard className="mr-2 h-4 w-4" />
                {isLoading ? 'Chargement...' : 'Payer maintenant'}
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={() => navigate(paymentStatus === 'paid' ? '/dashboard/justificatifs' : '/dashboard/payments')}
              className="hover:shadow-md"
            >
              <Upload className="mr-2 h-4 w-4" />
              {paymentStatus === 'paid' ? 'Ajouter mes justificatifs' : 'Envoyer mes justificatifs'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
