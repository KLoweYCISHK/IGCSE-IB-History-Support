// Builds and downloads an IGCSE Paper 1 practice paper as a Microsoft Word (.docx).
// Page 1 = one random 4, 6, and 10-marker for the chosen focus unit.
// Page 2 = the matching mark schemes (rendered as tables).

import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  WidthType, PageBreak,
} from 'docx';

const TYPES = ['4_marker', '6_marker', '10_marker'];
const LABELS = { '4_marker': '4-marker', '6_marker': '6-marker', '10_marker': '10-marker' };

const stripHtml = (html) =>
  String(html || '')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();

const pickRandom = (arr) => (arr.length ? arr[Math.floor(Math.random() * arr.length)] : null);

function buildTable(rows) {
  return new Table({
    width: { size: 100, type: WidthType.PERCENTAGE },
    rows: rows.map((row, ri) =>
      new TableRow({
        children: row.map((cell) =>
          new TableCell({
            children: [new Paragraph({ children: [new TextRun({ text: stripHtml(cell), bold: ri === 0 })] })],
          })
        ),
      })
    ),
  });
}

export async function generatePaperDoc(topic, items) {
  const byType = { '4_marker': [], '6_marker': [], '10_marker': [] };
  items.forEach((it) => {
    if (it.category === 'question' && byType[it.question_type] && (it.topic || '') === topic) {
      byType[it.question_type].push(it);
    }
  });
  const picked = {
    '4_marker': pickRandom(byType['4_marker']),
    '6_marker': pickRandom(byType['6_marker']),
    '10_marker': pickRandom(byType['10_marker']),
  };

  const children = [];
  // ---- Page 1: questions ----
  children.push(new Paragraph({
    children: [new TextRun({ text: 'IGCSE History — Paper 1', bold: true, size: 32 })],
    spacing: { after: 80 },
  }));
  children.push(new Paragraph({
    children: [new TextRun({ text: `Focus unit: ${topic}`, italics: true, size: 22 })],
    spacing: { after: 240 },
  }));

  TYPES.forEach((type) => {
    const q = picked[type];
    children.push(new Paragraph({
      children: [new TextRun({ text: `${LABELS[type]}`, bold: true, size: 24 })],
      spacing: { before: 200, after: 80 },
    }));
    children.push(new Paragraph({
      children: [new TextRun({
        text: q ? stripHtml(q.question) : `No ${LABELS[type]} available for this focus unit.`,
      })],
    }));
  });

  // ---- Page 2: mark schemes ----
  children.push(new Paragraph({ children: [new PageBreak()] }));
  children.push(new Paragraph({
    children: [new TextRun({ text: 'Mark schemes', bold: true, size: 32 })],
    spacing: { after: 200 },
  }));

  TYPES.forEach((type) => {
    const q = picked[type];
    children.push(new Paragraph({
      children: [new TextRun({ text: `${LABELS[type]}`, bold: true, size: 24 })],
      spacing: { before: 200, after: 80 },
    }));
    if (q && q.question) {
      children.push(new Paragraph({
        children: [new TextRun({ text: stripHtml(q.question), italics: true })],
        spacing: { after: 120 },
      }));
    }
    if (q && q.mark_scheme_rows && q.mark_scheme_rows.length) {
      children.push(buildTable(q.mark_scheme_rows));
    } else {
      children.push(new Paragraph({ children: [new TextRun({ text: 'No mark scheme available.' })] }));
    }
  });

  const doc = new Document({ sections: [{ children }] });
  const blob = await Packer.toBlob(doc);

  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Paper1_${topic.replace(/\s+/g, '_')}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  return picked;
}