// Registers table blots with Quill so <table>/<tr>/<td> survive the editor's
// delta round-trip and render both in the editor and on the rendered page.
import { Quill } from 'react-quill-new';

const Block = Quill.import('blots/block');
const Container = Quill.import('blots/container');

class TableCell extends Container {
  optimize(context) {
    super.optimize(context);
    // keep every cell editable by guaranteeing it has a block child
    if (this.statics.defaultChild && this.children.length === 0) {
      this.appendChild(Quill.import(this.statics.defaultChild).create());
    }
  }
}
TableCell.blotName = 'table-cell';
TableCell.tagName = 'td';
TableCell.allowedChildren = [Block];
TableCell.defaultChild = 'blots/block';

class TableRow extends Container {}
TableRow.blotName = 'table-row';
TableRow.tagName = 'tr';
TableRow.allowedChildren = [TableCell];

class TableBody extends Container {}
TableBody.blotName = 'table-body';
TableBody.tagName = 'tbody';
TableBody.allowedChildren = [TableRow];

class Table extends Container {}
Table.blotName = 'table';
Table.tagName = 'table';
Table.allowedChildren = [TableBody];

Quill.register(TableCell, true);
Quill.register(TableRow, true);
Quill.register(TableBody, true);
Quill.register(Table, true);

// allow a table to sit at the root level of the document
const Scroll = Quill.import('blots/scroll');
if (Array.isArray(Scroll.allowedChildren) && !Scroll.allowedChildren.includes(Table)) {
  Scroll.allowedChildren.push(Table);
}

export function buildTableHTML(rows = 4, cols = 2) {
  let html = '<table><tbody>';
  for (let r = 0; r < rows; r++) {
    html += '<tr>';
    for (let c = 0; c < cols; c++) {
      html += `<td>${r === 0 ? 'Heading' : ''}</td>`;
    }
    html += '</tr>';
  }
  html += '</tbody></table><p><br></p>';
  return html;
}

export function insertTable(quill, rows = 4, cols = 2) {
  if (!quill) return;
  const html = buildTableHTML(rows, cols);
  const range = quill.getSelection(true) || { index: quill.getLength(), length: 0 };
  quill.clipboard.dangerouslyPasteHTML(range.index, html);
}