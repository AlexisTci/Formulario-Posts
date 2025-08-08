import { useEffect, useRef } from 'react';
import Quill from 'quill';
import 'quill/dist/quill.snow.css';

interface QuillEditorProps {
  value: string;
  onChange: (value: string) => void;
}


export default function QuillEditor({ value, onChange }: QuillEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);

  useEffect(() => {
    if (editorRef.current && !quillRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: 'snow',
      });

      quillRef.current.on('text-change', () => {
        const html = quillRef.current?.root.innerHTML || '';
        onChange(html);
      });
    }
  }, [onChange]);

  // sincronizar el valor externo (Formik) con el contenido interno
  useEffect(() => {
    if (quillRef.current && value !== quillRef.current.root.innerHTML) {
      quillRef.current.root.innerHTML = value || '';
    }
  }, [value]);

  return <div ref={editorRef} style={{ height: '300px' }} />;
}
