import React, { useEffect, useState } from 'react';

import GalButton from '../../../../../components/gal-button/gal-button.component';
import SectionEditor from '../editors/section-editor/section-editor.component';
import { ProductType } from '../../../../../api/models/product/product.types';

import './create-product-sections.styles.scss';

interface CreateProductSectionsProps {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  sections: any[];
  productType: ProductType;
  productId: string;
}

export interface NewProductSectionFormData {
  id: string; // Initially empty, will be set after product creation
  title: string;
  description: string;
}

const CreateProductSections: React.FC<CreateProductSectionsProps> = ({
  sections,
  productType,
  productId,
}) => {
  const [formDataList, setFormDataList] = useState<NewProductSectionFormData[]>(
    [],
  );

  useEffect(() => {
    // We clone here so that editing doesn't directly mutate the prop
    setFormDataList(sections.map((s) => ({ ...s })));
  }, [sections]);

  const handleRemoveFromParent = (index: number) => {
    setFormDataList((prev) => {
      const copy = [...prev];
      copy.splice(index, 1);
      return copy;
    });
  };

  return (
    <div className="sections-wrapper">
      {formDataList.map((sectionData, index) => (
        <SectionEditor
          key={sectionData.id || index}
          index={index}
          sectionData={sectionData}
          onRemoveFromParent={handleRemoveFromParent}
          productType={productType}
          showRemoveButton={formDataList.length > 1}
          productId={productId}
        />
      ))}

      <GalButton
        type="secondary"
        text="Add Section"
        htmlType="button"
        onClick={() => {
          setFormDataList((prev) => [
            ...prev,
            { id: '', title: '', description: '' },
          ]);
        }}
      />
    </div>
  );
};

export default CreateProductSections;
