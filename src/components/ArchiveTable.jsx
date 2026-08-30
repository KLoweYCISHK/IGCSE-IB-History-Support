import React from 'react';

export default function ArchiveTable({ rows = [] }) {
  if (!rows.length) return null;
  const [head, ...body] = rows;
  return (
    <div className="overflow-x-auto border border-border rounded-sm">
      <table className="w-full border-collapse text-left">
        <thead className="bg-[#2D3238] sticky top-0">
          <tr>
            {head.map((h, i) => (
              <th key={i} className="px-4 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-foreground/80 border-b border-border">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {body.map((row, r) => (
            <tr key={r} className={r % 2 ? 'bg-white/[0.03]' : ''}>
              {head.map((_, c) => (
                <td key={c} className="px-4 py-3 align-top text-[15px] text-foreground/85 border-b border-border/60">
                  {row[c] ?? ''}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}