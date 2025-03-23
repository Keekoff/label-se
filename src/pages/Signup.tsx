
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Mail, Lock, UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Checkbox } from "@/components/ui/checkbox";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== passwordConfirm) {
      toast.error("Les mots de passe ne correspondent pas.");
      return;
    }
    
    if (!acceptTerms) {
      toast.error("Vous devez accepter les conditions d'utilisation.");
      return;
    }
    
    setLoading(true);
    try {
      const {
        error
      } = await supabase.auth.signUp({
        email,
        password
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Inscription réussie ! Veuillez vérifier votre email.");
        navigate("/login");
      }
    } catch (error) {
      toast.error("Une erreur est survenue lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-white to-gray-50/80 px-4">
      <Button 
        variant="ghost" 
        onClick={() => navigate("/")} 
        className="absolute top-4 left-4 flex items-center gap-1 text-[#27017F] hover:text-[#27017F]/80"
      >
        <ArrowLeft size={16} />
        Retour à l'accueil
      </Button>
      
      <div className="w-full max-w-md space-y-6 animate-fadeIn">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold text-[#27017F] mb-2">Startup Engagée</h1>
          <p className="text-gray-600">Rejoignez la communauté des startups responsables</p>
        </div>
        
        <Card className="border-none shadow-lg overflow-hidden">
          <div className="h-2 bg-[#35DA56] w-full"></div>
          <CardHeader className="space-y-1 pt-6">
            <CardTitle className="text-2xl font-bold text-center text-gray-800">
              Créer un compte
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
              
              <div className="flex items-center space-x-2 mt-4">
                <Checkbox 
                  id="terms" 
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                  className="data-[state=checked]:bg-[#35DA56] data-[state=checked]:border-[#35DA56]"
                />
                <label
                  htmlFor="terms"
                  className="text-sm text-gray-700 leading-tight"
                >
                  J'accepte les{" "}
                  <a href="#" className="text-[#27017F] hover:underline">
                    conditions d'utilisation
                  </a>{" "}
                  et la{" "}
                  <a href="#" className="text-[#27017F] hover:underline">
                    politique de confidentialité
                  </a>
                </label>
              </div>
              
              <Button 
                type="submit" 
                disabled={loading} 
                className="w-full bg-[#35DA56] hover:bg-[#35DA56]/90 text-white font-medium mt-4 py-5"
              >
                {loading ? "Création en cours..." : "Créer un compte"}
              </Button>
              
              <p className="text-center text-sm text-gray-500 pt-2">
                Déjà inscrit ?{" "}
                <Button 
                  type="button" 
                  variant="link" 
                  onClick={() => navigate("/login")} 
                  className="text-[#27017F] hover:text-[#27017F]/80 p-0"
                >
                  Se connecter
                </Button>
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Signup;
