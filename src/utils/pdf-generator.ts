
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { toast } from "@/hooks/use-toast";

export type ChartData = {
  companyName: string;
  echelonTexte?: string;
  dateValidation?: string;
  dateFinValidite?: string;
};

const formatDate = (dateString: string | undefined) => {
  if (!dateString) return "Non définie";
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch (e) {
    console.error('Erreur de formatage de date:', e);
    return dateString;
  }
};

export const generateChartsPDF = async (
  chartsContainerRef: React.RefObject<HTMLDivElement>,
  chartData: ChartData
) => {
  if (!chartsContainerRef.current) return false;
  
  try {
    toast({
      title: "Génération du PDF en cours",
      description: "Veuillez patienter pendant la création de votre rapport...",
    });

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Ajouter l'en-tête
    pdf.setFontSize(16);
    pdf.setTextColor(39, 1, 127); // #27017F
    pdf.text("Rapport de Performance - Label Startup Engagée", pdfWidth / 2, 15, { align: 'center' });
    
    // Ajouter les informations de l'entreprise
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Entreprise: ${chartData.companyName}`, 20, 25);
    pdf.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 20, 32);

    if (chartData.echelonTexte) {
      pdf.text(`Niveau: ${chartData.echelonTexte}`, 20, 39);
      pdf.text(`Validité: ${formatDate(chartData.dateValidation)} - ${formatDate(chartData.dateFinValidite)}`, 20, 46);
    }
    
    // Capturer et ajouter les graphiques
    const charts = chartsContainerRef.current.querySelectorAll('.chart-card');
    const chartPromises = Array.from(charts).map(async (chart, index) => {
      const canvas = await html2canvas(chart as HTMLElement, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      const isEvenIndex = index % 2 === 0;
      const row = Math.floor(index / 2);
      
      const imgWidth = 80;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      const xPos = isEvenIndex ? 15 : pdfWidth - imgWidth - 15;
      const yPos = 55 + (row * (imgHeight + 10));
      
      if (yPos + imgHeight > pdfHeight && index < charts.length - 1) {
        pdf.addPage();
        return { imgData, xPos, yPos: 20, imgWidth, imgHeight };
      }
      
      return { imgData, xPos, yPos, imgWidth, imgHeight };
    });
    
    const chartPositions = await Promise.all(chartPromises);
    
    chartPositions.forEach((chart, index) => {
      if (index === 4) {
        pdf.addPage();
        chart.yPos = 20;
      }
      
      pdf.addImage(chart.imgData, 'PNG', chart.xPos, chart.yPos, chart.imgWidth, chart.imgHeight);
    });
    
    // Générer le nom du fichier et le sauvegarder
    const fileName = `rapport_${chartData.companyName.replace(/\s+/g, '_')}_${new Date().toISOString().slice(0, 10)}.pdf`;
    pdf.save(fileName);
    
    toast({
      title: "PDF généré avec succès",
      description: "Votre rapport a été téléchargé.",
    });
    
    return true;
  } catch (error) {
    console.error('Erreur lors de la génération du PDF:', error);
    toast({
      title: "Erreur",
      description: "Impossible de générer le PDF. Veuillez réessayer.",
      variant: "destructive"
    });
    return false;
  }
};
