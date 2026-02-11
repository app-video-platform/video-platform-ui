import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5'; // or '@storybook/react-vite'
import { useState } from 'react';

import SocialMediaInput from './social-media-input.component';
import { SocialPlatforms, SocialMediaLink } from '@api/models';

const meta: Meta<typeof SocialMediaInput> = {
  title: 'Components/SocialMediaInput',
  component: SocialMediaInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'Animated social links editor. Click a platform, type or clear a URL, then confirm. Emits the full list on every change.',
      },
    },
  },
  argTypes: {
    initialSocialLinks: {
      control: 'object',
      description: 'Prefilled links for the control',
    },
    onChange: {
      action: 'changed',
      description: 'Fired whenever internal list of links changes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof SocialMediaInput>;

export const Empty: Story = {
  args: {
    initialSocialLinks: [],
  },
};

export const Prefilled: Story = {
  args: {
    initialSocialLinks: [
      {
        id: null,
        platform: SocialPlatforms.IG,
        url: 'https://instagram.com/myhandle',
      },
      {
        id: null,
        platform: SocialPlatforms.YT,
        url: 'https://youtube.com/@mychannel',
      },
    ] as SocialMediaLink[],
  },
};

export const LiveEditing: Story = {
  render: (args) => {
    const [links, setLinks] = useState<SocialMediaLink[]>(
      (args.initialSocialLinks as SocialMediaLink[]) ?? [],
    );

    return (
      <div style={{ width: 520 }}>
        <SocialMediaInput
          {...args}
          initialSocialLinks={links}
          onChange={(updated) => {
            setLinks(updated);
            args.onChange?.(updated as SocialMediaLink[]);
          }}
        />
        <div
          style={{
            marginTop: '1rem',
            fontSize: '0.9rem',
            color: '#333',
            background: '#f7f7f7',
            padding: '0.75rem 1rem',
            borderRadius: 8,
          }}
        >
          <strong>Current:</strong>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
            {JSON.stringify(links, null, 2)}
          </pre>
        </div>
      </div>
    );
  },
  args: {
    initialSocialLinks: [],
  },
};
