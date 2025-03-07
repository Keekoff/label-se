
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

    // Créer un PDF avec compression activée
    const pdf = new jsPDF({
      compress: true,
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Ajouter l'en-tête
    pdf.setFontSize(16);
    pdf.setTextColor(39, 1, 127); // #27017F
    pdf.text("Rapport de Performance - Label Startup Engagée", pdfWidth / 2, 15, { align: 'center' });
    
    // 1. Ajouter les informations de certification
    pdf.setFontSize(14);
    pdf.setTextColor(39, 1, 127); // #27017F
    pdf.text("Certification", pdfWidth / 2, 25, { align: 'center' });
    
    // Ajouter les informations de l'entreprise
    pdf.setFontSize(12);
    pdf.setTextColor(0, 0, 0);
    pdf.text(`Entreprise: ${chartData.companyName}`, 20, 35);
    pdf.text(`Date: ${new Date().toLocaleDateString('fr-FR')}`, 20, 42);

    if (chartData.echelonTexte) {
      pdf.text(`Niveau: ${chartData.echelonTexte}`, 20, 49);
      pdf.text(`Validité: ${formatDate(chartData.dateValidation)} - ${formatDate(chartData.dateFinValidite)}`, 20, 56);
    }
    
    let currentY = 66;
    
    // 2. Ajouter les graphiques en barres (2 par ligne)
    const barCharts = Array.from(chartsContainerRef.current.querySelectorAll('.chart-card:not(.md\\:col-span-2):not(.improvement-card)'));
    
    if (barCharts.length > 0) {
      pdf.setFontSize(14);
      pdf.setTextColor(39, 1, 127); // #27017F
      pdf.text("Graphiques détaillés", pdfWidth / 2, currentY, { align: 'center' });
      currentY += 10;
      
      // Créer un tableau pour stocker les promesses de génération des images
      const barChartPromises = barCharts.map(async (chart) => {
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
      
      // Attendre que toutes les images soient générées
      const barChartImages = await Promise.all(barChartPromises);
      
      // Placer les graphiques 2 par ligne
      for (let i = 0; i < barChartImages.length; i += 2) {
        // Graphique à gauche
        const leftChart = barChartImages[i];
        const leftImgWidth = 80;
        const leftImgHeight = (leftChart.height * leftImgWidth) / leftChart.width;
        
        pdf.addImage(leftChart.imgData, 'PNG', 15, currentY, leftImgWidth, leftImgHeight);
        
        // Graphique à droite (s'il existe)
        if (i + 1 < barChartImages.length) {
          const rightChart = barChartImages[i + 1];
          const rightImgWidth = 80;
          const rightImgHeight = (rightChart.height * rightImgWidth) / rightChart.width;
          
          pdf.addImage(rightChart.imgData, 'PNG', pdfWidth - rightImgWidth - 15, currentY, rightImgWidth, rightImgHeight);
          
          // Utiliser la hauteur la plus grande des deux graphiques
          const maxHeight = Math.max(leftImgHeight, rightImgHeight);
          currentY += maxHeight + 10;
        } else {
          currentY += leftImgHeight + 10;
        }
        
        // Ajouter une nouvelle page si besoin
        if (currentY > pdfHeight - 20 && i + 2 < barChartImages.length) {
          pdf.addPage();
          currentY = 20;
        }
      }
    }
    
    // 3. Ajouter le graphique radar en pleine largeur
    const radarChart = chartsContainerRef.current.querySelector('.md\\:col-span-2.chart-card');
    if (radarChart) {
      // Ajouter une nouvelle page si nécessaire
      if (currentY > pdfHeight - 100) {
        pdf.addPage();
        currentY = 20;
      }
      
      pdf.setFontSize(14);
      pdf.setTextColor(39, 1, 127); // #27017F
      pdf.text("Analyse comparative des critères de durabilité", pdfWidth / 2, currentY, { align: 'center' });
      currentY += 10;
      
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
      pdf.addImage(radarImgData, 'PNG', centerX, currentY, radarImgWidth, radarImgHeight);
      
      // Mettre à jour la position Y
      currentY += radarImgHeight + 15;
    }
    
    // 4. Ajouter les pistes d'amélioration
    const improvementCards = chartsContainerRef.current.querySelectorAll('.improvement-card');
    if (improvementCards && improvementCards.length > 0) {
      // Ajouter une nouvelle page si nécessaire
      if (currentY > pdfHeight - 60) {
        pdf.addPage();
        currentY = 20;
      }
      
      pdf.setFontSize(14);
      pdf.setTextColor(39, 1, 127); // #27017F
      pdf.text("Pistes d'amélioration", pdfWidth / 2, currentY, { align: 'center' });
      currentY += 10;
      
      // Générer les images des cartes d'amélioration
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
