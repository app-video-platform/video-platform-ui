import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import GalExpansionPanel from './gal-expansion-panel.component';
import GalExpansionGroup from '../gal-expansion-group.component';

// Simple placeholder icons (swap for real SVGs if you have them)
const PaypalIcon = () => <span style={{ fontWeight: 700 }}>PP</span>;
const ApplePayIcon = () => <span style={{ fontWeight: 700 }}>Pay</span>;
const CardIcon = () => <span style={{ fontWeight: 700 }}>💳</span>;

const meta: Meta<typeof GalExpansionPanel> = {
  title: 'Components/GalExpansionPanel',
  component: GalExpansionPanel,
  tags: ['autodocs'],
  args: {
    header: <span>Click to expand</span>,
    children: (
      <p style={{ margin: 0 }}>
        This is some expandable content that can be toggled open and closed.
      </p>
    ),
    defaultExpanded: false,
    disabled: false,
  },
  argTypes: {
    header: {
      control: false, // header is ReactNode now; better demo via stories
      description: 'Header can be any ReactNode (icons, text, layouts).',
    },
    defaultExpanded: {
      control: 'boolean',
      description:
        'Whether the panel is expanded by default (standalone/uncontrolled).',
    },
    expanded: {
      control: 'boolean',
      description:
        'Controlled open state (use with `onExpandedChange`). Ignored in radio group when accordion is on.',
    },
    onExpandedChange: {
      action: 'expandedChange',
      description:
        'Fires when expansion toggles (standalone or non-accordion use).',
    },
    disabled: {
      control: 'boolean',
      description: 'Disables expansion/collapse when true',
    },
    value: {
      control: 'text',
      description:
        'Unique value for identifying the panel within a GalExpansionGroup (radio mode).',
    },
    showGroupRadio: {
      control: 'boolean',
      description:
        'Show the built-in radio when inside a radio-mode group (default true).',
    },
  },
};

export default meta;
type Story = StoryObj<typeof GalExpansionPanel>;

/**
 * Standalone, uncontrolled
 */
export const Default: Story = {};

/**
 * Standalone, initially open (uncontrolled)
 */
export const InitiallyOpen: Story = {
  args: { defaultExpanded: true },
};

/**
 * Standalone, disabled
 */
export const Disabled: Story = {
  args: { disabled: true },
};

/**
 * Standalone, externally controlled via `expanded`/`onExpandedChange`
 */
export const WithExternalControl: Story = {
  render: (args) => {
    const [open, setOpen] = useState(false);
    return (
      <div style={{ width: 420 }}>
        <button
          onClick={() => setOpen((v) => !v)}
          style={{ marginBottom: '1rem', padding: '0.5rem 1rem' }}
        >
          {open ? 'Close externally' : 'Open externally'}
        </button>
        <GalExpansionPanel
          {...args}
          header={<span>Externally controlled panel</span>}
          expanded={open}
          onExpandedChange={(isOpen) => {
            setOpen(isOpen);
            // still surface the action to Storybook’s Actions panel for visibility
            (args as any).onExpandedChange?.(isOpen);
          }}
        />
      </div>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates a controlled panel using `expanded` + `onExpandedChange`.',
      },
    },
  },
};

/**
 * Radio-mode group: typical checkout payment methods
 * The selected panel is the only one expanded.
 */
