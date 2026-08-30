import React from 'react';
import PageHero from '@/components/PageHero';
import SectionCanvas from '@/components/SectionCanvas';
import ResourceLibrary from '@/components/ResourceLibrary';
import ExamVault from '@/components/ExamVault';

export default function Paper1() {
  return (
    <div>
      <PageHero
        page="paper1"
        eyebrow="Prescribed subject · Source paper"
        title="Paper 1"
        lede="The source booklet, the four questions, and the discipline of using evidence well."
        image="https://media.base44.com/images/public/6a9374897e9609e0d36beee4/4e12252d0_generated_db98e7d4.png"
      />

      <SectionCanvas page="paper1" />

      <ResourceLibrary
        section="paper1"
        caseStudy="postwar_europe"
        title="Post-war Displacement in Europe"
        description="Resources, documents and readings for the Europe case study."
      />

      <ResourceLibrary
        section="paper1"
        caseStudy="indochina_refugee"
        title="Indochina Refugee Crisis"
        description="Resources, documents and readings for the Indochina case study."
      />

      <ExamVault
        section="paper1"
        title="The Exam Vault"
        description="Each question type, how to approach it, and an annotated example."
      />
    </div>
  );
}