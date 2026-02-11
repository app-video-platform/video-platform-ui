import React from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
// or '@storybook/react-vite' if using Vite
import { useState } from 'react';
import OSMLocationSearch from './location-search.component';
import type { GalLocation } from './location-search.component';

const meta: Meta<typeof OSMLocationSearch> = {
  title: 'Components/OSMLocationSearch',
  component: OSMLocationSearch,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'An autocomplete input powered by OpenStreetMap Nominatim API for searching and selecting locations.',
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof OSMLocationSearch>;

export const Default: Story = {
  render: () => {
    const [selected, setSelected] = useState<GalLocation | null>(null);

    return (
      <div style={{ width: '400px' }}>
        <OSMLocationSearch
          onSelect={(place: React.SetStateAction<GalLocation | null>) =>
            setSelected(place)
          }
        />
        {selected && (
          <div
            style={{
              marginTop: '1rem',
              fontSize: '0.9rem',
              color: '#333',
              background: '#f9f9f9',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
            }}
          >
            <strong>Selected:</strong> {selected.city}, {selected.country}
            <br />
            <small>
              (lat: {selected.lat.toFixed(4)}, lon: {selected.lon.toFixed(4)})
            </small>
          </div>
        )}
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Search for cities or countries using the OpenStreetMap API and see the selected location displayed below.',
      },
    },
  },
};
