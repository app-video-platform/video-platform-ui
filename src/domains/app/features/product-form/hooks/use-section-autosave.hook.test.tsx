import { act, renderHook } from '@testing-library/react';

import { AppDispatch, ProductSectionUpdateRequest, UserRole } from 'core/api/models';
import { SectionDraft } from '../models';
import { useSectionAutosave } from './use-section-autosave.hook';
import { updateProductSection } from 'core/store/product-store';

jest.mock('core/store/product-store', () => ({
  updateProductSection: jest.fn((payload: ProductSectionUpdateRequest) => ({
    type: 'updateSection',
    payload,
  })),
}));

describe('useSectionAutosave', () => {
  it('keeps section position out of debounced detail autosaves', async () => {
    const dispatch = jest.fn(() => ({ unwrap: () => Promise.resolve() }));
    const user = {
      id: 'creator-1',
      firstName: 'Creator',
      lastName: 'One',
      email: 'creator@example.com',
      roles: [UserRole.CREATOR],
    };
    const initial: SectionDraft = {
      id: 'section-1',
      title: 'Section',
      description: 'Description',
      position: 1,
      lessons: [],
      files: [],
    };

    const { result, rerender } = renderHook(
      ({ section }: { section: SectionDraft }) => useSectionAutosave({
        section,
        productId: 'course-1',
        user,
        dispatch: dispatch as unknown as AppDispatch,
      }),
      { initialProps: { section: initial } },
    );

    rerender({ section: { ...initial, position: 2 } });
    await act(async () => result.current.flush());
    expect(dispatch).not.toHaveBeenCalled();

    rerender({ section: { ...initial, position: 2, title: 'Updated section' } });
    await act(async () => result.current.flush());
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(updateProductSection).toHaveBeenCalledWith({
      productId: 'course-1',
      sectionId: 'section-1',
      title: 'Updated section',
      description: 'Description',
    });
  });
});
