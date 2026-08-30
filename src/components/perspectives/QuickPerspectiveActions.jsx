import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Plus, ArrowRight } from 'lucide-react';
import { useAdmin } from '@/lib/AdminContext';
import { UNITS } from '@/lib/perspectiveTopics';
import SectionHeading from '@/components/SectionHeading';
import AddPerspectiveDialog from './AddPerspectiveDialog';

const UNIT_KEYS = ['russian_revolution', 'cold_war'];

export default function QuickPerspectiveActions() {
  const { user } = useAdmin();
  const [unit, setUnit] = useState('russian_revolution');
  const [open, setOpen] = useState(false);

  return (
    <section className="py-16 md:py-24 border-t border-border">
      <SectionHeading
        eyebrow="Paper 3 · Historiography"
        title="Historical Perspectives"
        description="A living library built by the class. Add a historian you've found, or browse what others have contributed."
      />

      <div className="mt-8 flex flex-col lg:flex-row lg:items-center gap-5">
        <div className="inline-flex flex-wrap border border-border rounded-sm overflow-hidden self-start">
          {UNIT_KEYS.map((k) => (
            <button
              key={k}
              onClick={() => setUnit(k)}
              className={`px-5 py-3 font-mono text-[11px] uppercase tracking-[0.2em] border-r border-border last:border-r-0 transition-colors ${
                unit === k ? 'bg-[#6F551A] text-[#F4EFE3]' : 'text-foreground/60 hover:bg-black/[0.04]'
              }`}
            >
              {UNITS[k].label}
            </button>
          ))}
        </div>

        <Button
          className="h-12 bg-[#6F551A] hover:bg-[#5A4514] text-[#F4EFE3]"
          onClick={() => setOpen(true)}
        >
          <Plus className="w-4 h-4 mr-1.5" /> Quick add a perspective
        </Button>

        <Button asChild variant="outline" className="h-12">
          <Link to="/paper-3#perspectives">
            Open the perspectives bank <ArrowRight className="w-4 h-4 ml-1.5" />
          </Link>
        </Button>
      </div>

      <AddPerspectiveDialog
        open={open}
        onOpenChange={setOpen}
        unit={unit}
        initial={{ student_name: user?.full_name || '' }}
        onSaved={() => setOpen(false)}
      />
    </section>
  );
}