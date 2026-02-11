/**
 * @file CreateProductSections.test.tsx
 */

import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// ── 1) MOCK SectionEditor with UPDATED PROPS ────────────────────────────────
jest.mock('../editors/section-editor/section-editor.component', () => ({
  __esModule: true,
  default: ({
    index,
    section,
    onRemove,
    showRemoveButton,
  }: {
    index: number;
    section: { id: string; title: string; description?: string };
    onRemove: (idx: number) => void;
    showRemoveButton: boolean;
  }) => (
    <div data-testid={`section-editor-${index}`}>
      <span data-testid={`section-title-${index}`}>{section.title}</span>
      {showRemoveButton && (
        <button
          data-testid={`remove-button-${index}`}
          onClick={() => onRemove(index)}
        >
          Remove
        </button>
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
}));

// ── 3) IMPORT component + type under test ───────────────────────────────────
import CreateProductSections from './create-product-sections.component';
import { SectionDraft } from '../models';

// ── 4) Tests ────────────────────────────────────────────────────────────────
describe('<CreateProductSections />', () => {
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

  it('renders multiple SectionEditors and shows remove buttons, and removing calls onSectionsChange with updated list', () => {
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

    expect(onSectionsChange).toHaveBeenCalledTimes(1);
    const updated = onSectionsChange.mock.calls[0][0] as SectionDraft[];

    expect(updated).toHaveLength(2);
    expect(updated[0].title).toBe('Section 1');
    expect(updated[1].title).toBe('Section 3');
  });

  it('clicking “Add Section” calls onSectionsChange with an appended blank section', () => {
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

    fireEvent.click(screen.getByTestId('btn-add-section'));

    expect(onSectionsChange).toHaveBeenCalledTimes(1);
    const updated = onSectionsChange.mock.calls[0][0] as SectionDraft[];

    expect(updated).toHaveLength(3);
    expect(updated[0].title).toBe('Section 1');
    expect(updated[1].title).toBe('Section 2');

    const newSection = updated[2];
    expect(newSection.id).toBe('');
    expect(newSection.title).toBe('');
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
});
