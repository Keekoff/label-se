
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Payment {
  id: string;
  created_at: string;
  payment_id: string;
  nom_entreprise: string;
  payment_status: string;
}

const Payments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast.error("Vous devez être connecté pour accéder à cette page");
          return;
        }

        const { data, error } = await supabase
          .from('label_submissions')
          .select('id, created_at, payment_id, nom_entreprise, payment_status')
          .eq('user_id', session.user.id)
          .eq('payment_status', 'paid')
          .order('created_at', { ascending: false });

        if (error) {
          throw error;
        }

        if (data) {
          setPayments(data as Payment[]);
        }
      } catch (error) {
        console.error('Error fetching payments:', error);
        toast.error("Une erreur est survenue lors du chargement des paiements");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayments();
  }, []);

  const downloadInvoice = async (paymentId: string) => {
    toast.info("La fonctionnalité de téléchargement sera bientôt disponible");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p>Chargement...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Mes paiements</h1>
        <p className="text-gray-500 mt-2">
          Historique de vos paiements et factures
        </p>
      </div>

      <div className="grid gap-4">
        {payments.map((payment) => (
          <Card key={payment.id}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold">{payment.nom_entreprise || 'Label Startup Engagée'}</h3>
                  <p className="text-sm text-gray-500">
                    {format(new Date(payment.created_at), "dd MMMM yyyy", { locale: fr })}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">
                    ID de paiement: {payment.payment_id}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => downloadInvoice(payment.payment_id)}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Facture
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {payments.length === 0 && (
          <Card>
            <CardContent className="p-6 text-center text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>Aucun paiement trouvé</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Payments;
