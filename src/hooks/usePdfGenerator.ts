
import { useRef, useState } from 'react';
import { generateChartsPDF, ChartData } from "@/utils/pdf-generator";

export const usePdfGenerator = () => {
  const [isPdfGenerating, setIsPdfGenerating] = useState<boolean>(false);
  const chartsContainerRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async (chartData: ChartData) => {
    if (!chartData.companyName) return;
    
    setIsPdfGenerating(true);
    
    try {
      // Assurons-nous que nous passons toutes les données nécessaires au générateur PDF
      const completeChartData = {
        ...chartData,
        // Si d'autres propriétés spécifiques sont nécessaires, les ajouter ici
      };
      
      await generateChartsPDF(chartsContainerRef, completeChartData);
    } finally {
      setIsPdfGenerating(false);
    }
  };

  return {
    isPdfGenerating,
    handleDownloadPDF,
    chartsContainerRef
  };
};
