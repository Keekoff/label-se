
import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface QuestionOptionProps {
  value: string;
  label: string;
  isSelected: boolean;
  onClick: () => void;
}

const QuestionOption = ({ value, label, isSelected, onClick }: QuestionOptionProps) => {
  return (
    <div
      className={cn(
        "flex items-center gap-2 px-2 py-1.5 text-sm rounded-sm cursor-pointer",
        "hover:bg-accent hover:text-accent-foreground",
        isSelected && "bg-accent"
      )}
      onClick={onClick}
    >
      <div
        className={cn(
          "flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
          isSelected ? "bg-primary text-primary-foreground" : "opacity-50"
        )}
      >
        <Check
          className={cn(
            "h-4 w-4",
            isSelected ? "opacity-100" : "opacity-0"
          )}
        />
      </div>
      {label}
    </div>
  );
};

export default QuestionOption;
