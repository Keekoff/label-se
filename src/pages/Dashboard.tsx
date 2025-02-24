
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LineChart, BarChart, PieChart } from "@/components/ui/chart";
import { supabase } from "@/integrations/supabase/client";
import { Upload, CreditCard } from "lucide-react";
import { toast } from "sonner";

const Dashboard = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState("");
  const [hasSubmittedForm, setHasSubmittedForm] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState<string | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);

  useEffect(() => {
    const getSubmissionDetails = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession();
      if (session?.user) {
        const { data } = await supabase
          .from('label_submissions')
          .select('id, first_name, status, payment_status')
          .eq('user_id', session.user.id)
          .maybeSingle();
        
        if (data?.first_name) {
          setFirstName(data.first_name);
        }
        if (data?.id) {
          setSubmissionId(data.id);
        }
        // Check if form is submitted based on status
        if (data?.status && data.status !== 'draft') {
          setHasSubmittedForm(true);
        }
        if (data?.payment_status) {
          setPaymentStatus(data.payment_status);
        }
      }
    };
    getSubmissionDetails();
  }, []);

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

      const response = await fetch(
        `${window.location.origin}/functions/create-checkout-session`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({ submissionId }),
        }
      );

      const { url, error } = await response.json();
      
      if (error) {
        throw new Error(error);
      }

      // Redirect to Stripe Checkout
      window.location.href = url;
    } catch (error) {
      console.error("Payment error:", error);
      toast.error("Une erreur est survenue lors de la redirection vers le paiement");
    }
  };

  if (hasSubmittedForm) {
    return (
      <div className="space-y-8 animate-fadeIn">
        <div>
          <h1 className="text-3xl font-bold">Bienvenue, {firstName}</h1>
          <p className="text-gray-500 mt-2">
            Voici un aperçu de votre activité récente
          </p>
        </div>

        <Card className="border-none shadow-md bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl transition-all duration-200 hover:shadow-xl hover:scale-[1.01]">
          <CardContent className="p-6">
            <div className="space-y-6">
              <p className="text-lg">
                Bravo, nous avons bien reçu votre formulaire de labellisation. 
                {paymentStatus === 'unpaid' ? 
                  "Merci de procéder au paiement pour accéder aux pièces justificatives à nous envoyer, nécessaire à la validation de votre dossier." : 
                  "Vous pouvez maintenant accéder aux pièces justificatives nécessaires à la validation de votre dossier."}
              </p>
              <div className="flex gap-4">
                {paymentStatus === 'unpaid' && (
                  <Button onClick={handlePayment} className="bg-primary hover:bg-primary-hover">
                    <CreditCard className="mr-2 h-4 w-4" />
                    Payer maintenant
                  </Button>
                )}
                <Button variant="outline" onClick={() => {}}>
                  <Upload className="mr-2 h-4 w-4" />
                  Envoyer mes justificatifs
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Graph Boxes */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
            <h3 className="text-lg font-semibold mb-4">Impact Environnemental</h3>
            <div className="h-64">
              <LineChart 
                data={[
                  { name: 'Jan', value: 400 },
                  { name: 'Fév', value: 300 },
                  { name: 'Mar', value: 600 },
                  { name: 'Avr', value: 500 },
                ]}
              />
            </div>
          </Card>

          <Card className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
            <h3 className="text-lg font-semibold mb-4">Répartition RSE</h3>
            <div className="h-64">
              <PieChart 
                data={[
                  { name: 'Social', value: 35 },
                  { name: 'Environnement', value: 40 },
                  { name: 'Gouvernance', value: 25 },
                ]}
              />
            </div>
          </Card>

          <Card className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
            <h3 className="text-lg font-semibold mb-4">Progression Mensuelle</h3>
            <div className="h-64">
              <BarChart 
                data={[
                  { name: 'T1', value: 65 },
                  { name: 'T2', value: 75 },
                  { name: 'T3', value: 85 },
                  { name: 'T4', value: 90 },
                ]}
              />
            </div>
          </Card>

          <Card className="p-6 transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
            <h3 className="text-lg font-semibold mb-4">Objectifs Atteints</h3>
            <div className="h-64">
              <BarChart 
                data={[
                  { name: 'Obj 1', value: 90 },
                  { name: 'Obj 2', value: 75 },
                  { name: 'Obj 3', value: 85 },
                  { name: 'Obj 4', value: 95 },
                ]}
              />
            </div>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn">
      <div>
        <h1 className="text-3xl font-bold">Bienvenue, {firstName}</h1>
        <p className="text-gray-500 mt-2">
          Voici un aperçu de votre activité récente
        </p>
      </div>

      <Card className="border-none shadow-md bg-gradient-to-br from-primary/5 to-secondary/5 rounded-xl transition-all duration-200 hover:shadow-xl hover:scale-[1.01]">
        <CardContent className="p-6 rounded-xl bg-[8985FF] bg-[#8a86ff]">
          <div className="space-y-4">
            <h2 className="text-xl text-primary font-extrabold">Label Startup Engagée</h2>
            <p className="text-base font-semibold">
              Félicitations 🎉 Vous êtes éligible pour poursuivre le processus de labellisation !
            </p>
            <p className="text-sm text-gray-950">
              Ce questionnaire va nous permettre de vous attribuer le label Startup Engagée à l'échelon 1, 2 ou 3 selon votre maturité sur les sujets RSE.
            </p>
            <p className="text-sm text-slate-950">
              Vous disposez de 30 jours pour compléter le questionnaire.<br />
              Nous restons disponibles si besoin !
            </p>
            <Button onClick={() => navigate("/dashboard/form")} className="mt-4 text-slate-50 bg-[27017F] bg-[#27017e]">
              Remplir le questionnaire
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
