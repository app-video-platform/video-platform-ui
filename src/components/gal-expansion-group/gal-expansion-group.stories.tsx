// GalExpansionGroup.stories.tsx
import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react-webpack5';
import GalExpansionGroup from './gal-expansion-group.component';
import GalExpansionPanel from './gal-expansion-panel/gal-expansion-panel.component';

// Simple placeholder icons (swap for real assets)
const PaypalIcon = () => <span style={{ fontWeight: 700 }}>PP</span>;
const ApplePayIcon = () => <span style={{ fontWeight: 700 }}>Pay</span>;
const CardIcon = () => <span style={{ fontWeight: 700 }}>💳</span>;

const meta: Meta<typeof GalExpansionGroup> = {
  title: 'Components/GalExpansionGroup',
  component: GalExpansionGroup,
  tags: ['autodocs'],
  args: {
    mode: 'radio',
    accordion: true,
    name: 'storybook-group',
  },
  argTypes: {
    mode: {
      control: { type: 'radio' },
      options: ['none', 'radio'],
      description: 'Selection behavior. `radio` enforces one selected item.',
    },
    accordion: {
      control: 'boolean',
      description:
        'When true in radio mode, only the selected panel is expanded.',
    },
    value: {
      control: 'text',
      description:
        'Controlled selected value (radio mode). Use with `onValueChange`.',
    },
    defaultValue: {
      control: 'text',
      description:
        'Uncontrolled initial selected value (radio mode). Ignored if `value` is set.',
    },
    onValueChange: {
      action: 'valueChange',
      description: 'Fires when the selected value changes (radio mode).',
    },
    name: {
      control: 'text',
      description:
        'Optional radio name. Auto-generated if omitted (useful for forms).',
    },
    children: {
      control: false,
    },
  },
};

export default meta;
type Story = StoryObj<typeof GalExpansionGroup>;

// Helpers
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
      style={{ display: 'inline-flex', width: 24, justifyContent: 'center' }}
    >
      <Icon />
    </span>
    <span>{label}</span>
  </div>
);

/**
 * Uncontrolled radio group using `defaultValue`.
 */
export const Radio_Uncontrolled: Story = {
  args: {
    mode: 'radio',
    defaultValue: 'paypal',
    accordion: true,
    name: 'group-uncontrolled',
  },
  render: (args) => (
    <section aria-label="Payment methods" style={{ maxWidth: 520 }}>
      <GalExpansionGroup {...args}>
        <GalExpansionPanel
          value="paypal"
          header={HeaderRow(PaypalIcon, 'PayPal')}
        >
          <div style={{ display: 'grid', gap: 8 }}>
            <p style={{ margin: 0 }}>
              Redirect to PayPal to complete purchase.
            </p>
            <button type="button" onClick={() => alert('Continue to PayPal')}>
              Continue to PayPal
            </button>
          </div>
        </GalExpansionPanel>

        <GalExpansionPanel
          value="applepay"
          header={HeaderRow(ApplePayIcon, 'Apple Pay')}
        >
          <div style={{ display: 'grid', gap: 8 }}>
            <p style={{ margin: 0 }}>Use Apple Pay on supported devices.</p>
            <button type="button" onClick={() => alert('Apple Pay flow')}>
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
    </section>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Uncontrolled radio group: selection managed internally via `defaultValue`. Only the selected panel is expanded (accordion).',
      },
    },
  },
};

/**
 * Controlled radio group using `value` + `onValueChange`.
 */
export const Radio_Controlled: Story = {
  args: {
    mode: 'radio',
    accordion: true,
    name: 'group-controlled',
  },
  render: (args) => {
    const [method, setMethod] = useState<string | null>('applepay');
    return (
      <section aria-label="Payment methods" style={{ maxWidth: 520 }}>
        <GalExpansionGroup
          {...args}
          value={method}
          onValueChange={(v) => {
            setMethod(v);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (args as any).onValueChange?.(v);
          }}
        >
          <GalExpansionPanel
            value="paypal"
            header={HeaderRow(PaypalIcon, 'PayPal')}
          >
            <p style={{ margin: 0 }}>Redirect to PayPal.</p>
          </GalExpansionPanel>
          <GalExpansionPanel
            value="applepay"
            header={HeaderRow(ApplePayIcon, 'Apple Pay')}
          >
            <p style={{ margin: 0 }}>Apple Pay details…</p>
          </GalExpansionPanel>
          <GalExpansionPanel
            value="card"
            header={HeaderRow(CardIcon, 'Credit / Debit Card')}
          >
            <p style={{ margin: 0 }}>Card form goes here…</p>
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
          'Controlled radio group: external state drives selection via `value` + `onValueChange`.',
      },
    },
  },
};

