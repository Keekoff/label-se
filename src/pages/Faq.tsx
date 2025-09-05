
import React, { useState } from 'react';
import FaqItem from '@/components/faq/FaqItem';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const faqItems = [
  {
    question: "Qu'est-ce que le label Startup Engagée ?",
    answer: "Le label Startup Engagée est une certification indépendante conçue pour valoriser les jeunes entreprises qui intègrent les enjeux environnementaux, sociaux et de gouvernance (ESG) dans leur stratégie.\nIl repose sur un questionnaire structuré et un audit de vos justificatifs, garantissant la transparence et la véracité de vos engagements."
  },
  {
    question: "Pourquoi avons-nous créé le label Startup Engagée ?",
    answer: "Dès la création de notre agence KeekOff, nous avons souhaité nous faire labelliser B Corp ou EcoVadis. Rapidement, nous avons constaté que ces labels de référence n'étaient pas adaptés aux jeunes structures comme la nôtre.\n\nNous avons donc conçu une méthodologie validée par un comité d'expert et testée auprès de startups et scaleups de toutes tailles, chiffre d'affaires et issues de secteurs d'activité variés.\nLe label Startup Engagée est aujourd'hui accessible à toutes les entreprises qui souhaitent structurer leur engagement et intégrer les enjeux ESG dès les premières étapes de leur développement."
  },
  {
    question: "À qui s'adresse le label ?",
    answer: "Le label s'adresse aux startups TPE et PME françaises, quel que soit leur secteur d'activité, leur nombre de collaborateurs et leur chiffre d'affaires.\nIl ne s'applique pas aux micro-entreprises, entreprises individuelles ou associations, car notre méthodologie d'évaluation a été conçue pour des entreprises structurées autour d'un modèle économique, avec des enjeux de développement et d'impact mesurables.\n\nLes structures ayant des sites ou des chaînes d'approvisionnement à l'étranger peuvent également candidater, à condition d'être immatriculées en France."
  },
  {
    question: "Pourquoi un label pensé pour les startups ?",
    answer: "Les labels généralistes sont souvent complexes à obtenir pour des entreprises en phase de lancement.\n\nNous avons imaginé une approche souple, progressive et adaptée aux réalités des startups : charge de travail maîtrisée, critères accessibles, accompagnement au fil de l'eau.\n\nC'est aussi une excellente première étape avant de viser une certification plus exigeante."
  },
  {
    question: "Je ne suis pas une startup, puis-je tout de même candidater ?",
    answer: "Oui, tout à fait. Le label est ouvert à toutes les entreprises, qu'elles se définissent comme startup ou non. Ce qui compte, c'est votre volonté d'intégrer les enjeux ESG dans votre stratégie et vos pratiques, quel que soit votre stade de développement."
  },
  {
    question: "Qu'est-ce que ça m'apporte ?",
    answer: "Obtenir le label Startup Engagée, c'est bénéficier d'une reconnaissance officielle par un tiers de confiance qui vérifie la sincérité de vos engagements.\n\nC'est un signal fort envoyé à vos parties prenantes : vous prenez vos responsabilités au sérieux et vous contribuez activement à un modèle économique plus durable.\n\nEn valorisant vos engagements, vous participez également à définir un socle commun d'exigence pour toutes les entreprises, quel que soit leur secteur ou leur taille.\n\nVoici 5 bonnes raisons de rejoindre la communauté des labellisés Startup Engagée :\n1/ Faire reconnaître officiellement votre engagement, validé par un tiers indépendant\n2/ Vous différencier de vos concurrents et rassurer vos clients, en évitant tout risque de greenwashing\n3/ Renforcer votre image de marque et générer de la traction autour de votre projet\n4/ Attirer des talents en quête de sens, sensibles aux valeurs portées par l'entreprise\n5/ Consolider votre écosystème en rejoignant un réseau d'acteurs engagés et responsables"
  },
  {
    question: "Quel est le processus de labellisation ?",
    answer: "Le parcours de labellisation se déroule en cinq étapes clés, conçues pour être simples, rapides et accessibles :\nTester votre éligibilité : un court formulaire pour vérifier si votre entreprise entre dans le périmètre du label.\n\nCompléter le questionnaire en ligne : une auto-évaluation structurée autour de vos engagements ESG, de votre organisation et de votre modèle économique.\n\nProcéder au paiement : le règlement confirme votre volonté de vous engager dans la démarche.\n\nSoumettre vos justificatifs : vous déposez les documents demandés pour appuyer vos réponses.\n\nAudit par nos équipes : nous analysons l'ensemble de votre dossier pour valider la cohérence et la fiabilité des éléments transmis.\n\nDans un délai de 14 jours maximum après la réception complète de votre dossier, vous recevez :\n - Votre niveau de labellisation,\n - Un livret de résultats personnalisé,\n - Un kit de communication dédié pour valoriser votre engagement auprès de vos clients, partenaires et collaborateurs."
  },
  {
    question: "À quoi correspondent les échelons du label Startup Engagée ?",
    answer: "Le label comporte trois échelons, conçus pour valoriser des niveaux de maturité différents dans la démarche RSE :\nÉchelon 1 : pour les entreprises qui démarrent leur transition ESG, afin de reconnaître les premiers pas vers une organisation responsable.\n\nÉchelon 2 : pour celles qui ont déjà mis en place plusieurs actions concrètes (sociales, environnementales ou de gouvernance).\n\nÉchelon 3 : pour les organisations les plus avancées, avec des processus RSE bien intégrés à leur modèle d'affaires.\n\nChaque niveau correspond au degré de structuration et de déploiement de votre stratégie durable, et permet de mesurer la progression dans le temps."
  },
  {
    question: "Combien ça coûte de se faire labelliser ?",
    answer: "Nous avons fait le choix d'indexer le prix de l'audit de labellisation sur le nombre de collaborateurs. Cela nous paraît juste et cohérent avec le niveau de maturité attendu sur les sujets RSE selon la taille de l'entreprise.\nTarifs 2025 (hors taxe) :\n- Pour une entreprise de 0 à 10 collaborateurs : 99 €\n- Pour une entreprise de 10 à 49 collaborateurs : 199 €\n- Pour une entreprise de 50 à 99 collaborateurs : 249 €\n- Pour une entreprise de plus de 100 collaborateurs : 399 €\nCe tarif volontairement raisonnable vise à rendre le label accessible au plus grand nombre.\n\nIl est payant car nos équipes consacrent un temps réel à l'audit des pièces justificatives, ainsi qu'au suivi individualisé des demandes d'accompagnement des entreprises candidates."
  },
  {
    question: "Quelle est la durée de validité du label ?",
    answer: "Le label Startup Engagée est valable un an à compter du règlement de la labellisation.\n\nIl peut être renouvelé chaque année en actualisant vos informations et en présentant les évolutions de votre démarche. Cette durée permet de valoriser les progrès réalisés tout en garantissant la fiabilité des engagements dans le temps."
  }
];

