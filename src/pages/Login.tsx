
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail, Lock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const {
        error
      } = await supabase.auth.signInWithPassword({
        email,
        password
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Connexion réussie !");
        navigate("/dashboard");
      }
    } catch (error) {
      toast.error("Une erreur est survenue lors de la connexion.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-white to-gray-50/80 px-4">
      <div className="w-full pt-4 pb-2">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")} 
          className="flex items-center gap-1 text-[#27017F] hover:text-[#27017F]/80"
        >
          <ArrowLeft size={16} />
          Retour à l'accueil
        </Button>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-md space-y-6 animate-fadeIn">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-[#27017F] mb-2">Startup Engagée</h1>
          <p className="text-gray-600">Connectez-vous à votre compte</p>
        </div>
        
        <Card className="border-none shadow-lg overflow-hidden">
          <div className="h-2 bg-[#35DA56] w-full"></div>
          <CardHeader className="space-y-1 pt-6">
            <CardTitle className="text-2xl font-bold text-center text-gray-800">
              Connexion
            </CardTitle>
          </CardHeader>
          
          <CardContent className="pt-4 pb-6">
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
              
              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-gray-700 flex items-center gap-2">
                  <Lock size={16} className="text-[#27017F]" />
                  Mot de passe
                </label>
                <Input 
                  id="password" 
                  type="password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                  className="w-full border-gray-300 focus:border-[#35DA56] focus:ring-[#35DA56]" 
                />
              </div>
              
              <div className="flex items-center justify-between pt-1">
                <Button 
                  type="button" 
                  variant="link" 
                  onClick={() => navigate("/signup")} 
                  className="text-sm text-[#35DA56] hover:text-[#35DA56]/90 px-0"
                >
                  Créer un compte
                </Button>
                
                <Button 
                  type="button" 
                  variant="link" 
                  onClick={() => navigate("/forgot-password")}
                  className="text-sm text-[#27017F] hover:text-[#27017F]/80 px-0"
                >
                  Mot de passe oublié ?
                </Button>
              </div>
              
              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-[#35DA56] hover:bg-[#35DA56]/90 text-white font-medium mt-4 py-5"
              >
                {loading ? "Connexion..." : "Se connecter"}
              </Button>
            </form>
          </CardContent>
        </Card>
        
        <p className="text-center text-sm text-gray-500 mt-6">
          En vous connectant, vous acceptez nos{" "}
          <a href="/terms" target="_blank" className="text-[#27017F] hover:text-[#27017F]/80">
            Conditions d'utilisation
          </a>{" "}
          et notre{" "}
          <a href="/privacy" target="_blank" className="text-[#27017F] hover:text-[#27017F]/80">
            Politique de confidentialité
          </a>
        </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
