"use client";

import React, { useEffect, useRef, useState } from "react";
import getClassNames from "@/components/utility/GetClassNames";
import "@/components/ui/Surfaces/accordion/accordion.module.css";

interface AccordionProps {
  title: string;
  content: string;
}

const Accordion: React.FC<AccordionProps> = ({ title, content }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [contentHeight, setContentHeight] = useState(0);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(isOpen ? contentRef.current.scrollHeight : 0);
    }
  }, [isOpen]);

  const toggleAccordion = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="w-full rounded-md overflow-hidden shadow-md border bg-accent">
      <div
        className="flex items-center justify-between p-6 cursor-pointer select-none bg-accent"
        onClick={toggleAccordion}
      >
        <h2 className="text-lg font-medium text-white">{title}</h2>
        <svg
          className={getClassNames("w-6 h-6", isOpen && "open")}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d={isOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
          />
        </svg>
      </div>
      <div
        ref={contentRef}
        className="overflow-hidden transition-height duration-300 ease-in-out bg-primary-light"
        style={{ height: `${contentHeight}px` }}
      >
        <div className="p-6 pb-8 text-white border-t">{content}</div>
      </div>
    </div>
  );
};

export default Accordion;
