
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { User, Building, Mail, Phone } from "lucide-react";
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
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          toast.error("Vous devez être connecté pour accéder à cette page");
          return;
        }

        const { data, error } = await supabase
          .from('label_submissions')
          .select('prenom, courriel, nom_entreprise')
          .eq('user_id', session.user.id)
          .maybeSingle();

        if (error) throw error;

        if (data) {
          // Get user's metadata from auth
          const { data: userData, error: userError } = await supabase.auth.getUser();
          
          if (userError) throw userError;

          setProfile({
            prenom: data.prenom || '',
            nom: userData.user?.user_metadata?.lastName || null,
            courriel: data.courriel || userData.user?.email || '',
            nom_entreprise: data.nom_entreprise || '',
            telephone: userData.user?.phone || '',
          });
        } else {
          // If no submission exists, just get user auth data
          const { data: userData, error: userError } = await supabase.auth.getUser();
          
          if (userError) throw userError;

          setProfile({
            prenom: userData.user?.user_metadata?.firstName || '',
            nom: userData.user?.user_metadata?.lastName || null,
            courriel: userData.user?.email || '',
            nom_entreprise: '',
            telephone: userData.user?.phone || '',
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
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Mon profil</h1>
        <Card>
          <CardHeader>
            <CardTitle>Informations personnelles</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-4 w-60" />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fadeIn">
      <h1 className="text-3xl font-bold">Mon profil</h1>
      <p className="text-gray-500">
        Vos informations personnelles
      </p>
      
      <Card className="shadow-md">
        <CardHeader>
          <CardTitle>Informations personnelles</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-start gap-4">
            <User className="h-6 w-6 text-gray-500 mt-1" />
            <div className="space-y-3">
              <div>
                <h3 className="font-medium text-lg">Prénom</h3>
                <p className="text-gray-600">{profile?.prenom}</p>
              </div>
              <div>
                <h3 className="font-medium text-lg">Nom</h3>
                <p className="text-gray-600">{profile?.nom || '-'}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-start gap-4">
            <Mail className="h-6 w-6 text-gray-500 mt-1" />
            <div>
              <h3 className="font-medium text-lg">Adresse email</h3>
              <p className="text-gray-600">{profile?.courriel}</p>
            </div>
          </div>
          
          {profile?.telephone && (
            <div className="flex items-start gap-4">
              <Phone className="h-6 w-6 text-gray-500 mt-1" />
              <div>
                <h3 className="font-medium text-lg">Téléphone</h3>
                <p className="text-gray-600">{profile?.telephone}</p>
              </div>
            </div>
          )}
          
          {profile?.nom_entreprise && (
            <div className="flex items-start gap-4">
              <Building className="h-6 w-6 text-gray-500 mt-1" />
              <div>
                <h3 className="font-medium text-lg">Entreprise</h3>
                <p className="text-gray-600">{profile?.nom_entreprise}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="text-center">
        <Button variant="secondary" className="mt-4">
          Vous souhaitez modifier ces informations ? Contactez-nous
        </Button>
      </div>
    </div>
  );
};

export default Profil;
