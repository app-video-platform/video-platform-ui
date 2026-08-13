// src/components/MenuBar.tsx
import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5'; // or '@storybook/react-vite'
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import RTEMenuBar from './rte-menu-bar.component';

const meta: Meta<typeof RTEMenuBar> = {
  title: 'Components/RTEMenuBar',
  component: RTEMenuBar,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    docs: {
      description: {
        component:
          'Toolbar for the RichTextEditor. Provides formatting controls (bold, italic, headings, lists, and image insertion).',
      },
    },
  },
  argTypes: {
    editor: {
      control: false,
      description: 'TipTap editor instance (provided by useEditor)',
    },
  },
};

export default meta;
type Story = StoryObj<typeof RTEMenuBar>;

export const WithEditor: Story = {
  render: () => {
    const editor = useEditor({
      extensions: [StarterKit, Image],
      content: '<p><strong>Editable</strong> rich text content.</p>',
    });

    return (
      <div style={{ padding: 20 }}>
        <RTEMenuBar editor={editor} />
        <EditorContent
          editor={editor}
          style={{
            border: '1px solid #ddd',
            padding: 12,
            borderRadius: 8,
            minHeight: 150,
            marginTop: 8,
            background: '#fff',
          }}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates RTEMenuBar integrated with a live TipTap editor. Click toolbar buttons to apply formatting or insert images.',
      },
    },
  },
};
