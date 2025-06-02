// src/components/CourseEditor.tsx
import React from 'react';
import { useEditor, EditorContent, JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import MenuBar from './menu-bar/menu-bar.component';

interface RichTextEditorProps {
  initialContent?: JSONContent;
  onChange?: (content: JSONContent) => void;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  initialContent,
  onChange,
}) => {
  // 1) Initialize the editor instance via useEditor()
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        // you can disable parts of StarterKit if you want:
        // heading: false, // for example
      }),
      Image,
      // …any other extensions you need
    ],
    content: initialContent || '<p>Start writing your lesson…</p>',
    onUpdate: ({ editor }) => {
      // TipTap’s JSON document model; call onChange if provided
      const json = editor.getJSON();
      onChange?.(json);
    },
  });

  // 2) Clean up on unmount (optional)
  React.useEffect(
    () => () => {
      editor?.destroy();
    },
    [editor]
  );

  return (
    <div className="course-editor-container">
      <MenuBar editor={editor} />
      {/* EditorContent is the actual editable area. */}
      <EditorContent editor={editor} />
    </div>
  );
};

export default RichTextEditor;
