import { useEffect, useRef, useState } from 'react';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

interface UseGlobalSaveStatusOptions {
  minSavingMs?: number; // minimum time to show "Saving..."
  savedVisibleMs?: number; // how long to show "Saved"
}

/**
 * isSaving: global loading flag from your state
 * hasError: optional flag from your state (any save error)
 */
export function useGlobalSaveStatus(
  isSaving: boolean,
  hasError = false,
  options: UseGlobalSaveStatusOptions = {},
): SaveStatus {
  const { minSavingMs = 200, savedVisibleMs = 3000 } = options;

  const [status, setStatus] = useState<SaveStatus>('idle');

  const savingStartedAtRef = useRef<number | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevIsSavingRef = useRef<boolean>(false);

  const clearTimers = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  };

  useEffect(
    () =>
      // Clean up on dependency change / unmount
      () => {
        clearTimers();
      },
    [],
  );

  useEffect(() => {
    clearTimers();

    const prevIsSaving = prevIsSavingRef.current;

    // --- 1. Transition: not saving -> saving
    if (isSaving) {
      // we just entered saving
      setStatus('saving');
      savingStartedAtRef.current = Date.now();
    } else {
      // --- 2. We are NOT saving now

      if (hasError) {
        // Any error trumps "saved" state
        setStatus('error');
      } else if (prevIsSaving) {
        // We just transitioned from saving -> not saving without error
        const startedAt = savingStartedAtRef.current ?? Date.now();
        const elapsed = Date.now() - startedAt;
        const extraDelay = elapsed < minSavingMs ? minSavingMs - elapsed : 0;

        // Ensure "Saving..." is visible for at least minSavingMs
        timeoutRef.current = setTimeout(() => {
          setStatus('saved');

          // Then after some time, go back to idle
          timeoutRef.current = setTimeout(() => {
            setStatus('idle');
          }, savedVisibleMs);
        }, extraDelay);
      }
    }

    prevIsSavingRef.current = isSaving;
  }, [isSaving, hasError, minSavingMs, savedVisibleMs]);

  return status;
}
