import React, { useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import BlockCanvas from './BlockCanvas';

export default function Roadmap({ section, stages }) {
  const [active, setActive] = useState(null);

  return (
    <div className="py-8">
      <div className="relative grid md:grid-cols-3 gap-8 md:gap-6">
        <div className="hidden md:block absolute top-7 left-[16%] right-[16%] h-px bg-gradient-to-r from-[#6F551A]/20 via-[#6F551A] to-[#6F551A]/20" />
        {stages.map((s, i) => (
          <button
            key={s.key}
            onClick={() => setActive(s)}
            className="glassine relative text-left border border-border bg-card rounded-sm p-7 hover:border-[#6F551A]"
          >
            <span className="relative z-10 flex items-center justify-center w-8 h-8 rounded-full border border-[#6F551A] bg-[#F4EFE3] font-mono text-xs text-[#6F551A]">
              {i + 1}
            </span>
            <h3 className="mt-5 font-display text-3xl leading-tight">{s.label}</h3>
            <p className="mt-3 text-sm text-foreground/55 leading-relaxed">{s.description}</p>
            <span className="mt-5 block chrono-eyebrow text-[#6F551A]">Open →</span>
          </button>
        ))}
      </div>

      <Sheet open={!!active} onOpenChange={(o) => !o && setActive(null)}>
        <SheetContent side="right" className="w-full sm:max-w-2xl overflow-y-auto bg-[#FBF7EE]">
          <SheetHeader className="text-left">
            <SheetDescription className="chrono-eyebrow">{section.toUpperCase()} roadmap</SheetDescription>
            <SheetTitle className="font-display text-4xl">{active?.label}</SheetTitle>
          </SheetHeader>
          <div className="mt-8 pb-16">
            {active && (
              <BlockCanvas section={section} sub={active.key} emptyLabel="Ms Lowe hasn't added guidance to this step yet." />
            )}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}