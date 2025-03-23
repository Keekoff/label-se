
import React, { useState } from 'react';
import FaqItem from '@/components/faq/FaqItem';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

const faqItems = [
  {
    question: "Qu'est-ce que le label Startup Engagée ?",
    answer: "Il s'agit d'une certification indépendante qui vise à permettre aux jeunes structures de mettre en avant leur engagement durable et responsable. Il se compose d'un questionnaire et d'un audit afin de garantir la qualité et la véracité des déclarations."
  },
  {
    question: "Pourquoi nous avons conçu le label Startup Engagée ?",
    answer: "Pour ne pas être des cordonniers mal chaussés, nous avons dès la création de notre agence KeekOff, voulu être labellisés Bcorp et EcoVadis, les références du marché. Très vite nous nous sommes aperçu que ces labels n'étaient pas adaptés à notre jeune structure et nous avons alors décidé de créer notre propre méthodologie. Après examen minutieux par un comité d'experts et un beta-test auprès de 12 startups nous avons proposé le label Startup Engagée à toutes les entreprises. Depuis février 2023, il est ouvert à tous ceux qui souhaitent s'engager au quotidien et intégrer les piliers ESG à leur stratégie de développement."
  },
  {
    question: "À quel type d'entreprise s'adresse le label ?",
    answer: "Le label Startup Engagée convient pour toutes les structures, quelque soit leur secteur d'activité. Il n'est pas adapté aux micro-entreprises, aux entreprises individuelles et aux associations qui ne sont donc pas éligibles à la labellisation. Ce label adresse les entreprises immatriculées en France mais n'exclut pas celles qui possèdent des usines, bureaux ou chaînes d'approvisionnement ou de fabrication à l'étranger."
  },
  {
    question: "Pourquoi avoir lancé un label à destination des startups ?",
    answer: "Les certifications B Corp, EcoVadis ou autre peuvent parfois être trop contraignantes pour des entreprises en phase de lancement. Nous avons pensé un dispositif flexible et adapté aux préoccupations des startups pour allier croissance et maîtrise d'impact afin de les guider vers l'atteinte de leurs objectifs. Ce label peut être une bonne préparation aux certifications généralistes."
  },
  {
    question: "Qu'est-ce que ça m'apporte ?",
    answer: "L'obtention d'un label est la garantie qu'un tiers de confiance a vérifier vos déclarations. C'est l'assurance pour vos parties prenantes de l'intégrité de votre engagement et de votre volonté à contribuer à construire un écosystème plus durable. En partageant vos certifications et labels vous participez à établir un standard minimal pour toutes les entreprises quelque soit leur secteur et leur taille. Voici 5 bonnes raisons de rejoindre la communauté des labellisés Startup Engagée :\n\n– Faire valoir votre engagement de manière officielle et vérifiée par un tiers de confiance\n– Vous démarquer de la concurrence en rassurant vos clients sur vos engagements en évitant le greenwashing\n– Communiquer sur votre image de marque et permettre de créer de la traction pour votre entreprise\n– Donner envie aux talents de vous rejoindre, les nouvelles générations étant très sensibles aux valeurs et aux actions réalisées par les entreprises en faveur de l'impact positif\n– Créer du lien et solidifier votre écosystème en étant acteur d'un cercle vertueux de parties prenantes durables et responsables"
  },
  {
    question: "Quel est le processus de labellisation ?",
    answer: "3 étapes à suivre :\n– tester son éligibilité,\n– passer le questionnaire,\n– présenter les justificatifs demandés.\nLes résultats vous sont ensuite communiqués par les équipes dans un délai de 14 jours maximum. Vous obtenez ensuite le label Startup Engagée selon votre échelon. Un livret de résultats ainsi qu'un kit de communication à personnaliser vous sont également fournis."
  },
  {
    question: "Combien ça coûte de se faire labelliser ?",
    answer: "Nous avons fait le choix d'indexer le tarif de l'audit de labellisation sur le nombre de collaborateurs. Cela nous parait juste et cohérent avec la notion de maturité sur les sujets RSE pour les startups.\n\nTarifs 2024 :\n– Pour une entreprise de 0 à 10 collaborateurs : 99€ HT\n– Pour une entreprise de 10 à 49 : 199€ HT\n– Pour une entreprise de 50 à 99 : 249€ HT\n– Pour une entreprise de plus de 100 collaborateurs : 399€ HT Ce tarif raisonnable vise à rendre accessible ce label au plus grand nombre. Il est payant car nos équipes passent du temps sur l'audit des pièces justificatives ainsi que sur le suivi des demandes d'accompagnement des entreprises candidates."
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