export const PaymentMethods_RadioGroup: Story = {
  render: () => {
    const [method, setMethod] = useState<string | null>('paypal');

    const HeaderRow = (Icon: React.ComponentType, label: string) => (
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '24px auto',
          gap: 8,
          alignItems: 'center',
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            width: 24,
            justifyContent: 'center',
          }}
        >
          <Icon />
        </span>
        <span>{label}</span>
      </div>
    );

    return (
      <section aria-label="Payment methods" style={{ maxWidth: 520 }}>
        <GalExpansionGroup
          mode="radio"
          value={method}
          onValueChange={setMethod}
          accordion
          name="storybook-payment-methods"
        >
          <GalExpansionPanel
            value="paypal"
            header={HeaderRow(PaypalIcon, 'PayPal')}
          >
            <div style={{ display: 'grid', gap: 8 }}>
              <p style={{ margin: 0 }}>
                You’ll be redirected to PayPal to complete your purchase.
              </p>
              <button type="button" onClick={() => alert('Redirect to PayPal')}>
                Continue to PayPal
              </button>
            </div>
          </GalExpansionPanel>

          <GalExpansionPanel
            value="applepay"
            header={HeaderRow(ApplePayIcon, 'Apple Pay')}
          >
            <div style={{ display: 'grid', gap: 8 }}>
              <p style={{ margin: 0 }}>
                Use Apple Pay on supported devices and browsers.
              </p>
              <button type="button" onClick={() => alert('Trigger Apple Pay')}>
                Pay with Apple Pay
              </button>
            </div>
          </GalExpansionPanel>

          <GalExpansionPanel
            value="card"
            header={HeaderRow(CardIcon, 'Credit / Debit Card')}
          >
            <form
              style={{ display: 'grid', gap: 12 }}
              onSubmit={(e) => {
                e.preventDefault();
                alert('Tokenize & submit card');
              }}
            >
              <label style={{ display: 'grid', gap: 4 }}>
                Card number
                <input
                  inputMode="numeric"
                  autoComplete="cc-number"
                  placeholder="1234 5678 9012 3456"
                />
              </label>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: 12,
                }}
              >
                <label style={{ display: 'grid', gap: 4 }}>
                  Expiry
                  <input
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    placeholder="MM/YY"
                  />
                </label>
                <label style={{ display: 'grid', gap: 4 }}>
                  CVC
                  <input
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    placeholder="CVC"
                  />
                </label>
              </div>
              <button type="submit">Pay now</button>
            </form>
          </GalExpansionPanel>
        </GalExpansionGroup>

        <p style={{ marginTop: 12, fontSize: 12, color: '#666' }}>
          Selected method: <strong>{method}</strong>
        </p>
      </section>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Radio-mode group (accordion). The selected panel is expanded; choosing a different method closes the others.',
      },
    },
  },
};

/**
 * Radio group but hide the built-in radios (for fully custom headers)
 */
export const PaymentMethods_CustomHeaderNoRadio: Story = {
  render: () => {
    const [method, setMethod] = useState<string | null>('applepay');

    const Header = (label: string) => (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          justifyContent: 'space-between',
          width: '100%',
        }}
      >
        <span>{label}</span>
        {/* Example: your own styled "pill" instead of a visible radio */}
        <span
          style={{
            fontSize: 12,
            background: '#f1f1f1',
            padding: '2px 8px',
            borderRadius: 999,
          }}
        >
          Select
        </span>
      </div>
    );

    return (
      <GalExpansionGroup
        mode="radio"
        value={method}
        onValueChange={setMethod}
        accordion
        name="storybook-payment-custom"
      >
        <GalExpansionPanel
          value="paypal"
          header={Header('PayPal')}
          showGroupRadio={false}
        >
          <p style={{ margin: 0 }}>Custom header; built-in radio hidden.</p>
        </GalExpansionPanel>
        <GalExpansionPanel
          value="applepay"
          header={Header('Apple Pay')}
          showGroupRadio={false}
        >
          <p style={{ margin: 0 }}>Custom header; built-in radio hidden.</p>
        </GalExpansionPanel>
        <GalExpansionPanel
          value="card"
          header={Header('Card')}
          showGroupRadio={false}
        >
          <p style={{ margin: 0 }}>Custom header; built-in radio hidden.</p>
        </GalExpansionPanel>
      </GalExpansionGroup>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Demonstrates radio behavior while hiding the built-in radios, so you can fully customize headers.',
      },
    },
  },
};

/**
 * Multiple open panels (no selection behavior)
 */
export const NonAccordion_MultipleOpen: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 12, maxWidth: 520 }}>
      <GalExpansionPanel header={<span>FAQ 1</span>} defaultExpanded>
        <p style={{ margin: 0 }}>Answer 1</p>
      </GalExpansionPanel>
      <GalExpansionPanel header={<span>FAQ 2</span>}>
        <p style={{ margin: 0 }}>Answer 2</p>
      </GalExpansionPanel>
      <GalExpansionPanel header={<span>FAQ 3</span>}>
        <p style={{ margin: 0 }}>Answer 3</p>
      </GalExpansionPanel>
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Panels used without a group behave independently; multiple can be open.',
      },
    },
  },
};
