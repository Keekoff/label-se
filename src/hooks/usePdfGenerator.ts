
import { useRef, useState } from 'react';
import { generateChartsPDF, ChartData } from "@/utils/pdf-generator";

export const usePdfGenerator = () => {
  const [isPdfGenerating, setIsPdfGenerating] = useState<boolean>(false);
  const chartsContainerRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async (chartData: ChartData) => {
    if (!chartData.companyName) return;
    
    setIsPdfGenerating(true);
    
    try {
      await generateChartsPDF(chartsContainerRef, chartData);
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
