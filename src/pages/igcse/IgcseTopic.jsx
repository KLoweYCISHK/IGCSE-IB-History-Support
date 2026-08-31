import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import PageHero from '@/components/PageHero';
import SectionHeading from '@/components/SectionHeading';
import SectionCanvas from '@/components/SectionCanvas';
import ResourceLibrary from '@/components/ResourceLibrary';
import ExamVault from '@/components/ExamVault';
import TextbookSection from '@/components/TextbookSection';
import Roadmap from '@/components/Roadmap';
import DocumentSection from '@/components/DocumentSection';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

const TOPICS = {
  core1: {
    page: 'igcse_core1',
    eyebrow: 'Core content · Part 1',
    title: '1917–1939',
    lede: 'The shaping of the post-war world — from the Russian Revolution to the road to war.',
    hasExam: true,
    hasTextbook: true,
  },
  core2: {
    page: 'igcse_core2',
    eyebrow: 'Core content · Part 2',
    title: '1945–1989',
    lede: 'The Cold War world — from Yalta and Potsdam to the collapse of the Soviet bloc.',
    hasExam: true,
    hasTextbook: true,
  },
  depth: {
    page: 'igcse_depth',
    eyebrow: 'Depth study',
    title: 'Weimar & Nazi Germany',
    lede: 'Germany from the Weimar Republic to the Nazi state — collapse, consolidation, and control.',
    hasExam: true,
    hasTextbook: true,
  },
  paper1: {
    page: 'igcse_paper1',
    eyebrow: 'Examination',
    title: 'Paper 1',
    lede: 'The source paper — how to read evidence and answer with precision.',
    hasExam: true,
    hasTextbook: true,
  },
  paper2: {
    page: 'igcse_paper2',
    eyebrow: 'Examination',
    title: 'Paper 2',
    lede: 'The essay paper — how to argue, structure, and use your knowledge.',
    hasExam: true,
    hasTextbook: true,
  },
  coursework: {
    page: 'igcse_coursework',
    eyebrow: 'Coursework',
    title: 'Coursework',
    lede: 'An historical investigation of your own making. Follow the roadmap, step by step.',
    hasExam: false,
    hasTextbook: false,
    isCoursework: true,
  },
};

const tabCls = 'rounded-none border-r border-border last:border-r-0 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.2em] data-[state=active]:bg-[#6F551A] data-[state=active]:text-[#F4EFE3] data-[state=inactive]:text-foreground/60 data-[state=inactive]:hover:bg-black/[0.04]';

export default function IgcseTopic() {
  const { topic } = useParams();
  const cfg = TOPICS[topic];
  if (!cfg) return <Navigate to="/" replace />;

  return (
    <div>
      <PageHero page={cfg.page} eyebrow={cfg.eyebrow} title={cfg.title} lede={cfg.lede} />

      {cfg.isCoursework && (
        <section className="py-12 md:py-16 border-t border-border">
          <SectionHeading eyebrow="The roadmap" title="Step by step" description="Work through each stage in turn." />
          <Tabs defaultValue="preparing">
            <TabsList className="inline-flex flex-wrap h-auto bg-transparent p-0 border border-border rounded-sm overflow-hidden">
              <TabsTrigger value="preparing" className={tabCls}>Preparing</TabsTrigger>
              <TabsTrigger value="writing" className={tabCls}>Writing</TabsTrigger>
              <TabsTrigger value="markscheme" className={tabCls}>Examples</TabsTrigger>
            </TabsList>
            <TabsContent value="preparing" className="mt-8">
              <Roadmap section={cfg.page} stages={[{ key: 'preparing', label: 'Preparing' }]} />
            </TabsContent>
            <TabsContent value="writing" className="mt-8">
              <Roadmap section={cfg.page} stages={[{ key: 'writing', label: 'Writing' }]} />
            </TabsContent>
            <TabsContent value="markscheme" className="mt-8">
              <DocumentSection
                section={cfg.page}
                title="Example coursework"
                description="Annotated examples — download them and study the marking."
                embedded
              />
            </TabsContent>
          </Tabs>
        </section>
      )}

      <SectionCanvas page={cfg.page} />

      {cfg.hasExam && (
        <ExamVault
          section={cfg.page}
          title="The Exam Vault"
          description="How to approach each question, mark schemes, and a bank of practice questions."
        />
      )}

      <ResourceLibrary section={cfg.page} />

      {cfg.hasTextbook && <TextbookSection section={cfg.page} caseStudy="all" />}
    </div>
  );
}