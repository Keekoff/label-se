
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, Building, Mail, Phone, BadgeCheck, Shield } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";

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
  const isMobile = useIsMobile();

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
    <div className="space-y-8 animate-fadeIn max-w-4xl mx-auto px-4 pb-12">
      <div className="space-y-2">
        <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-[#27017F] to-[#8985FF] text-transparent bg-clip-text">Mon profil</h1>
        <p className="text-sm md:text-base text-gray-500">
          Vos informations personnelles et coordonnées
        </p>
      </div>
      
      <div className="grid gap-6 md:gap-8 md:grid-cols-2">
        {/* Informations d'identité */}
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50">
          <div className="h-2 bg-gradient-to-r from-[#35DA56] to-[#27017F]"></div>
          <CardHeader className="bg-white space-y-1 p-4 md:p-6">
            <div className="flex items-center space-x-2">
              <BadgeCheck className="h-5 w-5 text-[#35DA56]" />
              <CardTitle className="text-lg md:text-xl text-[#27017F]">Identité</CardTitle>
            </div>
            <p className="text-xs md:text-sm text-gray-500">Vos informations personnelles</p>
          </CardHeader>
          <CardContent className="space-y-4 md:space-y-6 bg-white pt-2 p-4 md:p-6">
            <div className="flex items-start gap-3 md:gap-4">
              <div className="bg-[#35DA56]/10 p-2 rounded-full flex-shrink-0">
                <User className="h-4 w-4 md:h-5 md:w-5 text-[#35DA56]" />
              </div>
              <div className="space-y-3 md:space-y-4 flex-1">
                <div className="space-y-1 border-b border-gray-100 pb-3">
                  <h3 className="font-medium text-xs md:text-sm text-gray-500">Prénom</h3>
                  <p className="text-[#27017F] font-medium text-sm md:text-base">{profile?.prenom || '-'}</p>
                </div>
                <div className="space-y-1">
                  <h3 className="font-medium text-xs md:text-sm text-gray-500">Nom</h3>
                  <p className="text-[#27017F] font-medium text-sm md:text-base">{profile?.nom || '-'}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Informations de contact */}
        <Card className="shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden border-0 bg-gradient-to-br from-white to-gray-50">
          <div className="h-2 bg-gradient-to-r from-[#27017F] to-[#35DA56]"></div>
          <CardHeader className="bg-white space-y-1 p-4 md:p-6">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-[#27017F]" />
              <CardTitle className="text-lg md:text-xl text-[#27017F]">Contact</CardTitle>
            </div>
            <p className="text-xs md:text-sm text-gray-500">Vos coordonnées</p>
          </CardHeader>
          <CardContent className="space-y-4 md:space-y-6 bg-white pt-2 p-4 md:p-6">
            <div className="flex items-start gap-3 md:gap-4">
              <div className="bg-[#27017F]/10 p-2 rounded-full flex-shrink-0">
                <Mail className="h-4 w-4 md:h-5 md:w-5 text-[#27017F]" />
              </div>
              <div className="space-y-1 border-b border-gray-100 pb-3 flex-1">
                <h3 className="font-medium text-xs md:text-sm text-gray-500">Adresse email</h3>
                <p className="text-[#27017F] font-medium break-all text-sm md:text-base">{profile?.courriel}</p>
              </div>
            </div>
            
            {profile?.telephone && (
              <div className="flex items-start gap-3 md:gap-4">
                <div className="bg-[#27017F]/10 p-2 rounded-full flex-shrink-0">
                  <Phone className="h-4 w-4 md:h-5 md:w-5 text-[#27017F]" />
                </div>
                <div className="space-y-1 flex-1">
                  <h3 className="font-medium text-xs md:text-sm text-gray-500">Téléphone</h3>
                  <p className="text-[#27017F] font-medium text-sm md:text-base">{profile?.telephone}</p>
                </div>
              </div>
            )}
            
            {profile?.nom_entreprise && (
              <div className="flex items-start gap-3 md:gap-4">
                <div className="bg-[#27017F]/10 p-2 rounded-full flex-shrink-0">
                  <Building className="h-4 w-4 md:h-5 md:w-5 text-[#27017F]" />
                </div>
                <div className="space-y-1 flex-1">
                  <h3 className="font-medium text-xs md:text-sm text-gray-500">Entreprise</h3>
                  <p className="text-[#27017F] font-medium text-sm md:text-base">{profile?.nom_entreprise}</p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm p-4 shadow-md md:shadow-none md:static md:bg-transparent md:p-0 md:flex md:items-center md:justify-center z-10">
        <Button 
          variant="secondary" 
          className={`group relative overflow-hidden hover:shadow-lg transition-all duration-300 px-4 md:px-6 py-2 md:py-3 rounded-full w-full md:w-auto ${isMobile ? 'text-sm' : ''}`}
        >
          <span className="absolute inset-0 w-0 bg-[#35DA56] transition-all duration-[400ms] ease-out group-hover:w-full"></span>
          <span className="relative text-white group-hover:text-white">
            {isMobile ? 'Modifier ces informations ?' : 'Vous souhaitez modifier ces informations ? Contactez-nous'}
          </span>
        </Button>
      </div>
    </div>
  );
};

export default Profil;
