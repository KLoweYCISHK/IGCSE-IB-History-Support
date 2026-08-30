import React from 'react';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import Roadmap from '@/components/Roadmap';
import SectionCanvas from '@/components/SectionCanvas';
import ResourceLibrary from '@/components/ResourceLibrary';

const STAGES = [
  { key: 'preparing', label: 'Preparing for the IA', description: 'Choosing a question, finding sources, and getting the scope right.' },
  { key: 'writing', label: 'Writing the IA', description: 'Section by section, from identification of question to evaluation.' },
  { key: 'markscheme', label: 'Mark scheme', description: 'Exactly what the examiner rewards, criterion by criterion.' },
];

export default function IA() {
  return (
    <div>
      <PageHero
        page="ia"
        eyebrow="Internal Assessment · 20% of your grade"
        title="The IA"
        lede="A historical investigation of your own making. Follow the roadmap, step by step."
        image="https://media.base44.com/images/public/6a9374897e9609e0d36beee4/6b4c80657_generated_4d0d7cf5.png"
      />

      <section className="py-12 md:py-16 border-t border-border">
        <SectionHeading eyebrow="The roadmap" title="Three steps" description="Click a step to open its guidance." />
        <Roadmap section="ia" stages={STAGES} />
      </section>

      <SectionCanvas page="ia" />

      <ResourceLibrary section="ia" />
    </div>
  );
}