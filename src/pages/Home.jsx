import React from 'react';
import { Link } from 'react-router-dom';
import { Image } from '@/components/ui/image';
import BlockCanvas from '@/components/BlockCanvas';
import SectionHeading from '@/components/SectionHeading';

const INDEX = [
  { to: '/paper-1', label: 'Paper 1', note: 'Source-based prescribed subject' },
  { to: '/paper-2', label: 'Paper 2', note: 'Three case studies: Hitler · Castro · Chiang Kai-shek' },
  { to: '/paper-3', label: 'Paper 3', note: 'Depth study & historical perspectives' },
  { to: '/ia', label: 'Internal Assessment', note: 'Preparing · Writing · Mark scheme' },
  { to: '/ee', label: 'Extended Essay', note: 'Preparing · Writing · Reflection' },
];

export default function Home() {
  return (
    <div className="pb-10">
      <section className="relative py-20 md:py-32">
        <div className="absolute inset-0 -z-10 -mx-6 md:-mx-20">
          <Image src="https://media.base44.com/images/public/6a9374897e9609e0d36beee4/783ff2ac4_generated_2e68a725.png" alt="" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F1215] via-[#0F1215]/80 to-[#0F1215]/60" />
        </div>
        <p className="chrono-eyebrow mb-6">The Chronos Archive · IB History</p>
        <h1 className="font-display text-6xl md:text-8xl lg:text-9xl leading-[0.9] tracking-tight max-w-5xl">
          Every source, argument and essay — in one archive.
        </h1>
        <p className="mt-8 max-w-2xl text-lg md:text-xl text-foreground/65 leading-relaxed">
          Course content, resources and exam craft for Papers 1–3, the Internal Assessment and the
          Extended Essay. Historical perspectives are built collectively — by you.
        </p>
      </section>

      <section className="py-16 md:py-20 border-t border-border">
        <SectionHeading eyebrow="The index" title="Where would you like to begin?" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {INDEX.map((i) => (
            <Link key={i.to} to={i.to} className="glassine border border-border bg-card rounded-sm p-8 hover:border-[#8C1C13]">
              <p className="font-display text-4xl leading-none">{i.label}</p>
              <p className="mt-4 text-sm text-foreground/55 leading-relaxed">{i.note}</p>
              <p className="mt-6 chrono-eyebrow text-[#c9564a]">Enter →</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="py-16 md:py-24 border-t border-border">
        <SectionHeading eyebrow="Notices" title="From Ms Lowe" />
        <BlockCanvas section="home" sub="notices" emptyLabel="No notices at the moment." />
      </section>
    </div>
  );
}