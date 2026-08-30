import React from 'react';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import Roadmap from '@/components/Roadmap';
import SectionCanvas from '@/components/SectionCanvas';
import BlockCanvas from '@/components/BlockCanvas';
import DocumentSection from '@/components/DocumentSection';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const STAGES = [
  { key: 'preparing', label: 'Preparing for the EE' },
  { key: 'writing', label: 'Writing the EE' },
];

const REFLECTION_STAGE = [{ key: 'reflection', label: '500 word reflection' }];

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
        <Roadmap section="ee" stages={STAGES} />
      </section>

      <section className="py-12 md:py-16 border-t border-border">
        <Tabs defaultValue="reflection">
          <TabsList className="inline-flex flex-wrap h-auto bg-transparent p-0 border border-border rounded-sm overflow-hidden">
            <TabsTrigger value="reflection" className="rounded-none border-r border-border last:border-r-0 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] data-[state=active]:bg-[#6F551A] data-[state=active]:text-[#F4EFE3] data-[state=inactive]:text-foreground/60 data-[state=inactive]:hover:bg-black/[0.04]">500 word reflection</TabsTrigger>
            <TabsTrigger value="examples" className="rounded-none border-r border-border last:border-r-0 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] data-[state=active]:bg-[#6F551A] data-[state=active]:text-[#F4EFE3] data-[state=inactive]:text-foreground/60 data-[state=inactive]:hover:bg-black/[0.04]">Example EEs</TabsTrigger>
            <TabsTrigger value="markscheme" className="rounded-none px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] data-[state=active]:bg-[#6F551A] data-[state=active]:text-[#F4EFE3] data-[state=inactive]:text-foreground/60 data-[state=inactive]:hover:bg-black/[0.04]">Mark scheme</TabsTrigger>
          </TabsList>
          <TabsContent value="reflection" className="mt-8">
            <Roadmap section="ee" stages={REFLECTION_STAGE} />
          </TabsContent>
          <TabsContent value="examples" className="mt-8">
            <DocumentSection section="ee" title="Example EEs" description="Annotated example Extended Essays — download and study them." embedded />
          </TabsContent>
          <TabsContent value="markscheme" className="mt-8">
            <SectionHeading eyebrow="Assessment" title="Student-friendly mark scheme" description="The assessment criteria explained in plain language." />
            <BlockCanvas section="ee" sub="student_markscheme" emptyLabel="No mark scheme added yet." />
          </TabsContent>
        </Tabs>
      </section>

      <SectionCanvas page="ee" />
    </div>
  );
}