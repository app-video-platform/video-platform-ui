/**
 * @file CreateProductSections.test.tsx
 */

import React from 'react';
import {
  render,
  screen,
  fireEvent,
  cleanup,
  waitFor,
} from '@testing-library/react';
import '@testing-library/jest-dom';

// ── 1) MOCK SectionEditor with UPDATED PROPS ────────────────────────────────
const mockDispatch = jest.fn();
const mockUpdateProductSection = jest.fn((payload: {
  productId: string;
  sectionId: string;
  position: number;
}) => ({ type: 'updateSection', payload }));

jest.mock('core/store/product-store', () => ({
  createProductSection: (payload: unknown) => ({ type: 'createSection', payload }),
  deleteProductSection: (payload: unknown) => ({ type: 'deleteSection', payload }),
  updateProductSection: (payload: {
    productId: string;
    sectionId: string;
    position: number;
  }) => mockUpdateProductSection(payload),
}));

jest.mock('../editors/section-editor/section-editor.component', () => ({
  __esModule: true,
  default: ({
    index,
    section,
    showRemoveButton,
    onRequestDelete,
    onConfirmDelete,
    onMoveUp,
    onMoveDown,
  }: {
    index: number;
    section: { id: string; title: string; description?: string };
    onRequestDelete?: () => void;
    onConfirmDelete?: () => void;
    onMoveUp?: () => void;
    onMoveDown?: () => void;
    showRemoveButton: boolean;
  }) => (
    <div data-testid={`section-editor-${index}`}>
      <span data-testid={`section-title-${index}`}>{section.title}</span>
      <button type="button" aria-label={`Move ${section.title} up`} onClick={onMoveUp}>Up</button>
      <button type="button" aria-label={`Move ${section.title} down`} onClick={onMoveDown}>Down</button>
      {showRemoveButton && (
        <>
          <button
            data-testid={`remove-button-${index}`}
            onClick={onRequestDelete}
          >
            Delete
          </button>
          <button
            data-testid={`confirm-remove-button-${index}`}
            onClick={onConfirmDelete}
          >
            Confirm delete
          </button>
        </>
      )}
    </div>
  ),
}));

// ── 2) MOCK @shared/ui Button ───────────────────────────────────────────────
jest.mock('@shared/ui', () => ({
  __esModule: true,
  Button: ({
    children,
    onClick,
    type,
    variant,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    type?: 'button' | 'submit';
    variant?: string;
  }) => {
    const label = typeof children === 'string' ? children : 'button';
    const tid = `btn-${label.replace(/\s+/g, '-').toLowerCase()}`;
    return (
      <button
        data-testid={tid}
        type={type ?? 'button'}
        onClick={onClick}
        data-variant={variant}
      >
        {children}
      </button>
    );
  },
  Icon: () => <span data-testid="icon" />,
  Input: ({ label, value, onChange, error }: any) => (
    <label>
      {label}
      <input value={value} onChange={onChange} aria-invalid={!!error} />
    </label>
  ),
  Textarea: ({ label, value, onChange }: any) => (
    <label>
      {label}
      <textarea value={value} onChange={onChange} />
    </label>
  ),
}));

jest.mock('react-redux', () => ({
  __esModule: true,
  useDispatch: () => mockDispatch,
  useSelector: () => ({ id: 'creator-1' }),
}));

// ── 3) IMPORT component + type under test ───────────────────────────────────
import CreateProductSections from './create-product-sections.component';
import { SectionDraft } from '../models';

