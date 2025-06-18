
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface Payment {
  id: string;
  created_at: string;
  payment_date: string | null;
  payment_id: string;
  nom_entreprise: string;
  payment_status: string;
  user_id: string;
}

const Payments = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState<string | null>(null);
  const [errorDetails, setErrorDetails] = useState<string | null>(null);
  const [showErrorDialog, setShowErrorDialog] = useState(false);
  const [debugInfo, setDebugInfo] = useState<string>("");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast.error("Vous devez être connecté pour accéder à cette page");
          return;
        }

        console.log("User ID utilisé pour la requête:", session.user.id);
        setDebugInfo(`User ID: ${session.user.id}`);

        // Récupérer tous les paiements de l'utilisateur avec plus de détails
        const { data, error } = await supabase
          .from('label_submissions')
          .select('id, created_at, payment_date, payment_id, nom_entreprise, payment_status, user_id')
          .eq('user_id', session.user.id)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Erreur de récupération des paiements:', error);
          setDebugInfo(prev => prev + `\nErreur SQL: ${error.message}`);
          throw error;
        }

        console.log('Toutes les soumissions de cet utilisateur:', data);
        setDebugInfo(prev => prev + `\nNombre total de soumissions: ${data?.length || 0}`);

        if (data) {
          // Filtrer pour n'afficher que celles avec un payment_id ou un statut de paiement
          const paymentsData = data.filter(item => 
            item.payment_id || 
            item.payment_status === 'paid' || 
            item.payment_status === 'pending'
          );
          
          console.log('Paiements filtrés:', paymentsData);
          setDebugInfo(prev => prev + `\nNombre de paiements: ${paymentsData.length}`);
          
          setPayments(paymentsData as Payment[]);
        } else {
          console.log('Aucune donnée retournée');
          setPayments([]);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des paiements:', error);
        setDebugInfo(prev => prev + `\nErreur: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
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
      
      console.log('Téléchargement de la facture pour l\'ID de paiement:', paymentId);
      
      const response = await supabase.functions.invoke('generate-invoice', {
        body: { paymentId }
      });
      
      if (response.error) {
        console.error('Erreur de fonction Edge:', response.error);
        throw new Error(response.error.message || "Erreur lors de la génération de la facture");
      }
      
      if (!response.data) {
        throw new Error("Aucune donnée reçue du serveur");
      }
      
      const blob = new Blob([response.data], { type: 'application/pdf' });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `facture_${paymentId.substring(0, 8)}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success("Facture téléchargée avec succès", {
        style: { backgroundColor: '#35DA56', color: 'white' }
      });
    } catch (error) {
      console.error('Erreur lors du téléchargement de la facture:', error);
      setErrorDetails(error instanceof Error ? error.message : "Erreur inconnue");
      setShowErrorDialog(true);
      toast.error("Une erreur est survenue lors du téléchargement de la facture");
    } finally {
      setIsDownloading(null);
    }
  };

  const getPaymentDate = (payment: Payment) => {
    // Utiliser payment_date si disponible, sinon created_at
    const dateToUse = payment.payment_date || payment.created_at;
    return format(new Date(dateToUse), "dd/MM/yyyy à HH:mm", { locale: fr });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'paid':
        return 'bg-[#35DA56]/20 text-[#35DA56]';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'paid':
        return 'Payé';
      case 'pending':
        return 'En attente';
      case 'unpaid':
        return 'Non payé';
      default:
        return status || 'Inconnu';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[200px]">
        <p>Chargement des paiements...</p>
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

      {/* Debug info pour le développement */}
      {process.env.NODE_ENV === 'development' && (
        <Card className="bg-blue-50 border-blue-200">
          <CardContent className="p-4">
            <p className="text-sm font-medium text-blue-800">Informations de débogage :</p>
            <pre className="text-xs text-blue-600 mt-2 whitespace-pre-wrap">{debugInfo}</pre>
          </CardContent>
        </Card>
      )}

      {payments.length > 0 ? (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Entreprise</TableHead>
                  <TableHead>Référence</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((payment) => (
                  <TableRow key={payment.id}>
                    <TableCell className="font-medium">
                      {getPaymentDate(payment)}
                    </TableCell>
                    <TableCell>
                      {payment.nom_entreprise || 'Entreprise non spécifiée'}
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">
                      {payment.payment_id ? (
                        payment.payment_id.length > 20 
                          ? `${payment.payment_id.substring(0, 20)}...` 
                          : payment.payment_id
                      ) : (
                        'N/A'
                      )}
                    </TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(payment.payment_status)}`}>
                        {getStatusText(payment.payment_status)}
                      </span>
                    </TableCell>
                    <TableCell className="font-medium">
                      800,00 €
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => downloadInvoice(payment.payment_id)}
                        disabled={isDownloading === payment.payment_id || payment.payment_status !== 'paid'}
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
            <p className="text-lg font-medium mb-2">Aucun paiement trouvé</p>
            <p className="text-sm">
              Vous n'avez encore effectué aucun paiement ou vos paiements ne sont pas encore traités.
            </p>
          </CardContent>
        </Card>
      )}

      <Dialog open={showErrorDialog} onOpenChange={setShowErrorDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Erreur de téléchargement</DialogTitle>
            <DialogDescription>
              Une erreur est survenue lors du téléchargement de la facture. Détails techniques:
            </DialogDescription>
          </DialogHeader>
          <div className="bg-gray-100 p-4 rounded-md text-sm">
            <code>{errorDetails}</code>
          </div>
          <p className="text-sm text-gray-500">
            Veuillez contacter le support si ce problème persiste.
          </p>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Payments;
