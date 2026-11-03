import { createContext, useMemo } from 'react';

export interface PendingNestedSave {
  flush: () => Promise<void>;
  hasPending: () => boolean;
}

// The workspace owns navigation; the existing entity hooks still own persistence.
export const NestedAutosaveContext = createContext<Set<PendingNestedSave> | null>(null);
export const useNestedAutosaveRegistry = () => useMemo(() => new Set<PendingNestedSave>(), []);
export const flushNestedSaves = async (entries: Set<PendingNestedSave>) => {
  do {
    await Promise.all(Array.from(entries, (entry) => entry.flush()));
    // Another entity can be edited while a slower sibling is still saving.
  } while (Array.from(entries).some((entry) => entry.hasPending()));
};