const Faq = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredItems = searchTerm.trim() === "" 
    ? faqItems 
    : faqItems.filter(item => 
        item.question.toLowerCase().includes(searchTerm.toLowerCase()) || 
        item.answer.toLowerCase().includes(searchTerm.toLowerCase())
      );

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl animate-fadeIn">
      <div className="text-center mb-10">
        <h1 className="text-3xl md:text-4xl font-bold mb-4">Foire aux questions</h1>
        <div className="w-16 h-1 bg-[#35DA56] mx-auto mb-6 rounded-full"></div>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Nous avons tenté de répondre à un maximum de questions que vous vous posez sur le label Startup Engagée. 
          Si vous ne trouvez pas votre réponse, n'hésitez pas à remplir notre formulaire de contact !
        </p>
      </div>
      
      <div className="relative mb-8 max-w-md mx-auto">
        <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Rechercher une question..."
          className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg w-full focus:ring-[#35DA56] focus:border-[#35DA56]"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <Card className="p-6 shadow-md backdrop-blur-sm bg-white/95 border border-gray-100">
        <div className="space-y-4">
          {filteredItems.length > 0 ? (
            filteredItems.map((item, index) => (
              <FaqItem
                key={index}
                question={item.question}
                answer={item.answer}
              />
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Aucune question ne correspond à votre recherche.</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default Faq;
