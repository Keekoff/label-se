
interface StepIndicatorProps {
  currentStep: number;
}

const steps = [
  "Informations personnelles et entreprise",
  "Profil de l'entreprise",
  "Rôle et motivations"
];

const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  return (
    <div className="w-full">
      <div className="flex justify-between relative mb-4">
        <div className="w-full absolute top-1/2 h-0.5 bg-gray-200 -z-10" />
        {steps.map((step, index) => (
          <div
            key={index}
            className="flex flex-col items-center gap-2"
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${
                  index + 1 <= currentStep
                    ? "bg-primary text-white"
                    : "bg-gray-200 text-gray-600"
                }`}
            >
              {index + 1}
            </div>
            <span className="text-sm text-gray-600 text-center max-w-[120px]">
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator;
