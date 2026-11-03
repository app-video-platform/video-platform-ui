import { act, renderHook, waitFor } from '@testing-library/react';

import { useProductLoader } from './use-product-loader.hooks';

describe('useProductLoader', () => {
  it('loads Membership into shared draft fields without sections', async () => {
    const membership = {
      id: 'membership-1',
      type: 'MEMBERSHIP',
      name: 'Founders Club',
      description: 'Private community',
      price: 25,
      userId: 'creator-1',
      sections: [{ id: 'section-that-should-not-map', title: 'Nope' }],
    };

    const dispatch = jest.fn(() => ({
      unwrap: () => Promise.resolve(membership),
    }));
    const setFormData = jest.fn();
    const setShowRestOfForm = jest.fn();

    renderHook(() =>
      useProductLoader({
        isEditMode: true,
        id: 'membership-1',
        dispatch: dispatch as any,
        setFormData,
        setErrors: jest.fn(),
        setShowRestOfForm,
      }),
    );

    await waitFor(() => {
      expect(setFormData).toHaveBeenCalledWith({
        id: 'membership-1',
        name: 'Founders Club',
        description: 'Private community',
        type: 'MEMBERSHIP',
        price: 25,
        userId: 'creator-1',
      });
    });
    expect(setShowRestOfForm).toHaveBeenCalledWith(true);
  });
});


it('ignores late Product loads after selection changes', async () => {
  // eslint-disable-next-line no-unused-vars
  const completions: Array<(product: unknown) => void> = [];
  const dispatch = jest.fn(() => ({ unwrap: () => new Promise((resolve) => completions.push(resolve)) }));
  const setFormData = jest.fn();
  const setErrors = jest.fn();
  const setShowRestOfForm = jest.fn();
  const { rerender } = renderHook(({ id }) => useProductLoader({
    isEditMode: true, id, dispatch: dispatch as never, setFormData, setErrors, setShowRestOfForm,
  }), { initialProps: { id: 'A' } });
  rerender({ id: 'B' });
  await act(async () => { completions[1]({ id: 'B', type: 'COURSE', name: 'B' }); });
  await act(async () => { completions[0]({ id: 'A', type: 'COURSE', name: 'A' }); });
  expect(setFormData).toHaveBeenCalledTimes(1);
  expect(setFormData).toHaveBeenCalledWith(expect.objectContaining({ id: 'B' }));
});
