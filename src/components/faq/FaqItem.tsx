
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
    <div className="border-b border-[#35DA56]">
      <button
        className="flex w-full items-center justify-between py-4 text-left focus:outline-none"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <h3 className="text-base font-medium text-gray-800">{question}</h3>
        <ChevronDown
          className={cn(
            "h-5 w-5 text-gray-500 transition-transform",
            isOpen && "rotate-180"
          )}
          aria-hidden="true"
        />
      </button>
      <div
        className={cn(
          "overflow-hidden transition-all duration-300 ease-in-out",
          isOpen ? "max-h-96 pb-4" : "max-h-0"
        )}
      >
        <p className="text-gray-600 whitespace-pre-line">{answer}</p>
      </div>
    </div>
  );
};

export default FaqItem;
