
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, FileCheck } from "lucide-react";
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
    <Card className="border border-[#27017F]/40 shadow-[0_8px_30px_rgba(0,0,0,0.08)] bg-gradient-to-r from-[#F1F1F1]/90 to-[#F1F1F1]/70 backdrop-blur-sm rounded-xl">
      <CardContent className="p-8">
        <div className="space-y-6">
          <div>
            <p className="text-[#27017F] font-medium text-base leading-relaxed">
              {paymentStatus === 'unpaid' ? (
                <>
                  Vous avez rempli votre formulaire de demande de label, bravo ! 🥳
                  <br /><br />
                  Maintenant, veuillez procéder au paiement pour :
                  <br />
                  1 / Accéder à vos performances et pistes d'améliorations
                  <br />
                  2 / Partager vos documents pour valider votre demande de label
                </>
              ) : (
                "Vous pouvez maintenant accéder aux pièces justificatives nécessaires à la validation de votre dossier."
              )}
            </p>
          </div>
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
            {paymentStatus === 'paid' && (
              <Button 
                variant="outline" 
                onClick={() => navigate('/dashboard/justificatifs')} 
                className="bg-white/90 backdrop-blur-sm text-[#27017F] hover:bg-[#27017F] hover:text-white transition-colors duration-300 shadow-md border border-white/60 px-6 py-5 h-auto"
              >
                <FileCheck className="mr-3 h-5 w-5" />
                Ajouter mes justificatifs
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
