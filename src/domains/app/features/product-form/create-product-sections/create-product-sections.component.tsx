import React from 'react';

import { ProductType } from 'core/api/models';
import { Button } from '@shared/ui';
import SectionEditor from '../editors/section-editor/section-editor.component';
import { SectionDraft } from '../models';

import './create-product-sections.styles.scss';

interface CreateProductSectionsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sections: SectionDraft[];
  productType: ProductType;
  productId: string;
  // eslint-disable-next-line no-unused-vars
  onSectionsChange: (sections: SectionDraft[]) => void;
}

const CreateProductSections: React.FC<CreateProductSectionsProps> = ({
  sections,
  productType,
  productId,
  onSectionsChange,
}) => {
  const handleRemoveSection = (index: number) => {
    const updated = sections.filter(
      (_: SectionDraft, i: number) => i !== index,
    );
    onSectionsChange(updated);
  };

  const handleSectionChange = (index: number, nextSection: SectionDraft) => {
    const updated = sections.map((section: SectionDraft, i: number) =>
      i === index ? nextSection : section,
    );
    onSectionsChange(updated);
  };

  const handleAddSection = () => {
    const blank: SectionDraft = {
      id: '',
      title: '',
      description: '',
      position: sections.length + 1,
      lessons: [],
      files: [],
    };

    onSectionsChange([...(sections || []), blank]);
  };

  return (
    <div className="sections-wrapper">
      {sections.map((sectionData: SectionDraft, index: number) => (
        <SectionEditor
          key={sectionData.id || index}
          index={index}
          section={sectionData}
          productType={productType}
          showRemoveButton={sections.length > 1}
          productId={productId}
          onRemove={handleRemoveSection}
          onChange={handleSectionChange}
        />
      ))}

      <Button type="button" variant="secondary" onClick={handleAddSection}>
        Add Section
      </Button>
    </div>
  );
};

export default CreateProductSections;
