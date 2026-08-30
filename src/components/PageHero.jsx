import React from 'react';
import { Image } from '@/components/ui/image';

export default function PageHero({ eyebrow, title, lede, image }) {
  return (
    <header className="relative pt-16 pb-14 md:pt-24 md:pb-20 overflow-hidden">
      {image && (
        <div className="absolute inset-0 -z-10">
          <Image src={image} alt="" className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#F4EFE3] via-[#F4EFE3]/85 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#F4EFE3] to-transparent" />
        </div>
      )}
      <p className="chrono-eyebrow mb-5">{eyebrow}</p>
      <h1 className="font-display text-6xl md:text-8xl leading-[0.92] tracking-tight max-w-4xl">{title}</h1>
      {lede && <p className="mt-6 max-w-2xl text-lg text-foreground/60 leading-relaxed">{lede}</p>}
    </header>
  );
}