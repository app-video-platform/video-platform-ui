import React from 'react';
import { act, renderHook } from '@testing-library/react';

import { useNestedAutosave } from './use-nested-autosave.hook';
import { NestedAutosaveContext, flushNestedSaves, PendingNestedSave } from './nested-autosave-context';

const deferred = () => {
  let resolve!: () => void;
  // eslint-disable-next-line no-unused-vars
  let reject!: (error: Error) => void;
  const promise = new Promise<void>((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
};

describe('nested autosave revisions and navigation flush', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('does not save initial content; flushes a scheduled edit only once', async () => {
    const save = jest.fn().mockResolvedValue(undefined);
    const { result, rerender } = renderHook(({ value }) => useNestedAutosave(value, true, save), { initialProps: { value: 'A' } });
    await act(async () => { jest.advanceTimersByTime(3000); });
    expect(save).not.toHaveBeenCalled();
    rerender({ value: 'B' });
    await act(async () => { await Promise.all([result.current.flush(), result.current.flush()]); jest.advanceTimersByTime(3000); });
    expect(save).toHaveBeenCalledTimes(1);
    expect(save).toHaveBeenCalledWith('B');
    expect(result.current.hasPending()).toBe(false);
  });

  it('serializes newer edits after an in-flight save and waits for both', async () => {
    const first = deferred();
    const second = deferred();
    const save = jest.fn().mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
    const { result, rerender } = renderHook(({ value }) => useNestedAutosave(value, true, save), { initialProps: { value: 'A' } });
    rerender({ value: 'B' });
    let flush!: Promise<void>;
    act(() => { flush = result.current.flush(); });
    rerender({ value: 'C' });
    expect(save).toHaveBeenCalledTimes(1);
    await act(async () => { first.resolve(); await first.promise; });
    expect(save.mock.calls.map(([value]) => value)).toEqual(['B', 'C']);
    expect(result.current.hasPending()).toBe(true);
    await act(async () => { second.resolve(); await flush; });
    expect(result.current.hasPending()).toBe(false);
  });

  it('rejects navigation, preserves dirty content and supports deliberate retry', async () => {
    const registry = new Set<PendingNestedSave>();
    const save = jest.fn().mockRejectedValueOnce(new Error('503')).mockResolvedValue(undefined);
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NestedAutosaveContext.Provider value={registry}>{children}</NestedAutosaveContext.Provider>
    );
    const { result, rerender } = renderHook(({ value }) => useNestedAutosave(value, true, save), { initialProps: { value: 'A' }, wrapper });
    rerender({ value: 'B' });
    await act(async () => { await expect(flushNestedSaves(registry)).rejects.toThrow('503'); });
    expect(result.current.hasPending()).toBe(true);
    expect(result.current.saveError).toMatch(/Retry/);
    await act(async () => { jest.advanceTimersByTime(10000); });
    expect(save).toHaveBeenCalledTimes(1);
    await act(async () => { await flushNestedSaves(registry); });
    expect(save).toHaveBeenCalledTimes(2);
    expect(save).toHaveBeenLastCalledWith('B');
    expect(result.current.hasPending()).toBe(false);
  });

  it('preserves a pending revision during recoverable session interruption', async () => {
    const save = jest.fn().mockResolvedValue(undefined);
    const { result, rerender } = renderHook(
      ({ value, enabled }) => useNestedAutosave(value, enabled, save),
      { initialProps: { value: 'A', enabled: true } },
    );
    rerender({ value: 'B', enabled: false });
    await act(async () => { await expect(result.current.flush()).rejects.toThrow(/session/); jest.advanceTimersByTime(3000); });
    expect(save).not.toHaveBeenCalled();
    rerender({ value: 'B', enabled: true });
    await act(async () => { await result.current.flush(); });
    expect(save).toHaveBeenCalledWith('B');
  });

  it('rechecks fast entities edited while a slower sibling is still saving', async () => {
    const slow = deferred();
    const registry = new Set<PendingNestedSave>();
    const fastSave = jest.fn().mockResolvedValue(undefined);
    const slowSave = jest.fn().mockReturnValue(slow.promise);
    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <NestedAutosaveContext.Provider value={registry}>{children}</NestedAutosaveContext.Provider>
    );
    const { rerender } = renderHook(({ first, second }) => {
      useNestedAutosave(first, true, fastSave);
      useNestedAutosave(second, true, slowSave);
    }, { initialProps: { first: 'A', second: 'A' }, wrapper });
    rerender({ first: 'B', second: 'B' });
    let navigation!: Promise<void>;
    await act(async () => { navigation = flushNestedSaves(registry); });
    rerender({ first: 'C', second: 'B' });
    await act(async () => { slow.resolve(); await navigation; });
    expect(fastSave.mock.calls.map(([value]) => value)).toEqual(['B', 'C']);
  });
});
