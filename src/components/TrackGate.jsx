import React from 'react';
import TrackLogo from './TrackLogo';

export default function TrackGate({ onChoose }) {
  const Card = ({ value, eyebrow, title, note }) => (
    <button
      onClick={() => onChoose(value)}
      className="glassine border border-border bg-card rounded-sm p-10 text-left hover:border-[#6F551A]"
    >
      <TrackLogo track={value} size={56} className="mb-6" />
      <p className="chrono-eyebrow text-[#6F551A] mb-3">{eyebrow}</p>
      <p className="font-display text-4xl leading-none">{title}</p>
      <p className="mt-4 text-sm text-foreground/55 leading-relaxed">{note}</p>
      <p className="mt-6 chrono-eyebrow text-[#6F551A]">Enter →</p>
    </button>
  );

  return (
    <div className="fixed inset-0 z-[100] bg-[#F4EFE3] flex items-center justify-center px-6 overflow-y-auto py-16">
      <div className="max-w-3xl w-full text-center">
        <p className="chrono-eyebrow mb-5">Welcome</p>
        <h1 className="font-display text-5xl md:text-6xl leading-[0.95] tracking-tight mb-3">
          Which course are you studying?
        </h1>
        <p className="text-foreground/60 mb-12">
          Choose your track — you can switch any time from the menu.
        </p>
        <div className="grid sm:grid-cols-2 gap-5">
          <Card
            value="igcse"
            eyebrow="IGCSE"
            title="History"
            note="Core content, depth study, exam papers & coursework."
          />
          <Card
            value="ib"
            eyebrow="IB Diploma"
            title="History"
            note="Papers 1–3, Internal Assessment, Extended Essay & perspectives."
          />
        </div>
      </div>
    </div>
  );
}