/**
 * Radio group with built-in radios hidden for fully custom headers.
 */
export const Radio_CustomHeaders_NoBuiltInRadios: Story = {
  args: {
    mode: 'radio',
    accordion: true,
  },
  render: (args) => {
    const [method, setMethod] = useState<string | null>('card');

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
        {...args}
        value={method}
        onValueChange={setMethod}
        name="group-custom-no-radio"
      >
        <GalExpansionPanel
          value="paypal"
          header={Header('PayPal')}
          showGroupRadio={false}
        >
          <p style={{ margin: 0 }}>Custom header, radio hidden.</p>
        </GalExpansionPanel>
        <GalExpansionPanel
          value="applepay"
          header={Header('Apple Pay')}
          showGroupRadio={false}
        >
          <p style={{ margin: 0 }}>Custom header, radio hidden.</p>
        </GalExpansionPanel>
        <GalExpansionPanel
          value="card"
          header={Header('Credit / Debit Card')}
          showGroupRadio={false}
        >
          <p style={{ margin: 0 }}>Custom header, radio hidden.</p>
        </GalExpansionPanel>
      </GalExpansionGroup>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Use `showGroupRadio={false}` to hide built-in radios and fully control header visuals.',
      },
    },
  },
};

/**
 * Non-accordion behavior example:
 * - mode="radio" but accordion=false => multiple panels can stay open,
 *   though selection still tracks which is "chosen".
 * - Or set mode="none" to remove selection semantics entirely.
 */
export const Radio_NonAccordion: Story = {
  args: {
    mode: 'radio',
    accordion: false,
    name: 'group-non-accordion',
  },
  render: (args) => {
    const [selected, setSelected] = useState<string | null>('paypal');
    return (
      <GalExpansionGroup {...args} value={selected} onValueChange={setSelected}>
        <GalExpansionPanel value="paypal" header={<span>PayPal</span>}>
          <p style={{ margin: 0 }}>
            This can stay open even when another is opened.
          </p>
        </GalExpansionPanel>
        <GalExpansionPanel value="applepay" header={<span>Apple Pay</span>}>
          <p style={{ margin: 0 }}>Multiple open panels at once.</p>
        </GalExpansionPanel>
        <GalExpansionPanel value="card" header={<span>Card</span>}>
          <p style={{ margin: 0 }}>Selection still tracks the chosen one.</p>
        </GalExpansionPanel>
      </GalExpansionGroup>
    );
  },
  parameters: {
    docs: {
      description: {
        story:
          'Radio mode without accordion: selection and expansion are decoupled—multiple panels can remain open.',
      },
    },
  },
};

/**
 * No selection semantics at all (mode="none").
 */
export const NoneMode_IndependentPanels: Story = {
  args: {
    mode: 'none',
  },
  render: (args) => (
    <GalExpansionGroup {...args}>
      <GalExpansionPanel header={<span>FAQ 1</span>} defaultExpanded>
        <p style={{ margin: 0 }}>Answer 1</p>
      </GalExpansionPanel>
      <GalExpansionPanel header={<span>FAQ 2</span>}>
        <p style={{ margin: 0 }}>Answer 2</p>
      </GalExpansionPanel>
      <GalExpansionPanel header={<span>FAQ 3</span>}>
        <p style={{ margin: 0 }}>Answer 3</p>
      </GalExpansionPanel>
    </GalExpansionGroup>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'Selection disabled. Panels behave independently; manage open state per panel (un/controlled).',
      },
    },
  },
};
