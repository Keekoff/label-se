
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, FileCheck, Award } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

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
  const [isValidated, setIsValidated] = useState(false);

  useEffect(() => {
    const checkValidation = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        const { data, error } = await supabase
          .from('label_submissions')
          .select('valide')
          .eq('user_id', session.user.id)
          .maybeSingle();
        
        if (error) throw error;
        setIsValidated(data?.valide === true);
      } catch (error) {
        console.error('Erreur lors de la vérification de la validation:', error);
      }
    };

    checkValidation();
  }, []);
  
  return (
    <Card className="border border-[#27017F]/40 shadow-[0_8px_30px_rgba(0,0,0,0.08)] bg-gradient-to-r from-[#F1F1F1]/90 to-[#F1F1F1]/70 backdrop-blur-sm rounded-xl">
      <CardContent className="p-4 sm:p-8">
        <div className="space-y-6">
          <div>
            {isValidated ? (
              <div className="flex items-start gap-3">
                <Award className="h-6 w-6 text-[#35DA56] flex-shrink-0 mt-1" />
                <p className="text-[#27017F] font-medium text-sm sm:text-base leading-relaxed">
                  Bravo, votre entreprise est officiellement labellisée Startup Engagée ! 😀
                </p>
              </div>
            ) : (
              <p className="text-[#27017F] font-medium text-sm sm:text-base leading-relaxed">
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
                  <>
                    Votre paiement a bien été effectué, merci ! 🙂
                    <br /><br />
                    Pour finaliser votre demande de label, veuillez télécharger tous les documents requis. Une fois vérifiés, notre équipe validera votre demande de label Startup Engagée ! 🥳
                  </>
                )}
              </p>
            )}
          </div>
          {!isValidated && (
            <div className="flex flex-wrap gap-4">
              {paymentStatus === 'unpaid' && (
                <Button 
                  onClick={onPayment} 
                  className="bg-[#35DA56] text-white transition-shadow duration-300 shadow-md border border-[#35DA56]/20 px-4 sm:px-6 py-3 sm:py-5 h-auto w-full sm:w-auto"
                  disabled={isLoading}
                >
                  <CreditCard className="mr-2 h-4 w-4 flex-shrink-0" />
                  <span className="whitespace-normal text-center">{isLoading ? 'Chargement...' : 'Payer maintenant'}</span>
                </Button>
              )}
              {paymentStatus === 'paid' && (
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/dashboard/justificatifs')} 
                  className="bg-white/90 backdrop-blur-sm text-[#27017F] hover:bg-[#27017F] hover:text-white transition-colors duration-300 shadow-md border border-white/60 px-4 sm:px-6 py-3 sm:py-5 h-auto w-full sm:w-auto"
                >
                  <FileCheck className="mr-2 h-4 w-4 flex-shrink-0" />
                  <span className="whitespace-normal text-center">Justificatifs à fournir</span>
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
