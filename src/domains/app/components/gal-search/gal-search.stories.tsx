import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
// or '@storybook/react-vite' if using Vite
import { useState } from 'react';
import GalSearch from './gal-search.component';

const meta: Meta<typeof GalSearch> = {
  title: 'Components/GalSearch',
  component: GalSearch,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A controlled search bar with text input and a clickable search icon. Calls `onSearch` when the form is submitted.',
      },
    },
  },
  argTypes: {
    placeholder: {
      control: 'text',
      description: 'Placeholder text for the input field',
    },
    customClassName: {
      control: 'text',
      description: 'Additional class names for styling',
    },
    onSearch: {
      action: 'searched',
      description: 'Callback triggered when user submits search',
    },
    onChange: {
      action: 'changed',
      description: 'Callback triggered on input change',
    },
  },
};

export default meta;
type Story = StoryObj<typeof GalSearch>;

export const Default: Story = {
  render: (args) => {
    const [query, setQuery] = useState('');
    return (
      <div style={{ width: 350 }}>
        <GalSearch
          {...args}
          value={query}
          onChange={setQuery}
          onSearch={(term) => {
            setQuery(term);
            args.onSearch?.(term);
          }}
        />
        <p style={{ fontSize: '0.9rem', marginTop: '1rem', color: '#555' }}>
          Current query: <strong>{query || '(empty)'}</strong>
        </p>
      </div>
    );
  },
  args: {
    placeholder: 'Search products...',
  },
};

export const WithCustomStyle: Story = {
  render: (args) => {
    const [query, setQuery] = useState('');
    return (
      <div style={{ width: 350 }}>
        <GalSearch
          {...args}
          value={query}
          onChange={setQuery}
          onSearch={args.onSearch}
          customClassName="custom-search"
        />
      </div>
    );
  },
  args: {
    placeholder: 'Try typing...',
  },
  parameters: {
    docs: {
      description: {
        story:
          'You can pass a custom CSS class via `customClassName` to style the search form differently.',
      },
    },
  },
};
