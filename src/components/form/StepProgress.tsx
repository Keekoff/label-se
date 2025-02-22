
import { cn } from "@/lib/utils";
import { FormStep } from "./MultiStepFormDialog";

interface StepProgressProps {
  steps: FormStep[];
  currentStep: number;
}

const StepProgress = ({ steps, currentStep }: StepProgressProps) => {
  return (
    <div className="relative">
      <div className="overflow-x-auto">
        <div className="flex justify-between min-w-max gap-4">
          {steps.map((step, index) => (
            <div
              key={step.id}
              className={cn(
                "flex flex-col items-center relative",
                index < steps.length - 1 && "after:content-[''] after:absolute after:top-4 after:left-[50%] after:w-full after:h-[2px] after:bg-gray-200"
              )}
            >
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 relative z-10 bg-white",
                  currentStep > step.id
                    ? "border-primary bg-primary text-white"
                    : currentStep === step.id
                    ? "border-primary text-primary"
                    : "border-gray-200 text-gray-400"
                )}
              >
                {step.id}
              </div>
              <span className="text-xs mt-2 whitespace-nowrap px-2">
                {step.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepProgress;
