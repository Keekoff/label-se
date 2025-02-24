
interface WelcomeHeaderProps {
  firstName: string;
}

export const WelcomeHeader = ({ firstName }: WelcomeHeaderProps) => {
  return (
    <div>
      <h1 className="text-3xl font-bold">Bienvenue, {firstName}</h1>
      <p className="text-gray-500 mt-2">
        Voici un aperçu de votre activité récente
      </p>
    </div>
  );
};
