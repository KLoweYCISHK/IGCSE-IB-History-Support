import React from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';

const modules = {
  toolbar: [['bold', 'italic'], [{ list: 'bullet' }, { list: 'ordered' }]],
};

export default function CellEditor({ value, onChange, placeholder }) {
  return (
    <div className="cell-editor">
      <ReactQuill
        theme="snow"
        value={value || ''}
        onChange={onChange}
        modules={modules}
        placeholder={placeholder || 'Write...'}
      />
    </div>
  );
}