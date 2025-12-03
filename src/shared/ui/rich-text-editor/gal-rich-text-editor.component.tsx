import React from 'react';
import { useEditor, EditorContent, JSONContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import Underline from '@tiptap/extension-underline';

import GalRTEMenuBar from './gal-rte-menu-bar/gal-rte-menu-bar.component';

import './gal-rich-text-editor.styles.scss';

interface GalRichTextEditorProps {
  initialContent?: JSONContent;
  // eslint-disable-next-line no-unused-vars
  onChange?: (content: JSONContent) => void;
}

const GalRichTextEditor: React.FC<GalRichTextEditorProps> = ({
  initialContent,
  onChange,
}) => {
  // 1) Initialize the editor instance via useEditor()
  const editor = useEditor({
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: true,
        autolink: true,
        linkOnPaste: true,
      }),
      TaskList,
      TaskItem.configure({
        nested: true,
      }),
      Image,
      Underline,
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
    [editor],
  );

  return (
    <div className="course-editor-container">
      <GalRTEMenuBar editor={editor} />
      {/* EditorContent is the actual editable area. */}
      <EditorContent editor={editor} className="rte-content" />
    </div>
  );
};

export default GalRichTextEditor;
