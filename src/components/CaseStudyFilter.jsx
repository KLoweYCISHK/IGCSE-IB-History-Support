import React from 'react';

export const CASE_STUDIES = [
  { value: 'all', label: 'All case studies' },
  { value: 'hitler', label: 'Hitler' },
  { value: 'castro', label: 'Castro' },
  { value: 'chiang', label: 'Chiang Kai-shek' },
];

export default function CaseStudyFilter({ value, onChange }) {
  return (
    <div className="inline-flex flex-wrap border border-border rounded-sm overflow-hidden">
      {CASE_STUDIES.map((c) => (
        <button
          key={c.value}
          onClick={() => onChange(c.value)}
          className={`px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors duration-300 border-r border-border last:border-r-0 ${
            value === c.value ? 'bg-[#8C1C13] text-[#F4F1EA]' : 'text-foreground/60 hover:bg-white/[0.04]'
          }`}
        >
          {c.label}
        </button>
      ))}
    </div>
  );
}