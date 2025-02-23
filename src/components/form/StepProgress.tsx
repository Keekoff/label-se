
import { cn } from "@/lib/utils";
import { FormStep } from "@/pages/Dashboard/Form";

interface StepProgressProps {
  steps: FormStep[];
  currentStep: number;
}

const StepProgress = ({ steps, currentStep }: StepProgressProps) => {
  return (
    <div className="min-w-max">
      <div className="flex justify-between gap-2">
        {steps.map((step, index) => (
          <div
            key={step.id}
            className={cn(
              "flex flex-col items-center relative min-w-[100px]",
              index < steps.length - 1 && 
              "after:content-[''] after:absolute after:top-4 after:left-[calc(50%+1rem)] after:w-[calc(100%-2rem)] after:h-[2px] after:bg-gray-200 after:transition-colors",
              index < steps.length - 1 && currentStep > step.id && "after:bg-primary"
            )}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 relative z-10 bg-white transition-colors",
                currentStep > step.id
                  ? "border-primary bg-primary text-white"
                  : currentStep === step.id
                  ? "border-primary text-primary"
                  : "border-gray-200 text-gray-400"
              )}
            >
              {step.id}
            </div>
            <span className="text-xs mt-2 text-center px-1">
              {step.title}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepProgress;
