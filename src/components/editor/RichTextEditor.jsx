import React, { useEffect, useRef } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const modules = {
  toolbar: [
    [{ header: [1, 2, 3, false] }],
    [{ font: [] }, { size: ['small', false, 'large', 'huge'] }],
    ['bold', 'italic', 'underline'],
    [{ color: [] }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    ['blockquote', 'link'],
    ['clean'],
  ],
  clipboard: {
    // strip visual artifacts copied from Word/Google Docs
    matchVisual: false,
  },
};

export default function RichTextEditor({ value, onChange, placeholder }) {
  const quillRef = useRef(null);

  useEffect(() => {
    const quill = quillRef.current?.getEditor?.();
    if (!quill) return;
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
    <ReactQuill
      ref={quillRef}
      theme="snow"
      value={value || ''}
      onChange={onChange}
      modules={modules}
      placeholder={placeholder || 'Write here…'}
    />
  );
}