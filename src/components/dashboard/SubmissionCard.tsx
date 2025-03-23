
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, FileCheck, Award, CheckCircle } from "lucide-react";
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
    <Card className="border-none overflow-hidden shadow-lg animate-fadeIn bg-gradient-to-r from-white/90 to-white/80 backdrop-blur-md rounded-xl">
      <div className="h-2 bg-[#35DA56] w-full"></div>
      <CardContent className="p-6 sm:p-8">
        <div className="space-y-6">
          <div className="transition-all duration-300">
            {isValidated ? (
              <div className="flex items-start gap-4 p-4 rounded-lg bg-[#F2FCE2]/80 border border-[#35DA56]/20 shadow-sm">
                <Award className="h-8 w-8 text-[#35DA56] flex-shrink-0 mt-1" aria-hidden="true" />
                <div>
                  <h3 className="font-semibold text-[#27017F] mb-1 text-base sm:text-lg">
                    Félicitations !
                  </h3>
                  <p className="text-gray-700 font-medium text-sm sm:text-base leading-relaxed">
                    Bravo, votre entreprise est officiellement labellisée Startup Engagée ! 😀
                  </p>
                  <div className="flex items-center gap-2 mt-3 text-[#35DA56] font-medium text-sm">
                    <CheckCircle className="h-4 w-4" />
                    <span>Certification validée</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className={`p-5 rounded-lg ${paymentStatus === 'unpaid' ? 'bg-[#FEF7CD]/70 border border-amber-200/30' : 'bg-[#E5DEFF]/70 border border-[#27017F]/10'} shadow-sm`}>
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
              </div>
            )}
          </div>
          {!isValidated && (
            <div className="flex flex-wrap gap-4 pt-2">
              {paymentStatus === 'unpaid' && (
                <Button 
                  onClick={onPayment} 
                  className="bg-[#35DA56] text-white transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] shadow-md border border-[#35DA56]/20 px-4 sm:px-6 py-3 sm:py-5 h-auto w-full sm:w-auto"
                  disabled={isLoading}
                >
                  <CreditCard className="mr-2 h-4 w-4 flex-shrink-0" aria-hidden="true" />
                  <span className="whitespace-normal text-center">{isLoading ? 'Chargement...' : 'Payer maintenant'}</span>
                </Button>
              )}
              {paymentStatus === 'paid' && (
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/dashboard/justificatifs')} 
                  className="bg-white/90 backdrop-blur-sm text-[#27017F] hover:bg-[#27017F] hover:text-white transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px] shadow-md border border-white/60 px-4 sm:px-6 py-3 sm:py-5 h-auto w-full sm:w-auto"
                >
                  <FileCheck className="mr-2 h-4 w-4 flex-shrink-0" aria-hidden="true" />
                  <span className="whitespace-normal text-center">Ajouter mes justificatifs</span>
                </Button>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
