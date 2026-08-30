import React from 'react';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import Roadmap from '@/components/Roadmap';
import SectionCanvas from '@/components/SectionCanvas';
import ResourceLibrary from '@/components/ResourceLibrary';
import DocumentSection from '@/components/DocumentSection';

const STAGES = [
  { key: 'preparing', label: 'Preparing for the EE', description: 'Topic, research question, supervisor meetings and reading.' },
  { key: 'writing', label: 'Writing the EE', description: 'Structure, argument, sources and the 4,000 words.' },
  { key: 'reflection', label: '500 word reflection', description: 'The three reflections and how to make them count.' },
];

export default function EE() {
  return (
    <div>
      <PageHero
        page="ee"
        eyebrow="Extended Essay · 4,000 words"
        title="The EE"
        lede="A sustained piece of independent research. Here is the path through it."
        image="https://media.base44.com/images/public/6a9374897e9609e0d36beee4/1f8d21ab1_generated_d03ed05f.png"
      />

      <section className="py-12 md:py-16 border-t border-border">
        <SectionHeading eyebrow="The roadmap" title="Three steps" description="Click a step to open its guidance." />
        <Roadmap section="ee" stages={STAGES} />
      </section>

      <SectionCanvas page="ee" />

      <DocumentSection section="ee" title="Documents" description="Handouts, templates and exemplars — click to download." />

      <ResourceLibrary section="ee" />
    </div>
  );
}