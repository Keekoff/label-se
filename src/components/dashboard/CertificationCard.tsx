
import { Award } from "lucide-react";
import { CompanyData } from "@/hooks/useCompanyData";

interface CertificationCardProps {
  companyData: CompanyData | null;
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

export const CertificationCard = ({ companyData }: CertificationCardProps) => {
  return (
    <div className="bg-white border-2 border-[#35DA56] rounded-lg p-4 shadow-sm animate-fadeIn">
      <div className="flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Award className="text-[#35DA56] h-5 w-5" />
            <h3 className="font-semibold text-gray-800">Certification : Label Startup Engagée</h3>
          </div>
          <p className="text-gray-600">Niveau : {companyData?.echelonTexte || "Non défini"}</p>
          <p className="text-gray-600">Début de validité : {formatDate(companyData?.dateValidation)}</p>
          <p className="text-gray-600">Fin de validité : {formatDate(companyData?.dateFinValidite)}</p>
        </div>
        <div className="h-24 w-40 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
          {companyData?.logoUrl ? (
            <img 
              src={companyData.logoUrl} 
              alt="Logo du label" 
              className="max-h-full max-w-full object-contain"
            />
          ) : (
            <p className="text-gray-500 text-sm text-center">Image du label<br/>(à venir)</p>
          )}
        </div>
      </div>
    </div>
  );
};
