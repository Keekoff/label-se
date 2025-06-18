
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [resetComplete, setResetComplete] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const handlePasswordReset = async () => {
      try {
        // Extraire les paramètres de fragment de l'URL
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const tokenType = hashParams.get('token_type');
        const type = hashParams.get('type');

        console.log('URL params:', { accessToken: !!accessToken, refreshToken: !!refreshToken, type });

        // Si nous avons des tokens de récupération dans l'URL
        if (accessToken && refreshToken && type === 'recovery') {
          console.log('Setting session with recovery tokens');
          
          const { data, error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (error) {
            console.error('Erreur lors de l\'établissement de la session:', error);
            toast.error("Lien de réinitialisation invalide ou expiré. Veuillez recommencer.");
            navigate("/forgot-password");
            return;
          }

          if (data.session) {
            console.log('Session établie avec succès');
            toast.success("Session de récupération établie. Vous pouvez maintenant réinitialiser votre mot de passe.");
          }
        } else {
          // Vérifier si l'utilisateur a déjà une session active
          const { data } = await supabase.auth.getSession();
          if (!data.session) {
            console.log('Aucune session trouvée et aucun token de récupération');
            toast.error("Lien de réinitialisation invalide ou expiré. Veuillez recommencer.");
            navigate("/forgot-password");
            return;
          }
        }
      } catch (error) {
        console.error('Erreur lors de la gestion de la récupération:', error);
        toast.error("Une erreur est survenue. Veuillez recommencer.");
        navigate("/forgot-password");
      } finally {
        setSessionLoading(false);
      }
    };

    handlePasswordReset();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password.length < 6) {
      toast.error("Le mot de passe doit contenir au moins 6 caractères");
      return;
    }
    
    if (password !== passwordConfirm) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }
    
    setLoading(true);
    try {
      console.log('Tentative de mise à jour du mot de passe');
      const { error } = await supabase.auth.updateUser({ password });
      
      if (error) {
        console.error('Erreur lors de la mise à jour du mot de passe:', error);
        toast.error(error.message);
      } else {
        console.log('Mot de passe mis à jour avec succès');
        setResetComplete(true);
        toast.success("Votre mot de passe a été réinitialisé avec succès.");
        
        // Nettoyer l'URL pour supprimer les paramètres de récupération
        window.history.replaceState({}, document.title, "/reset-password");
      }
    } catch (error) {
      console.error('Erreur lors de la réinitialisation:', error);
      toast.error("Une erreur est survenue lors de la réinitialisation du mot de passe.");
    } finally {
      setLoading(false);
    }
  };

  // Afficher un état de chargement pendant la vérification de la session
  if (sessionLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50/80 px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#35DA56] mx-auto mb-4"></div>
          <p className="text-gray-600">Vérification du lien de récupération...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50/80 px-4">
      <Button 
        variant="ghost" 
        onClick={() => navigate("/login")} 
        className="absolute top-4 left-4 flex items-center gap-1 text-[#27017F] hover:text-[#27017F]/80"
      >
        <ArrowLeft size={16} />
        Retour à la connexion
      </Button>
      
      <div className="w-full max-w-md space-y-6 animate-fadeIn">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-[#27017F] mb-2">Startup Engagée</h1>
          <p className="text-gray-600">Réinitialisation de mot de passe</p>
        </div>
        
        <Card className="border-none shadow-lg overflow-hidden">
          <div className="h-2 bg-[#35DA56] w-full"></div>
          <CardHeader className="space-y-1 pt-6">
            <CardTitle className="text-2xl font-bold text-center text-gray-800">
              Nouveau mot de passe
            </CardTitle>
          </CardHeader>
          
          <CardContent className="pt-4 pb-6">
            {!resetComplete ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Lock size={16} className="text-[#27017F]" />
                    Nouveau mot de passe
                  </label>
                  <Input 
                    id="password" 
                    type="password" 
                    value={password} 
                    onChange={e => setPassword(e.target.value)} 
                    required
                    minLength={6}
                    className="w-full border-gray-300 focus:border-[#35DA56] focus:ring-[#35DA56]" 
                  />
                  <p className="text-xs text-gray-500">Minimum 6 caractères</p>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="passwordConfirm" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Lock size={16} className="text-[#27017F]" />
                    Confirmer le mot de passe
                  </label>
                  <Input 
                    id="passwordConfirm" 
                    type="password" 
                    value={passwordConfirm} 
                    onChange={e => setPasswordConfirm(e.target.value)} 
                    required
                    minLength={6}
                    className="w-full border-gray-300 focus:border-[#35DA56] focus:ring-[#35DA56]" 
                  />
                </div>
                
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full bg-[#35DA56] hover:bg-[#35DA56]/90 text-white font-medium mt-4 py-5"
                >
                  {loading ? "Réinitialisation en cours..." : "Réinitialiser mon mot de passe"}
                </Button>
              </form>
            ) : (
              <div className="space-y-5 text-center">
                <div className="flex justify-center">
                  <div className="bg-[#35DA56]/10 p-3 rounded-full">
                    <Lock size={28} className="text-[#35DA56]" />
                  </div>
                </div>
                <p className="text-gray-700">
                  Votre mot de passe a été réinitialisé avec succès.
                </p>
                <Button 
                  onClick={() => navigate("/login")} 
                  className="mt-4 bg-[#35DA56] hover:bg-[#35DA56]/90 text-white font-medium py-5"
                >
                  Se connecter
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResetPassword;
