
import React from 'react';
import FaqItem from '@/components/faq/FaqItem';

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
  }
];

const Faq = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl animate-fadeIn">
      <h1 className="text-4xl font-bold mb-8">FAQ</h1>
      
      <p className="mb-10 text-gray-700">
        Nous avons tenté de répondre à un maximum de questions que vous vous posez sur le label Startup Engagée. 
        Si vous ne trouvez pas votre réponse, n'hésitez pas à remplir notre formulaire de contact !
      </p>
      
      <div className="space-y-1">
        {faqItems.map((item, index) => (
          <FaqItem
            key={index}
            question={item.question}
            answer={item.answer}
          />
        ))}
      </div>
    </div>
  );
};

export default Faq;
