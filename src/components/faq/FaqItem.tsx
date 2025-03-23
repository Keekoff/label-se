
import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FaqItemProps {
  question: string;
  answer: string;
}

const FaqItem = ({ question, answer }: FaqItemProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border-b border-[#35DA56]/20">
      <button
        className="flex w-full items-center justify-between py-4 text-left focus:outline-none group transition-all duration-300"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <h3 className={cn(
          "text-base md:text-lg font-medium transition-colors group-hover:text-[#27017F]",
          isOpen ? "text-[#35DA56]" : "text-gray-800"
        )}>
          {question}
        </h3>
        <ChevronDown
          className={cn(
            "h-5 w-5 transition-transform duration-300 ease-in-out",
            isOpen ? "rotate-180 text-[#35DA56]" : "text-gray-500 group-hover:text-[#27017F]"
          )}
          aria-hidden="true"
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-[1000px] pb-5" : "max-h-0"
        )}
      >
        <div className="bg-gray-50/50 p-4 rounded-lg border-l-4 border-[#35DA56]/40">
          <p className="text-gray-600 whitespace-pre-line leading-relaxed">{answer}</p>
        </div>
      </div>
    </div>
  );
};

export default FaqItem;
