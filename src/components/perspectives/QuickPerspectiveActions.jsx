import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import SectionHeading from '@/components/SectionHeading';

export default function QuickPerspectiveActions() {
  return (
    <section className="py-16 md:py-24 border-t border-border">
      <SectionHeading
        eyebrow="Paper 3 · Historiography"
        title="Historical Perspectives"
        description="A living library built by the class. Add a historian you've found, or browse what others have contributed."
      />
      <div className="mt-8">
        <Button asChild variant="outline" className="h-12">
          <Link to="/paper-3#perspectives">
            Open the perspectives bank <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
        </Button>
      </div>
    </section>
  );
}