
import { Button } from "@/components/ui/button";
import { Download, Lock } from "lucide-react";
import { useCompanyData } from "@/hooks/useCompanyData";
import { usePdfGenerator } from "@/hooks/usePdfGenerator";
import { BarChartsGrid } from "./BarChartsGrid";
import { RadarChartCard } from "./RadarChartCard";
import { ImprovementSuggestions } from "./ImprovementSuggestions";

export const DashboardCharts = () => {
  const { 
    isLoading, 
    companyData, 
    companyName, 
    isPremium
  } = useCompanyData();
  
  const { 
    isPdfGenerating, 
    handleDownloadPDF, 
    chartsContainerRef 
  } = usePdfGenerator();

  const getEchelonTextValue = (echelonTexte?: string | string[]): string => {
    if (!echelonTexte) return "";
    
    if (Array.isArray(echelonTexte)) {
      return echelonTexte[0] || "";
    }
    
    return echelonTexte;
  };

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-6 transition-all duration-200 h-[400px] flex items-center justify-center bg-white border rounded-lg shadow-sm">
            <div className="text-gray-500">Chargement des données...</div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-end mb-4">
        <Button 
          variant="outline" 
          onClick={() => handleDownloadPDF({
            companyName,
            echelonTexte: getEchelonTextValue(companyData?.echelonTexte),
            dateValidation: companyData?.dateValidation,
            dateFinValidite: companyData?.dateFinValidite
          })}
          disabled={isLoading || isPdfGenerating || !isPremium}
          className="bg-white hover:bg-[#27017F] hover:text-white border-[#35DA56] text-[#27017F]"
        >
          <Download className="h-4 w-4 mr-2" />
          Télécharger mes données
        </Button>
      </div>

      <div ref={chartsContainerRef} className="space-y-6">
        {isPremium ? (
          <>
            <BarChartsGrid companyData={companyData} />
            <RadarChartCard />
            <ImprovementSuggestions />
          </>
        ) : (
          <>
            <div className="relative">
              <div className="filter blur-[6px] pointer-events-none opacity-70">
                <BarChartsGrid companyData={null} />
              </div>
              <div className="absolute inset-0 flex items-center justify-center flex-col gap-3 bg-black/5 rounded-lg">
                <Lock className="h-10 w-10 text-[#35DA56]" />
                <div className="text-xl font-semibold text-[#27017F]">Fonctionnalité Premium</div>
                <p className="text-center text-gray-600 max-w-md px-4">
                  Veuillez effectuer votre paiement pour accéder à toutes les fonctionnalités analytiques.
                </p>
              </div>
            </div>
            
            <div className="relative">
              <div className="filter blur-[6px] pointer-events-none opacity-70">
                <RadarChartCard />
              </div>
              <div className="absolute inset-0 flex items-center justify-center flex-col gap-3 bg-black/5 rounded-lg">
                <Lock className="h-10 w-10 text-[#35DA56]" />
                <div className="text-xl font-semibold text-[#27017F]">Fonctionnalité Premium</div>
              </div>
            </div>
            
            <div className="relative">
              <div className="filter blur-[6px] pointer-events-none opacity-70">
                <ImprovementSuggestions />
              </div>
              <div className="absolute inset-0 flex items-center justify-center flex-col gap-3 bg-black/5 rounded-lg">
                <Lock className="h-10 w-10 text-[#35DA56]" />
                <div className="text-xl font-semibold text-[#27017F]">Fonctionnalité Premium</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
