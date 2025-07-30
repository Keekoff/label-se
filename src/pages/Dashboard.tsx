import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCompanyData } from "@/hooks/useCompanyData";
import { toast } from "sonner";
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
import { SubmissionCard } from "@/components/dashboard/SubmissionCard";
import { CertificationCard } from "@/components/dashboard/CertificationCard";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { ErrorDisplay } from "@/components/dashboard/ErrorDisplay";

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [paymentStatus, setPaymentStatus] = useState<'unpaid' | 'pending' | 'paid' | null>(null);
  const [isPaymentLoading, setIsPaymentLoading] = useState(false);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [firstName, setFirstName] = useState<string>("");
  
  const {
    isLoading,
    companyData,
    companyName,
    error,
    errorDetails,
    hasSubmittedForm,
    isPremium
  } = useCompanyData();

  // Récupérer le prénom de l'utilisateur
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        const { data, error } = await supabase
          .from('label_submissions')
          .select('prenom')
          .eq('user_id', session.user.id)
          .maybeSingle();
        
        if (error) throw error;
        
        if (data?.prenom) {
          setFirstName(data.prenom);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  // Vérifier le paiement lors du retour depuis Stripe
  useEffect(() => {
    const verifyPaymentFromStripe = async () => {
      const success = searchParams.get('success');
      const sessionId = searchParams.get('session_id');
      const submissionIdFromUrl = searchParams.get('submission_id');
      
      if (success === 'true' && sessionId && submissionIdFromUrl) {
        try {
          console.log('Verifying payment for session:', sessionId);
          
          const { data, error } = await supabase.functions.invoke('verify-payment', {
            body: { 
              sessionId,
              submissionId: submissionIdFromUrl
            }
          });

          if (error) {
            console.error('Payment verification error:', error);
            throw error;
          }
          
          if (data?.success) {
            toast.success("Paiement confirmé avec succès !");
            setPaymentStatus('paid');
            // Nettoyer l'URL
            navigate('/dashboard', { replace: true });
          } else {
            console.error('Payment verification failed:', data);
            toast.error("Le paiement n'a pas pu être confirmé. Contactez le support si le problème persiste.");
          }
        } catch (error) {
          console.error('Error verifying payment:', error);
          toast.error("Erreur lors de la vérification du paiement. Contactez le support si le problème persiste.");
        }
      } else if (success === 'false') {
        toast.error("Paiement annulé");
      }
    };

    verifyPaymentFromStripe();
  }, [searchParams, navigate]);

  useEffect(() => {
    const fetchSubmissionData = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) {
          navigate('/login');
          return;
        }

        const { data, error } = await supabase
          .from('label_submissions')
          .select('id, payment_status')
          .eq('user_id', session.user.id)
          .maybeSingle();
        
        if (error) throw error;
        
        if (data) {
          setSubmissionId(data.id);
          setPaymentStatus(data.payment_status as 'unpaid' | 'pending' | 'paid');
        }
      } catch (error) {
        console.error('Error fetching submission data:', error);
        toast.error("Erreur lors du chargement des données");
      }
    };

    fetchSubmissionData();
  }, [navigate]);

  const handlePayment = async () => {
    setIsPaymentLoading(true);
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
        console.error("Payment creation error:", error);
        throw error;
      }

      if (!data?.url) {
        throw new Error('URL de paiement non reçue');
      }

      window.location.href = data.url;
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Une erreur est survenue lors de la redirection vers le paiement");
    } finally {
      setIsPaymentLoading(false);
    }
  };

  if (!hasSubmittedForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h1 className="text-2xl font-semibold text-[#27017F] mb-4">
              Bienvenue sur votre tableau de bord
            </h1>
            <p className="text-gray-600 mb-8">
              Pour accéder à votre tableau de bord, vous devez d'abord remplir le formulaire d'éligibilité.
            </p>
            <button
              onClick={() => navigate('/dashboard/eligibility')}
              className="bg-[#35DA56] text-white px-6 py-3 rounded-lg hover:bg-[#35DA56]/90 transition-colors"
            >
              Commencer le formulaire
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Si l'utilisateur a soumis le formulaire d'éligibilité mais n'a pas encore de soumission dans label_submissions
  // Rediriger vers le formulaire de labélisation
  if (hasSubmittedForm && !companyName) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <div className="space-y-4 mb-12">
              <h1 className="text-2xl font-semibold text-[#27017F] mb-2">
                Label Startup Engagée
              </h1>
              <h2 className="text-xl font-semibold text-[#27017F] mb-4">
                Félicitations 🎉
              </h2>
              <p className="text-gray-600 mb-4">
                Votre entreprise est éligible pour poursuivre le processus de labellisation
              </p>
              <p className="text-gray-600 mb-4">
                Ce questionnaire est l'étape clé pour évaluer votre maturité sur les sujets ESG, et vous attribuer l'échelon 1, 2 ou 3 du label Startup Engagée.
              </p>
              <p className="text-gray-600 mb-4">
                Vous disposez de 30 jours pour compléter le questionnaire.
              </p>
              <p className="text-gray-600">
                Nous restons disponibles si besoin ! Vous pouvez nous écrire à aurelie@keekoff.fr
              </p>
            </div>
            <button
              onClick={() => navigate('/dashboard/form')}
              className="bg-[#35DA56] text-white px-6 py-3 rounded-lg hover:bg-[#35DA56]/90 transition-colors"
            >
              Commencer le formulaire de labélisation
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white p-4">
      <div className="max-w-7xl mx-auto space-y-8">
        <WelcomeHeader firstName={firstName} companyName={companyName} />
        
        <SubmissionCard 
          paymentStatus={paymentStatus}
          isLoading={isPaymentLoading}
          onPayment={handlePayment}
        />

        <CertificationCard companyData={companyData} isPremium={isPremium} />
        
        {error ? (
          <ErrorDisplay 
            error={error} 
            errorDetails={errorDetails}
            companyName={companyName}
          />
        ) : (
          <DashboardCharts />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
