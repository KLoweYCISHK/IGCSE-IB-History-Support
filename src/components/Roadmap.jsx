import React, { useState } from 'react';
import BlockCanvas from './BlockCanvas';

export default function Roadmap({ section, stages }) {
  const [active, setActive] = useState(stages[0]?.key);
  const current = stages.find((s) => s.key === active);

  return (
    <div className="py-8">
      <div className="inline-flex flex-wrap border border-border rounded-sm overflow-hidden mb-10">
        {stages.map((s, i) => (
          <button
            key={s.key}
            onClick={() => setActive(s.key)}
            className={`px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors ${i === stages.length - 1 ? '' : 'border-r border-border'} ${active === s.key ? 'bg-[#6F551A] text-[#F4EFE3]' : 'text-foreground/60 hover:bg-black/[0.04]'}`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {current && (
        <div>
          {current.description && (
            <p className="max-w-2xl text-foreground/60 leading-relaxed mb-8">{current.description}</p>
          )}
          <BlockCanvas section={section} sub={current.key} emptyLabel="Ms Lowe hasn't added guidance to this step yet." />
        </div>
      )}
    </div>
  );
}