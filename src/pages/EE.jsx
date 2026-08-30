import React from 'react';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import Roadmap from '@/components/Roadmap';
import SectionCanvas from '@/components/SectionCanvas';
import BlockCanvas from '@/components/BlockCanvas';
import DocumentSection from '@/components/DocumentSection';

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
        <SectionHeading eyebrow="The roadmap" title="Step by step" description="Click a step to open its guidance." />
        <Roadmap section="ee" />
      </section>

      <section className="py-12 md:py-16 border-t border-border">
        <SectionHeading eyebrow="Assessment" title="Student-friendly mark scheme" description="The assessment criteria explained in plain language." />
        <BlockCanvas section="ee" sub="student_markscheme" emptyLabel="No mark scheme added yet." />
      </section>

      <SectionCanvas page="ee" />

      <DocumentSection section="ee" title="Example" description="Add a PDF or Word document for students to download." />
    </div>
  );
}