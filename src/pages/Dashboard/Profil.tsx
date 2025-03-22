
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, Building, Mail, Phone, BadgeCheck, Shield } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

interface UserProfile {
  prenom: string;
  nom: string | null;
  courriel: string;
  nom_entreprise: string;
  telephone?: string;
}

const Profil = () => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const {
          data: {
            session
          }
        } = await supabase.auth.getSession();
        if (!session) {
          toast.error("Vous devez être connecté pour accéder à cette page");
          return;
        }
        const {
          data,
          error
        } = await supabase.from('label_submissions').select('prenom, courriel, nom_entreprise').eq('user_id', session.user.id).maybeSingle();
        if (error) throw error;
        if (data) {
          // Get user's metadata from auth
          const {
            data: userData,
            error: userError
          } = await supabase.auth.getUser();
          if (userError) throw userError;
          setProfile({
            prenom: data.prenom || '',
            nom: userData.user?.user_metadata?.lastName || null,
            courriel: data.courriel || userData.user?.email || '',
            nom_entreprise: data.nom_entreprise || '',
            telephone: userData.user?.phone || ''
          });
        } else {
          // If no submission exists, just get user auth data
          const {
            data: userData,
            error: userError
          } = await supabase.auth.getUser();
          if (userError) throw userError;
          setProfile({
            prenom: userData.user?.user_metadata?.firstName || '',
            nom: userData.user?.user_metadata?.lastName || null,
            courriel: userData.user?.email || '',
            nom_entreprise: '',
            telephone: userData.user?.phone || ''
          });
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
        toast.error("Une erreur est survenue lors du chargement de votre profil");
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserProfile();
  }, []);

  if (isLoading) {
    return <div className="space-y-6">
        <h1 className="text-3xl font-bold">Mon profil</h1>
        <Card>
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({
            length: 4
          }).map((_, index) => <div key={index} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-60" />
                </div>
              </div>)}
          </CardContent>
        </Card>
      </div>;
  }

  return (
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-[#27017F] to-[#8985FF] text-transparent bg-clip-text">Mon profil</h1>
        <p className="text-gray-500">
          Vos informations personnelles et coordonnées
        </p>
      </div>
      
      <div className="grid gap-8 md:grid-cols-2">
        {/* Informations d'identité */}
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50">
          <div className="h-2 bg-gradient-to-r from-[#35DA56] to-[#27017F]"></div>
          <CardHeader className="bg-white space-y-1">
            <div className="flex items-center space-x-2">
              <BadgeCheck className="h-5 w-5 text-[#35DA56]" />
              <CardTitle className="text-xl text-[#27017F]">Identité</CardTitle>
            </div>
            <p className="text-sm text-gray-500">Vos informations personnelles</p>
          </CardHeader>
          <CardContent className="space-y-6 bg-white pt-2">
            <div className="flex items-start gap-4">
              <div className="bg-[#35DA56]/10 p-2 rounded-full">
                <User className="h-5 w-5 text-[#35DA56]" />
              </div>
              <div className="space-y-4 flex-1">
                <div className="space-y-1 border-b border-gray-100 pb-3">
                  <h3 className="font-medium text-sm text-gray-500">Prénom</h3>
                  <p className="text-[#27017F] font-medium">{profile?.prenom || '-'}</p>
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium text-sm text-gray-500">Nom</h3>
                  <p className="text-[#27017F] font-medium">{profile?.nom || '-'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Informations de contact */}
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50">
          <div className="h-2 bg-gradient-to-r from-[#27017F] to-[#35DA56]"></div>
          <CardHeader className="bg-white space-y-1">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-[#27017F]" />
              <CardTitle className="text-xl text-[#27017F]">Contact</CardTitle>
            </div>
            <p className="text-sm text-gray-500">Vos coordonnées</p>
          </CardHeader>
          <CardContent className="space-y-6 bg-white pt-2">
            <div className="flex items-start gap-4">
              <div className="bg-[#27017F]/10 p-2 rounded-full">
                <Mail className="h-5 w-5 text-[#27017F]" />
              </div>
              <div className="space-y-1 border-b border-gray-100 pb-3 flex-1">
                <h3 className="font-medium text-sm text-gray-500">Adresse email</h3>
                <p className="text-[#27017F] font-medium break-all">{profile?.courriel}</p>
              </div>
            </div>
            
            {profile?.telephone && (
              <div className="flex items-start gap-4">
                <div className="bg-[#27017F]/10 p-2 rounded-full">
                  <Phone className="h-5 w-5 text-[#27017F]" />
                </div>
                <div className="space-y-1 flex-1">
                  <h3 className="font-medium text-sm text-gray-500">Téléphone</h3>
                  <p className="text-[#27017F] font-medium">{profile?.telephone}</p>
                </div>
              </div>
            )}
            
            {profile?.nom_entreprise && (
              <div className="flex items-start gap-4">
                <div className="bg-[#27017F]/10 p-2 rounded-full">
                  <Building className="h-5 w-5 text-[#27017F]" />
                </div>
                <div className="space-y-1 flex-1">
                  <h3 className="font-medium text-sm text-gray-500">Entreprise</h3>
                  <p className="text-[#27017F] font-medium">{profile?.nom_entreprise}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex items-center justify-center mt-8">
        <Button 
          variant="secondary" 
          className="group relative overflow-hidden hover:shadow-lg transition-all duration-300 px-6 py-3 rounded-full"
        >
          <span className="absolute inset-0 w-0 bg-[#35DA56] transition-all duration-[400ms] ease-out group-hover:w-full"></span>
          <span className="relative text-white group-hover:text-white">
            Vous souhaitez modifier ces informations ? Contactez-nous
          </span>
        </Button>
      </div>
    </div>
  );
};

export default Profil;
