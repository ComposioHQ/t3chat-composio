import React from "react";

interface ChipButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick?: () => void;
}

export function ChipButton({ icon, label, onClick }: ChipButtonProps) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 rounded-full border border-rose-200/60 bg-white/70 px-4 py-2 text-sm font-medium text-rose-900 shadow-sm backdrop-blur transition hover:bg-white"
    >
      <span className="text-rose-500">{icon}</span>
      {label}
    </button>
  );
}
