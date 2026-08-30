import React from 'react';
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
};

export default function RichTextEditor({ value, onChange, placeholder }) {
  return (
    <ReactQuill
      theme="snow"
      value={value || ''}
      onChange={onChange}
      modules={modules}
      placeholder={placeholder || 'Write here…'}
    />
  );
}