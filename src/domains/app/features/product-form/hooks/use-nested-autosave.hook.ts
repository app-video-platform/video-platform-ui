import { useCallback, useContext, useEffect, useLayoutEffect, useRef, useState } from 'react';

import { NestedAutosaveContext } from './nested-autosave-context';

// eslint-disable-next-line no-unused-vars
export const useNestedAutosave = <T,>(snapshot: T, enabled: boolean, save: (value: T) => Promise<unknown>) => {
  const registry = useContext(NestedAutosaveContext);
  const latest = useRef({ snapshot, enabled, save });
  const saved = useRef(JSON.stringify(snapshot));
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const inFlight = useRef<Promise<void> | null>(null);
  const mounted = useRef(true);
  const [isAutosaving, setIsAutosaving] = useState(false);
  const [lastSavedAt, setLastSavedAt] = useState<Date | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const clearTimer = useCallback(() => {
    if (timer.current !== null) {clearTimeout(timer.current);}
    timer.current = null;
  }, []);
  useLayoutEffect(() => { latest.current = { snapshot, enabled, save }; });
  const hasPending = useCallback(() => Boolean(inFlight.current) || saved.current !== JSON.stringify(latest.current.snapshot), []);
  const flush = useCallback(async (): Promise<void> => {
    clearTimer();
    if (inFlight.current) {
      await inFlight.current;
      return flush();
    }
    if (saved.current === JSON.stringify(latest.current.snapshot)) {return;}
    if (!latest.current.enabled) {throw new Error('Your session must recover before changes can be saved.');}
    const value = latest.current.snapshot;
    const serialized = JSON.stringify(value);
    if (mounted.current) { setIsAutosaving(true); setSaveError(null); }
    const request = (async () => {
      try {
        await latest.current.save(value);
        saved.current = serialized;
        if (mounted.current) {setLastSavedAt(new Date());}
      } catch (error) {
        if (mounted.current) {setSaveError('Changes could not be saved. Retry before leaving this workspace.');}
        throw error;
      } finally {
        inFlight.current = null;
        if (mounted.current) {setIsAutosaving(false);}
      }
    })();
    inFlight.current = request;
    await request;
    // A newer edit arrived while the previous revision was saving.
    if (mounted.current && saved.current !== JSON.stringify(latest.current.snapshot)) {await flush();}
  }, [clearTimer]);
  useLayoutEffect(() => {
    mounted.current = true;
    const entry = { flush, hasPending };
    registry?.add(entry);
    return () => { mounted.current = false; clearTimer(); registry?.delete(entry); };
  }, [registry, flush, hasPending, clearTimer]);
  const serialized = JSON.stringify(snapshot);
  useEffect(() => {
    clearTimer();
    if (enabled && saved.current !== serialized) {
      timer.current = setTimeout(() => { void flush().catch(() => { /* Error remains visible and dirty state is retained. */ }); }, 2000);
    }
    return clearTimer;
  }, [serialized, enabled, clearTimer, flush]);
  return { isAutosaving: isAutosaving || (enabled && saved.current !== serialized && !saveError), lastSavedAt, saveError, flush, hasPending };
};
