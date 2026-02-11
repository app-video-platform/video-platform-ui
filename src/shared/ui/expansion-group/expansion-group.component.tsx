import React, { createContext, useContext, useId, useMemo } from 'react';

import './expansion-group.styles.scss';

type SelectionMode = 'none' | 'radio';

interface GroupContextValue {
  name: string;
  mode: SelectionMode;
  selectedValue: string | null;
  onChangeSelected: (next: string) => void;
  // In radio mode with accordion, the selected is the only expanded
  accordion: boolean;
}

const ExpansionGroupCtx = createContext<GroupContextValue | null>(null);

interface ExpansionGroupProps {
  /** Radio vs. no selection behavior */
  mode?: SelectionMode;
  /** Controlled selected value (radio mode) */
  value?: string | null;
  /** Uncontrolled selected value (radio mode) */
  defaultValue?: string | null;
  /** Change handler for selected value */
  onValueChange?: (val: string) => void;
  /** In radio mode, only selected panel is expanded */
  accordion?: boolean;
  /** Optional radio name, otherwise auto-generated */
  name?: string;
  children: React.ReactNode;
}

const ExpansionGroup: React.FC<ExpansionGroupProps> = ({
  mode = 'none',
  value,
  defaultValue = null,
  onValueChange,
  accordion = true,
  name,
  children,
}) => {
  const autoName = useId().replace(/:/g, '');
  const [uncontrolled, setUncontrolled] = React.useState<string | null>(
    defaultValue,
  );

  const isControlled = value !== undefined;
  const selectedValue = isControlled ? value! : uncontrolled;

  const onChangeSelected = (next: string) => {
    if (onValueChange) {
      onValueChange(next);
    }
    if (!isControlled) {
      setUncontrolled(next);
    }
  };

  const ctx = useMemo<GroupContextValue>(
    () => ({
      name: name ?? `expansion-${autoName}`,
      mode,
      selectedValue,
      onChangeSelected,
      accordion,
    }),
    [name, autoName, mode, selectedValue, accordion],
  );

  return (
    <ExpansionGroupCtx.Provider value={ctx}>
      <div role={mode === 'radio' ? 'radiogroup' : undefined}>{children}</div>
    </ExpansionGroupCtx.Provider>
  );
};

export const useExpansionGroup = () => useContext(ExpansionGroupCtx);

export default ExpansionGroup;
