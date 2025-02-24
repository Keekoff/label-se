
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { WelcomeHeader } from "@/components/dashboard/WelcomeHeader";
import { SubmissionCard } from "@/components/dashboard/SubmissionCard";
import { DashboardCharts } from "@/components/dashboard/DashboardCharts";
import { WelcomeCard } from "@/components/dashboard/WelcomeCard";

type PaymentStatus = 'unpaid' | 'pending' | 'paid' | null;

const Dashboard = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [firstName, setFirstName] = useState("");
  const [hasSubmittedForm, setHasSubmittedForm] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<PaymentStatus>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getSubmissionDetails = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        navigate("/login");
        return;
      }

      const { data, error } = await supabase
        .from('label_submissions')
        .select('id, first_name, status, payment_status')
        .eq('user_id', session.user.id)
        .maybeSingle();
      
      if (error) throw error;

      if (data) {
        setFirstName(data.first_name || '');
        setSubmissionId(data.id);
        setHasSubmittedForm(data.status !== 'draft');
        setPaymentStatus(data.payment_status as PaymentStatus);
      }
    } catch (error) {
      console.error('Error fetching submission details:', error);
      toast.error("Erreur lors du chargement de vos informations");
    }
  };

  useEffect(() => {
    getSubmissionDetails();
  }, []);

  useEffect(() => {
    const checkPaymentStatus = async () => {
      const success = searchParams.get('success');
      const sessionId = searchParams.get('session_id');
      const submissionIdFromUrl = searchParams.get('submission_id');

      if (success === 'true' && sessionId && submissionIdFromUrl) {
        try {
          const { error } = await supabase
            .from('label_submissions')
            .update({ 
              payment_status: 'paid',
              payment_id: sessionId,
            })
            .eq('id', submissionIdFromUrl);

          if (error) throw error;
          
          toast.success("Paiement effectué avec succès !");
          setPaymentStatus('paid');
          
          navigate('/dashboard', { replace: true });
          getSubmissionDetails();
        } catch (error) {
          console.error('Error updating payment status:', error);
          toast.error("Erreur lors de la mise à jour du statut de paiement");
        }
      } else if (success === 'false') {
        toast.error("Le paiement a été annulé.");
        navigate('/dashboard', { replace: true });
      }
    };

    checkPaymentStatus();
  }, [searchParams]);

  const handlePayment = async () => {
    try {
      setIsLoading(true);
      
      if (!submissionId) {
        toast.error("Une erreur est survenue: ID de soumission manquant");
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-payment', {
        body: { submissionId }
      });

      if (error) throw error;
      if (!data?.url) throw new Error('URL de paiement non reçue');

      setPaymentStatus('pending');
      window.location.href = data.url;
    } catch (error) {
      console.error('Payment error:', error);
      toast.error("Une erreur est survenue lors de la redirection vers le paiement");
      setPaymentStatus('unpaid');
    } finally {
      setIsLoading(false);
    }
  };

  if (hasSubmittedForm) {
    return (
      <div className="space-y-8 animate-fadeIn">
        <WelcomeHeader firstName={firstName} />
        <SubmissionCard 
          paymentStatus={paymentStatus}
          isLoading={isLoading}
          onPayment={handlePayment}
        />
        <DashboardCharts />
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <WelcomeHeader firstName={firstName} />
      <WelcomeCard />
    </div>
  );
};

export default Dashboard;
