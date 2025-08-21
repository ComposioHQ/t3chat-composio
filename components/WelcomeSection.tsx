import React from "react";
import { IconPlusSparkles, IconCompass, IconCode, IconHat } from "./Icons";
import { Category, categoryPrompts } from "@/lib/constants";

interface WelcomeSectionProps {
  selectedCategory: Category;
  setSelectedCategory: (category: Category) => void;
  onSuggestionClick: (prompt: string) => void;
}

export function WelcomeSection({
  selectedCategory,
  setSelectedCategory,
  onSuggestionClick,
}: WelcomeSectionProps) {
  const categories = [
    { key: "create" as Category, icon: <IconPlusSparkles />, label: "Create" },
    { key: "explore" as Category, icon: <IconCompass />, label: "Explore" },
    { key: "code" as Category, icon: <IconCode />, label: "Code" },
    { key: "learn" as Category, icon: <IconHat />, label: "Learn" },
  ];

  return (
    <section className="mx-auto mt-8 w-full max-w-2xl text-left">
      <h1 className="text-2xl font-semibold font-weight-600 tracking-tight sm:text-[30px] pb-6 pt-12 justify-left text-[#4e2a58]">
        How can I help you?
      </h1>

      <div className="flex flex-row flex-wrap gap-2.5 text-sm max-sm:justify-evenly">
        {categories.map((category) => (
          <button
            key={category.key}
            onClick={() => setSelectedCategory(category.key)}
            className={`justify-center whitespace-nowrap text-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 h-9 flex items-center gap-1 rounded-xl px-5 py-2 font-semibold outline-1 outline-secondary/70 backdrop-blur-xl max-sm:size-16 max-sm:flex-col sm:gap-2 sm:rounded-full ${
              selectedCategory === category.key
                ? "bg-[#aa4673] text-primary-foreground shadow hover:bg-[#aa4673]/90"
                : "bg-secondary/30 text-secondary-foreground/90 outline hover:bg-secondary"
            }`}
          >
            {category.icon}
            <div>{category.label}</div>
          </button>
        ))}
      </div>

      <div className="mx-auto mt-4 w-full max-w-2xl divide-y divide-rose-100 overflow-hidden rounded-2xl text-left pt-1">
        {categoryPrompts[selectedCategory].map((prompt: string) => (
          <button
            key={prompt}
            onClick={() => onSuggestionClick(prompt)}
            className="block w-full px-5 py-3 text-left text-rose-900/90 transition hover:bg-[#ed78c6]/20 text-font-10px"
          >
            {prompt}
          </button>
        ))}
      </div>
    </section>
  );
}
