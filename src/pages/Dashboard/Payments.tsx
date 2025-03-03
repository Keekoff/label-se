
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  const [isDownloading, setIsDownloading] = useState<string | null>(null);

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
    try {
      setIsDownloading(paymentId);
      
      console.log('Downloading invoice for payment ID:', paymentId);
      
      // Appeler la fonction Edge pour générer la facture
      const response = await supabase.functions.invoke('generate-invoice', {
        body: { paymentId }
      });
      
      if (response.error) {
        console.error('Edge function error:', response.error);
        throw new Error(response.error.message || "Erreur lors de la génération de la facture");
      }
      
      // Vérifier que la réponse contient des données
      if (!response.data) {
        throw new Error("Aucune donnée reçue du serveur");
      }
      
      // Créer un blob à partir des données de la réponse
      const blob = new Blob([response.data], { type: 'application/pdf' });
      
      // Créer une URL pour le blob
      const url = window.URL.createObjectURL(blob);
      
      // Créer un élément a temporaire pour déclencher le téléchargement
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `facture_${paymentId}.pdf`);
      document.body.appendChild(link);
      link.click();
      
      // Nettoyer
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("Facture téléchargée avec succès", {
        style: { backgroundColor: '#35DA56', color: 'white' }
      });
    } catch (error) {
      console.error('Error downloading invoice:', error);
      toast.error("Une erreur est survenue lors du téléchargement de la facture");
    } finally {
      setIsDownloading(null);
    }
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

      {payments.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Entreprise</TableHead>
                  <TableHead>Référence</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell>
                      {format(new Date(payment.created_at), "dd/MM/yyyy", { locale: fr })}
                    </TableCell>
                    <TableCell className="font-medium">
                      {payment.nom_entreprise || 'Label Startup Engagée'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {payment.payment_id}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => downloadInvoice(payment.payment_id)}
                        disabled={isDownloading === payment.payment_id}
                        aria-label="Télécharger la facture"
                        className="hover:bg-[#27017F] hover:text-white"
                      >
                        {isDownloading === payment.payment_id ? (
                          <span className="animate-pulse">Téléchargement...</span>
                        ) : (
                          <>
                            <Download className="w-4 h-4 mr-2" />
                            Facture
                          </>
                        )}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6 text-center text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <p>Aucun paiement trouvé</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Payments;
