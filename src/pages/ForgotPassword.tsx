
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail, HelpCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) {
        toast.error(error.message);
      } else {
        setEmailSent(true);
        toast.success("Un email de réinitialisation a été envoyé à votre adresse.");
      }
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'envoi du mail de réinitialisation.");
    } finally {
      setLoading(false);
    }
  };

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
              Mot de passe oublié
            </CardTitle>
          </CardHeader>
          
          <CardContent className="pt-4 pb-6">
            {!emailSent ? (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label htmlFor="email" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                    <Mail size={16} className="text-[#27017F]" />
                    Adresse e-mail
                  </label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="exemple@email.com" 
                    value={email} 
                    onChange={e => setEmail(e.target.value)} 
                    required 
                    className="w-full border-gray-300 focus:border-[#35DA56] focus:ring-[#35DA56]" 
                  />
                </div>
                
                <div className="flex items-center justify-center pt-1">
                  <Button 
                    type="button" 
                    variant="link" 
                    onClick={() => navigate("/login")} 
                    className="text-sm text-[#27017F] hover:text-[#27017F]/80 px-0"
                  >
                    Retour à la connexion
                  </Button>
                </div>
                
                <Button 
                  type="submit" 
                  disabled={loading} 
                  className="w-full bg-[#35DA56] hover:bg-[#35DA56]/90 text-white font-medium mt-4 py-5"
                >
                  {loading ? "Envoi en cours..." : "Réinitialiser mon mot de passe"}
                </Button>
              </form>
            ) : (
              <div className="space-y-5 text-center">
                <div className="flex justify-center">
                  <div className="bg-[#35DA56]/10 p-3 rounded-full">
                    <Mail size={28} className="text-[#35DA56]" />
                  </div>
                </div>
                <p className="text-gray-700">
                  Un email a été envoyé à <strong>{email}</strong> avec les instructions pour réinitialiser votre mot de passe.
                </p>
                <p className="text-sm text-gray-500">
                  Si vous ne recevez pas l'email dans les prochaines minutes, vérifiez votre dossier de spam.
                </p>
                <Button 
                  onClick={() => navigate("/login")} 
                  className="mt-4 bg-[#35DA56] hover:bg-[#35DA56]/90 text-white font-medium py-5"
                >
                  Retour à la connexion
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
