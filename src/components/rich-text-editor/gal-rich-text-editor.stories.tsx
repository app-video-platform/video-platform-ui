import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5'; // or '@storybook/react-vite'
import GalRichTextEditor from './gal-rich-text-editor.component';
import type { JSONContent } from '@tiptap/react';
import { useState } from 'react';

const meta: Meta<typeof GalRichTextEditor> = {
  title: 'Components/GalRichTextEditor',
  component: GalRichTextEditor,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'TipTap-based rich text editor with StarterKit and Image extensions. Emits TipTap JSON via `onChange`.',
      },
    },
  },
  argTypes: {
    initialContent: {
      control: 'object',
      description: 'TipTap JSON used to seed the editor',
    },
    onChange: {
      action: 'changed',
      description: 'Fires with TipTap JSON document on every update',
    },
  },
};

export default meta;
type Story = StoryObj<typeof GalRichTextEditor>;

const sampleDoc: JSONContent = {
  type: 'doc',
  content: [
    {
      type: 'paragraph',
      content: [
        { type: 'text', text: 'Welcome to ' },
        { type: 'text', marks: [{ type: 'bold' }], text: 'Galactica' },
        { type: 'text', text: '! Start editing...' },
      ],
    },
    {
      type: 'bulletList',
      content: [
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Bold/Italic' }],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Headings' }],
            },
          ],
        },
        {
          type: 'listItem',
          content: [
            {
              type: 'paragraph',
              content: [{ type: 'text', text: 'Lists & Images' }],
            },
          ],
        },
      ],
    },
  ],
};

export const Default: Story = {
  args: {},
};

export const WithInitialContent: Story = {
  args: {
    initialContent: sampleDoc,
  },
};

export const LiveJSONPreview: Story = {
  render: (args) => {
    const [doc, setDoc] = useState<JSONContent>(
      args.initialContent ?? sampleDoc,
    );
    return (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 420px',
          gap: 16,
          height: '100vh',
        }}
      >
        <div style={{ padding: 16 }}>
          <GalRichTextEditor
            {...args}
            initialContent={doc}
            onChange={(json) => {
              setDoc(json);
              args.onChange?.(json);
            }}
          />
        </div>
        <aside
          style={{
            borderLeft: '1px solid #e5e7eb',
            padding: 16,
            background: '#f9fafb',
            overflow: 'auto',
          }}
        >
          <h4 style={{ marginTop: 0 }}>TipTap JSON</h4>
          <pre style={{ fontSize: 12, lineHeight: 1.4 }}>
            {JSON.stringify(doc, null, 2)}
          </pre>
        </aside>
      </div>
    );
  },
  args: {
    initialContent: sampleDoc,
  },
  parameters: {
    docs: {
      description: {
        story: 'Edit on the left; live TipTap JSON updates on the right.',
      },
    },
  },
};
