
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { useCompanyData } from "@/hooks/useCompanyData";
import { usePdfGenerator } from "@/hooks/usePdfGenerator";
import { CertificationCard } from "./CertificationCard";
import { ErrorDisplay } from "./ErrorDisplay";
import { BarChartsGrid } from "./BarChartsGrid";
import { RadarChartCard } from "./RadarChartCard";

export const DashboardCharts = () => {
  const { 
    isLoading, 
    companyData, 
    companyName, 
    error, 
    errorDetails, 
    hasSubmittedForm 
  } = useCompanyData();
  
  const { 
    isPdfGenerating, 
    handleDownloadPDF, 
    chartsContainerRef 
  } = usePdfGenerator();

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

  if (error) {
    return <ErrorDisplay error={error} errorDetails={errorDetails} companyName={companyName} />;
  }

  return (
    <div className="space-y-6">
      {hasSubmittedForm && <CertificationCard companyData={companyData} />}

      <div className="flex justify-end mb-4">
        <Button 
          variant="outline" 
          onClick={() => handleDownloadPDF({
            companyName,
            echelonTexte: companyData?.echelonTexte,
            dateValidation: companyData?.dateValidation,
            dateFinValidite: companyData?.dateFinValidite
          })}
          disabled={isLoading || isPdfGenerating}
          className="bg-white hover:bg-[#27017F] hover:text-white border-[#35DA56] text-[#27017F]"
        >
          <Download className="h-4 w-4 mr-2" />
          Télécharger mes données
        </Button>
      </div>

      <div ref={chartsContainerRef} className="space-y-6">
        <BarChartsGrid companyData={companyData} />
        <RadarChartCard />
      </div>
    </div>
  );
};
