/**
 * @file CreateProductSections.test.tsx
 */

import React from 'react';
import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import '@testing-library/jest-dom';

// ── 1) MOCK child components ──────────────────────────────────────────────────────────

// 1.1. Mock SectionEditor:
//      - Renders a div showing the section title.
//      - If showRemoveButton is true, renders a “Remove” button that calls onRemoveFromParent(index).
jest.mock('../editors/section-editor/section-editor.component', () => ({
  __esModule: true,
  default: ({
    index,
    sectionData,
    onRemoveFromParent,
    showRemoveButton,
  }: {
    index: number;
    sectionData: { id: string; title: string; description: string };
    onRemoveFromParent: (idx: number) => void;
    showRemoveButton: boolean;
    // (other props omitted)
  }) => (
    <div data-testid={`section-editor-${index}`}>
      <span data-testid={`section-title-${index}`}>{sectionData.title}</span>
      {showRemoveButton && (
        <button
          data-testid={`remove-button-${index}`}
          onClick={() => onRemoveFromParent(index)}
        >
          Remove
        </button>
      )}
    </div>
  ),
}));

// 1.2. Mock Button so that “Add Section” appears as a button with data-testid="btn-add-section"
jest.mock('../../../../components/button/button.component', () => ({
  __esModule: true,
  default: ({
    text,
    onClick,
  }: {
    text: string;
    htmlType: 'button' | 'submit';
    onClick: () => void;
  }) => {
    // Only care about “Add Section”
    const tid = text.replace(/\s+/g, '-').toLowerCase();
    return (
      <button data-testid={`btn-${tid}`} onClick={onClick} type="button">
        {text}
      </button>
    );
  },
}));

// ── 2) Import the component under test ─────────────────────────────────────────────────
import CreateProductSections, {
  NewProductSectionFormData,
} from './create-product-sections.component';

// ── 3) Begin tests ─────────────────────────────────────────────────────────────────────
describe('<CreateProductSections />', () => {
  afterEach(() => {
    cleanup();
  });

  const productId = 'pid-123';
  const productType = 'COURSE' as const;

  function createSections(count: number): NewProductSectionFormData[] {
    return Array.from({ length: count }).map((_, i) => ({
      id: `sec-${i + 1}`,
      title: `Section ${i + 1}`,
      description: `Desc ${i + 1}`,
    }));
  }

  it('renders one SectionEditor and no remove button when there is a single section', () => {
    const initial = createSections(1);

    render(
      <CreateProductSections
        sections={initial}
        productType={productType}
        productId={productId}
      />
    );

    // Exactly one SectionEditor
    const editor0 = screen.getByTestId('section-editor-0');
    expect(editor0).toBeInTheDocument();
    // It should display the correct title
    expect(screen.getByTestId('section-title-0')).toHaveTextContent(
      'Section 1'
    );
    // Because there is only one, showRemoveButton should be false → no remove button
    expect(screen.queryByTestId('remove-button-0')).not.toBeInTheDocument();
  });

  it('renders multiple SectionEditors and shows remove buttons, and removing works', () => {
    const initial = createSections(3);

    render(
      <CreateProductSections
        sections={initial}
        productType={productType}
        productId={productId}
      />
    );

    // Should render three editors: indices 0,1,2
    for (let i = 0; i < 3; i++) {
      expect(screen.getByTestId(`section-editor-${i}`)).toBeInTheDocument();
      expect(screen.getByTestId(`section-title-${i}`)).toHaveTextContent(
        `Section ${i + 1}`
      );
      // Because length > 1, each should have a remove button
      expect(screen.getByTestId(`remove-button-${i}`)).toBeInTheDocument();
    }

    // Click remove-button-1 → should remove Section at index=1
    fireEvent.click(screen.getByTestId('remove-button-1'));

    // Now only indices 0 and 1 exist (old index 2 shifts down to index 1)
    // We must re-check by querying all section-editor-* in the DOM.
    const remainingEditors = screen.queryAllByTestId(/section-editor-/);
    expect(remainingEditors).toHaveLength(2);

    // They should now be at indices 0 and 1.
    // Old index 0 remains “Section 1”
    expect(screen.getByTestId('section-title-0')).toHaveTextContent(
      'Section 1'
    );
    // Old index 2 moved to index 1 -> “Section 3”
    expect(screen.getByTestId('section-title-1')).toHaveTextContent(
      'Section 3'
    );

    // Since there are still 2 sections, both have remove buttons:
    expect(screen.getByTestId('remove-button-0')).toBeInTheDocument();
    expect(screen.getByTestId('remove-button-1')).toBeInTheDocument();
  });

  it('clicking “Add Section” appends a blank section to the list', () => {
    const initial = createSections(2);

    render(
      <CreateProductSections
        sections={initial}
        productType={productType}
        productId={productId}
      />
    );

    // Before clicking, two editors exist
    expect(screen.queryAllByTestId(/section-editor-/)).toHaveLength(2);

    // Click “Add Section”
    fireEvent.click(screen.getByTestId('btn-add-section'));

    // Now there should be three editors: indices 0,1,2
    expect(screen.queryAllByTestId(/section-editor-/)).toHaveLength(3);

    // The new one at index 2 should have empty title
    expect(screen.getByTestId('section-title-2')).toHaveTextContent('');
  });

  it('updates when the sections prop changes from outside', () => {
    const { rerender } = render(
      <CreateProductSections
        sections={createSections(1)}
        productType={productType}
        productId={productId}
      />
    );

    // Initially 1
    expect(screen.queryAllByTestId(/section-editor-/)).toHaveLength(1);

    // Rerender with 4 sections
    rerender(
      <CreateProductSections
        sections={createSections(4)}
        productType={productType}
        productId={productId}
      />
    );

    // Now there should be four SectionEditors: indices 0..3
    expect(screen.queryAllByTestId(/section-editor-/)).toHaveLength(4);
    for (let i = 0; i < 4; i++) {
      expect(screen.getByTestId(`section-title-${i}`)).toHaveTextContent(
        `Section ${i + 1}`
      );
    }
  });
});
