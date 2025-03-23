
import { Award } from "lucide-react";
import { CompanyData } from "@/hooks/useCompanyData";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

interface CertificationCardProps {
  companyData: CompanyData | null;
  isPremium?: boolean;
}

export const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "Non définie";
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch (e) {
    console.error('Erreur de formatage de date:', e);
    return dateString;
  }
};

export const CertificationCard = ({ companyData, isPremium = false }: CertificationCardProps) => {
  console.log('Données de certification:', companyData);
  const [isValidated, setIsValidated] = useState(false);

  useEffect(() => {
    const checkValidationStatus = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session?.user) return;

        const { data, error } = await supabase
          .from('label_submissions')
          .select('valide')
          .eq('user_id', session.user.id)
          .maybeSingle();
        
        if (error) throw error;
        setIsValidated(data?.valide === true);
      } catch (error) {
        console.error('Erreur lors de la vérification de la validation:', error);
      }
    };

    checkValidationStatus();
  }, []);
  
  return (
    <div className="bg-white/80 backdrop-blur-md border-2 border-[#35DA56] rounded-lg p-4 shadow-md animate-fadeIn transition-all duration-300 hover:shadow-lg">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-2 w-full md:w-auto">
          <div className="flex items-center gap-2">
            <Award className="text-[#35DA56] h-5 w-5 flex-shrink-0" />
            <h3 className="font-semibold text-gray-800 text-sm sm:text-base">Certification : Label Startup Engagée</h3>
          </div>
          <p className="text-gray-600 text-sm sm:text-base">Niveau : {companyData?.echelonTexte || "Non défini"}</p>
          <div className={`${!isPremium ? 'filter blur-[3px] pointer-events-none' : ''}`}>
            <p className="text-gray-600 text-sm sm:text-base">
              Début de validité : {isValidated ? formatDate(companyData?.dateValidation) : "En attente de validation"}
            </p>
            <p className="text-gray-600 text-sm sm:text-base">
              Fin de validité : {isValidated ? formatDate(companyData?.dateFinValidite) : "En attente de validation"}
            </p>
          </div>
          {!isPremium && (
            <p className="text-xs text-[#27017F] font-medium mt-1">Dates disponibles après paiement et envoi des pièces justificatives</p>
          )}
        </div>
        <div className="h-20 sm:h-24 w-32 sm:w-40 bg-gray-100/80 backdrop-blur-sm rounded flex items-center justify-center overflow-hidden shadow-inner flex-shrink-0">
          {companyData?.logoUrl ? (
            <img 
              src={companyData.logoUrl} 
              alt="Logo du label" 
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <p className="text-gray-500 text-xs sm:text-sm text-center">Image du label<br/>(à venir)</p>
          )}
        </div>
      </div>
    </div>
  );
};
