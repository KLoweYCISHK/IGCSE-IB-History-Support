import React, { useEffect, useRef } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import '@/lib/quillTable';
import { insertTable } from '@/lib/quillTable';

const modules = {
  toolbar: {
    container: [
      [{ header: [1, 2, 3, false] }],
      [{ font: [] }, { size: ['small', false, 'large', 'huge'] }],
      ['bold', 'italic', 'underline'],
      [{ color: [] }],
      [{ list: 'ordered' }, { list: 'bullet' }],
      ['blockquote', 'link'],
      ['table'],
      ['clean'],
    ],
    handlers: {
      table() {
        insertTable(this.quill, 4, 2);
      },
    },
  },
  clipboard: {
    // strip visual artifacts copied from Word/Google Docs
    matchVisual: false,
  },
};

const TABLE_ICON =
  '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="1.5"/><path d="M3 9h18M3 15h18M9 3v18M15 3v18"/></svg>';

export default function RichTextEditor({ value, onChange, placeholder }) {
  const quillRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const quill = quillRef.current?.getEditor?.();
    if (!quill) return;

    const btn = wrapperRef.current?.querySelector('.ql-table');
    if (btn && !btn.querySelector('svg')) btn.innerHTML = TABLE_ICON;

    // Strip background highlight and inline color from pasted content so it
    // adopts the site's own typography instead of the source's styling.
    quill.clipboard.addMatcher(Node.ELEMENT_NODE, (node, delta) => {
      delta.ops = delta.ops.map((op) => {
        if (op.attributes) {
          delete op.attributes.background;
          delete op.attributes.color;
        }
        // collapse non-breaking spaces so pasted text wraps naturally
        if (typeof op.insert === 'string') {
          op.insert = op.insert.replace(/\u00A0/g, ' ');
        }
        return op;
      });
      return delta;
    });
  }, []);

  return (
    <div ref={wrapperRef}>
      <ReactQuill
        ref={quillRef}
        theme="snow"
        value={value || ''}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder || 'Write here…'}
      />
    </div>
  );
}