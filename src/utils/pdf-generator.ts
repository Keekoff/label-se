
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
    
    // Identifier et capturer le graphique radar en premier pour l'afficher en pleine largeur
    const radarChart = chartsContainerRef.current.querySelector('.md\\:col-span-2.chart-card');
    if (radarChart) {
      const radarCanvas = await html2canvas(radarChart as HTMLElement, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
      });
      
      const radarImgData = radarCanvas.toDataURL('image/png');
      const radarImgWidth = 170; // Utiliser presque toute la largeur de la page
      const radarImgHeight = (radarCanvas.height * radarImgWidth) / radarCanvas.width;
      
      // Centrer horizontalement
      const centerX = (pdfWidth - radarImgWidth) / 2;
      pdf.addImage(radarImgData, 'PNG', centerX, 55, radarImgWidth, radarImgHeight);
      
      // Avancer la position Y pour les prochains éléments
      let currentY = 55 + radarImgHeight + 10;
      
      // Capturer et ajouter les pistes d'amélioration
      const improvementCards = chartsContainerRef.current.querySelectorAll('.improvement-card');
      if (improvementCards && improvementCards.length > 0) {
        pdf.setFontSize(14);
        pdf.setTextColor(39, 1, 127); // #27017F
        pdf.text("Pistes d'amélioration", pdfWidth / 2, currentY, { align: 'center' });
        currentY += 10;
        
        for (let i = 0; i < improvementCards.length; i++) {
          const card = improvementCards[i];
          const cardCanvas = await html2canvas(card as HTMLElement, {
            scale: 2,
            logging: false,
            useCORS: true,
            allowTaint: true,
          });
          
          const cardImgData = cardCanvas.toDataURL('image/png');
          const cardImgWidth = 170;
          const cardImgHeight = (cardCanvas.height * cardImgWidth) / cardCanvas.width;
          
          // Vérifier si on a besoin d'une nouvelle page
          if (currentY + cardImgHeight > pdfHeight - 20) {
            pdf.addPage();
            currentY = 20;
          }
          
          // Centrer horizontalement
          const cardCenterX = (pdfWidth - cardImgWidth) / 2;
          pdf.addImage(cardImgData, 'PNG', cardCenterX, currentY, cardImgWidth, cardImgHeight);
          
          currentY += cardImgHeight + 10;
        }
      }
      
      // Ajouter une nouvelle page pour les autres graphiques si nécessaire
      pdf.addPage();
      currentY = 20;
      
      // Ajouter un titre pour les graphiques détaillés
      pdf.setFontSize(14);
      pdf.setTextColor(39, 1, 127); // #27017F
      pdf.text("Graphiques détaillés", pdfWidth / 2, currentY, { align: 'center' });
      currentY += 10;
    }
    
    // Capturer et ajouter les autres graphiques (barres, etc.)
    const otherCharts = Array.from(chartsContainerRef.current.querySelectorAll('.chart-card:not(.md\\:col-span-2)'));
    
    const chartPromises = otherCharts.map(async (chart, index) => {
      const canvas = await html2canvas(chart as HTMLElement, {
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
      });
      
      return {
        imgData: canvas.toDataURL('image/png'),
        width: canvas.width,
        height: canvas.height,
      };
    });
    
    const chartImages = await Promise.all(chartPromises);
    
    let currentY = 30; // Position Y initiale sur la nouvelle page
    let currentPage = 1; // On considère que le radar est sur la page 1 et les autres graphiques commencent sur la page 2
    
    chartImages.forEach((chartImg, index) => {
      const isEvenIndex = index % 2 === 0;
      
      // Dimensions des graphiques sur la page
      const imgWidth = 80;
      const imgHeight = (chartImg.height * imgWidth) / chartImg.width;
      
      // Positionner les graphiques en 2 colonnes
      const xPos = isEvenIndex ? 15 : pdfWidth - imgWidth - 15;
      
      // Si ce n'est pas un index pair, on ne change pas currentY car on place à droite
      if (isEvenIndex && index > 0) {
        currentY += imgHeight + 10;
      }
      
      // Vérifier s'il faut ajouter une nouvelle page
      if (currentY + imgHeight > pdfHeight - 20) {
        pdf.addPage();
        currentPage++;
        currentY = 20;
      }
      
      pdf.addImage(chartImg.imgData, 'PNG', xPos, currentY, imgWidth, imgHeight);
      
      // Si c'est le dernier élément d'une paire, augmenter currentY
      if (!isEvenIndex || index === chartImages.length - 1) {
        currentY += imgHeight + 10;
      }
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
