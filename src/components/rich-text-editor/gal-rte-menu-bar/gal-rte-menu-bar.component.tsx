// src/components/MenuBar.tsx
import React from 'react';
import { Editor } from '@tiptap/react';

import './gal-rte-menu-bar.styles.scss'; // we’ll add some simple styling here

interface GalMenuBarProps {
  editor: Editor | null;
}

export default function GalRTEMenuBar({ editor }: GalMenuBarProps) {
  if (!editor) {
    return null;
  }

  return (
    <div className="menubar">
      {/* Bold */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBold().run()}
        disabled={!editor.can().chain().focus().toggleBold().run()}
        className={editor.isActive('bold') ? 'is-active' : ''}
      >
        Bold
      </button>

      {/* Italic */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleItalic().run()}
        disabled={!editor.can().chain().focus().toggleItalic().run()}
        className={editor.isActive('italic') ? 'is-active' : ''}
      >
        Italic
      </button>

      {/* Heading Level 1 */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
        className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
      >
        H1
      </button>

      {/* Heading Level 2 */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
        className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
      >
        H2
      </button>

      {/* Bullet List */}
      <button
        type="button"
        onClick={() => editor.chain().focus().toggleBulletList().run()}
        className={editor.isActive('bulletList') ? 'is-active' : ''}
      >
        • List
      </button>

      {/* Insert Image (prompt for URL) */}
      <button
        type="button"
        onClick={() => {
          const url = window.prompt('Enter image URL');
          if (url) {
            editor.chain().focus().setImage({ src: url }).run();
          }
        }}
      >
        Image
      </button>
    </div>
  );
}
