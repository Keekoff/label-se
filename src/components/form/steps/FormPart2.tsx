
// Ce fichier sert uniquement à re-exporter les fonctions du module FormPart2

// Importer la fonction depuis le module index.tsx
import { getJustificatifsForPart2 } from "./FormPart2/index";

// Re-exporter la fonction pour qu'elle soit accessible via import depuis FormPart2
export { getJustificatifsForPart2 };

// Importer le composant depuis un autre fichier pour éviter la référence circulaire
import FormPart2Component from "./FormPart2Component";

// Exporter le composant par défaut
export default FormPart2Component;
