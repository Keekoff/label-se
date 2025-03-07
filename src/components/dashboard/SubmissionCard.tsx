
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
    <Card className="border border-white/40 shadow-[0_8px_30px_rgba(0,0,0,0.08)] bg-gradient-to-r from-[#FDF6E3]/90 to-[#FDF6E3]/70 backdrop-blur-sm rounded-xl">
      <CardContent className="p-8">
        <div className="space-y-6">
          <p className="text-[#27017F] font-medium text-base leading-relaxed">
            Bravo, nous avons bien reçu votre formulaire de labellisation. 
            {paymentStatus === 'unpaid' ? " Merci de procéder au paiement pour accéder aux pièces justificatives à nous envoyer, nécessaire à la validation de votre dossier." : " Vous pouvez maintenant accéder aux pièces justificatives nécessaires à la validation de votre dossier."}
          </p>
          <div className="flex flex-wrap gap-4">
            {paymentStatus === 'unpaid' && (
              <Button 
                onClick={onPayment} 
                className="bg-[#35DA56] text-white transition-shadow duration-300 shadow-md border border-[#35DA56]/20 px-6 py-5 h-auto" 
                disabled={isLoading}
              >
                <CreditCard className="mr-3 h-5 w-5" />
                {isLoading ? 'Chargement...' : 'Payer maintenant'}
              </Button>
            )}
            <Button 
              variant="outline" 
              onClick={() => navigate(paymentStatus === 'paid' ? '/dashboard/justificatifs' : '/dashboard/payments')}
              className="bg-white/90 backdrop-blur-sm text-[#27017F] hover:bg-[#27017F] hover:text-white transition-colors duration-300 shadow-md border border-white/60 px-6 py-5 h-auto"
            >
              <Upload className="mr-3 h-5 w-5" />
              {paymentStatus === 'paid' ? 'Ajouter mes justificatifs' : 'Envoyer mes justificatifs'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
