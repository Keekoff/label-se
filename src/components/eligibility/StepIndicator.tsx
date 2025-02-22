
import { cn } from "@/lib/utils";

interface StepIndicatorProps {
  currentStep: number;
}

const steps = [
  "Informations générales",
  "Profil de l'entreprise",
  "Rôle et motivations",
];

const StepIndicator = ({ currentStep }: StepIndicatorProps) => {
  return (
    <div className="flex justify-between">
      {steps.map((step, index) => (
        <div
          key={index}
          className={cn(
            "flex flex-col items-center space-y-2 relative w-1/3",
            index === steps.length - 1 ? "flex-1" : "after:content-[''] after:absolute after:top-5 after:left-1/2 after:w-full after:h-[2px] after:bg-gray-200"
          )}
        >
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium border-2 relative z-10 bg-white",
              currentStep > index + 1
                ? "border-primary bg-primary text-white"
                : currentStep === index + 1
                ? "border-primary text-primary"
                : "border-gray-200 text-gray-400"
            )}
          >
            {index + 1}
          </div>
          <span className="text-xs text-center px-4">{step}</span>
        </div>
      ))}
    </div>
  );
};

export default StepIndicator;
