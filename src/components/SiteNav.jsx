import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const NAV = [
  { to: '/paper-3#perspectives', label: 'Historical Concepts' },
  { to: '/paper-1', label: 'Paper 1' },
  { to: '/paper-2', label: 'Paper 2' },
  { to: '/paper-3', label: 'Paper 3' },
  { to: '/ia', label: 'IA' },
  { to: '/ee', label: 'EE' },
];

export default function SiteNav() {
  const { pathname } = useLocation();

  return (
    <nav className="flex flex-wrap items-center gap-x-1 gap-y-2">
      {NAV.map((item) => (
        <div key={item.to} className="relative group">
          <Link
            to={item.to}
            className={`block px-4 py-2 font-mono text-[11px] uppercase tracking-[0.22em] transition-colors ${
              pathname === item.to ? 'text-foreground' : 'text-foreground/50 hover:text-foreground'
            }`}
          >
            {item.label}
            <span className={`block mt-1.5 h-px transition-all duration-500 ${pathname === item.to ? 'bg-[#6F551A]' : 'bg-transparent group-hover:bg-border'}`} />
          </Link>
          {item.preview && (
            <div className="absolute left-0 top-full pt-1 hidden group-hover:block z-40">
              <div className="min-w-[190px] border border-border bg-popover/98 backdrop-blur rounded-sm py-2 shadow-2xl">
                {item.preview.map((p) => (
                  <Link key={p.to} to={p.to} className="block px-4 py-2 text-sm text-foreground/70 hover:text-foreground hover:bg-black/[0.05]">
                    {p.label}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}