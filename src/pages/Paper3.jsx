import React, { useState } from 'react';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import SectionCanvas from '@/components/SectionCanvas';
import ResourceLibrary from '@/components/ResourceLibrary';
import ExamVault from '@/components/ExamVault';
import PerspectiveEngine from '@/components/perspectives/PerspectiveEngine';
import { UNITS } from '@/lib/perspectiveTopics';

const UNIT_KEYS = ['russian_revolution', 'cold_war'];

export default function Paper3() {
  const hash = window.location.hash.replace('#', '');
  const [unit, setUnit] = useState(UNIT_KEYS.includes(hash) ? hash : 'russian_revolution');

  return (
    <div>
      <PageHero
        eyebrow="Depth study · Historical perspectives"
        title="Paper 3"
        lede="Deep regional knowledge, essay craft, and a living library of historiography."
        image="https://media.base44.com/images/public/6a9374897e9609e0d36beee4/a44af5825_generated_e31a9e03.png"
      />

      <SectionCanvas page="paper3" />

      <ResourceLibrary section="paper3" />

      <ExamVault section="paper3" description="Essay questions, how to structure a response, examples and mark schemes." />

      <section id="perspectives" className="py-16 md:py-24 border-t border-border">
        <SectionHeading
          eyebrow="Built by the class"
          title="Historical Perspectives"
          description="When you find a historian or school of thought, add it here so everyone can use it."
        />

        <div className="inline-flex flex-wrap border border-border rounded-sm overflow-hidden mb-10">
          {UNIT_KEYS.map((k) => (
            <button
              key={k}
              onClick={() => setUnit(k)}
              className={`px-6 py-3 font-mono text-[11px] uppercase tracking-[0.2em] border-r border-border last:border-r-0 transition-colors ${
                unit === k ? 'bg-[#6F551A] text-[#F4EFE3]' : 'text-foreground/60 hover:bg-white/[0.04]'
              }`}
            >
              {UNITS[k].label}
            </button>
          ))}
        </div>

        <p className="mb-8 max-w-2xl text-foreground/55">{UNITS[unit].blurb}</p>

        <PerspectiveEngine key={unit} unit={unit} />
      </section>
    </div>
  );
}