// ── 4) Tests ────────────────────────────────────────────────────────────────
describe('<CreateProductSections />', () => {
  beforeEach(() => {
    mockDispatch.mockReset();
    mockUpdateProductSection.mockClear();
    mockDispatch.mockImplementation(() => ({
      unwrap: () => Promise.resolve({
        id: 'created-section',
        title: 'Created section',
        description: '',
        position: 1,
        lessons: [],
        files: [],
      }),
    }));
  });

  afterEach(() => {
    cleanup();
  });

  const productId = 'pid-123';
  const productType = 'COURSE' as const;

  function createSections(count: number): SectionDraft[] {
    return Array.from({ length: count }).map((_, i) => ({
      id: `sec-${i + 1}`,
      title: `Section ${i + 1}`,
      description: `Desc ${i + 1}`,
      position: i + 1, // ✅ always a number
      lessons: [],
      files: [],
    }));
  }

  it('renders one SectionEditor and no remove button when there is a single section', () => {
    const initial = createSections(1);
    const onSectionsChange = jest.fn();

    render(
      <CreateProductSections
        sections={initial}
        productType={productType}
        productId={productId}
        onSectionsChange={onSectionsChange}
      />,
    );

    const editor0 = screen.getByTestId('section-editor-0');
    expect(editor0).toBeInTheDocument();
    expect(screen.getByTestId('section-title-0')).toHaveTextContent(
      'Section 1',
    );
    expect(screen.queryByTestId('remove-button-0')).not.toBeInTheDocument();
  });

  it('renders multiple SectionEditors and shows remove buttons, and confirmed deletion calls onSectionsChange with updated list', async () => {
    const initial = createSections(3);
    const onSectionsChange = jest.fn();

    render(
      <CreateProductSections
        sections={initial}
        productType={productType}
        productId={productId}
        onSectionsChange={onSectionsChange}
      />,
    );

    for (let i = 0; i < 3; i++) {
      expect(screen.getByTestId(`section-editor-${i}`)).toBeInTheDocument();
      expect(screen.getByTestId(`section-title-${i}`)).toHaveTextContent(
        `Section ${i + 1}`,
      );
      expect(screen.getByTestId(`remove-button-${i}`)).toBeInTheDocument();
    }

    fireEvent.click(screen.getByTestId('remove-button-1'));
    fireEvent.click(screen.getByTestId('confirm-remove-button-1'));

    await waitFor(() => expect(onSectionsChange).toHaveBeenCalledTimes(1));
    const updated = onSectionsChange.mock.calls[0][0] as SectionDraft[];

    expect(updated).toHaveLength(2);
    expect(updated[0].title).toBe('Section 1');
    expect(updated[1].title).toBe('Section 3');
  });

  it('creates a section explicitly before adding it to the controlled list', async () => {
    const initial = createSections(2);
    const onSectionsChange = jest.fn();

    render(
      <CreateProductSections
        sections={initial}
        productType={productType}
        productId={productId}
        onSectionsChange={onSectionsChange}
      />,
    );

    expect(screen.queryAllByTestId(/section-editor-/)).toHaveLength(2);

    fireEvent.click(screen.getByRole('button', { name: /add section/i }));
    fireEvent.change(screen.getByLabelText('Section title'), {
      target: { value: 'Created section' },
    });
    fireEvent.click(screen.getByRole('button', { name: /create section/i }));

    await waitFor(() => expect(onSectionsChange).toHaveBeenCalledTimes(1));
    const updated = onSectionsChange.mock.calls[0][0] as SectionDraft[];

    expect(updated).toHaveLength(3);
    expect(updated[0].title).toBe('Section 1');
    expect(updated[1].title).toBe('Section 2');

    const newSection = updated[2];
    expect(newSection.id).toBe('created-section');
    expect(newSection.title).toBe('Created section');
    expect(newSection.description).toBe('');
    expect(newSection.position).toBe(3);
  });

  it('updates rendered editors when the sections prop changes from outside', () => {
    const onSectionsChange = jest.fn();

    const { rerender } = render(
      <CreateProductSections
        sections={createSections(1)}
        productType={productType}
        productId={productId}
        onSectionsChange={onSectionsChange}
      />,
    );

    expect(screen.queryAllByTestId(/section-editor-/)).toHaveLength(1);

    rerender(
      <CreateProductSections
        sections={createSections(4)}
        productType={productType}
        productId={productId}
        onSectionsChange={onSectionsChange}
      />,
    );

    expect(screen.queryAllByTestId(/section-editor-/)).toHaveLength(4);
    for (let i = 0; i < 4; i++) {
      expect(screen.getByTestId(`section-title-${i}`)).toHaveTextContent(
        `Section ${i + 1}`,
      );
    }
  });

  it.each([
    ['COURSE', 'Could not save section order.'],
    ['DOWNLOAD', 'Could not save file group order.'],
  ] as const)('clears a %s reorder failure only after a successful complete retry', async (type, errorMessage) => {
    const initial = createSections(3);
    const onSectionsChange = jest.fn();
    let request = 0;
    mockDispatch.mockImplementation(() => {
      const currentRequest = request++;
      return {
        unwrap: () => currentRequest === 1
          ? Promise.reject(new Error('503'))
          : Promise.resolve({}),
      };
    });

    render(
      <CreateProductSections
        sections={initial}
        productType={type}
        productId={productId}
        onSectionsChange={onSectionsChange}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Move Section 3 up' }));
    expect(onSectionsChange).toHaveBeenCalledTimes(1);
    expect(await screen.findByRole('alert')).toHaveTextContent(errorMessage);
    await waitFor(() => expect(mockDispatch).toHaveBeenCalledTimes(3));
    expect(mockUpdateProductSection.mock.calls.slice(0, 3).map(([payload]) => payload))
      .toEqual([
        { productId, sectionId: 'sec-1', position: 1 },
        { productId, sectionId: 'sec-3', position: 2 },
        { productId, sectionId: 'sec-2', position: 3 },
      ]);

    fireEvent.click(screen.getByRole('button', { name: 'Retry order save' }));
    await waitFor(() => expect(screen.queryByText(errorMessage)).not.toBeInTheDocument());
    expect(mockDispatch).toHaveBeenCalledTimes(6);
  });

  it('serializes overlapping reorder saves and keeps partial failures visible', async () => {
    const initial = createSections(3);
    const pending: Array<() => void> = [];
    let request = 0;
    mockDispatch.mockImplementation(() => ({
      unwrap: () => new Promise<void>((resolve, reject) => {
        const currentRequest = request++;
        pending.push(() => (currentRequest === 1 ? reject(new Error('503')) : resolve()));
      }),
    }));

    render(
      <CreateProductSections
        sections={initial}
        productType="DOWNLOAD"
        productId={productId}
        onSectionsChange={jest.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: 'Move Section 3 up' }));
    fireEvent.click(screen.getByRole('button', { name: 'Move Section 3 up' }));
    await waitFor(() => expect(mockDispatch).toHaveBeenCalledTimes(3));

    pending.splice(0).forEach((resolve) => resolve());
    await waitFor(() => expect(mockDispatch).toHaveBeenCalledTimes(6));
    pending.splice(0).forEach((resolve) => resolve());
    await waitFor(() => expect(screen.queryByRole('status')).not.toBeInTheDocument());
    expect(screen.queryByRole('alert')).toBeNull();
  });
});
