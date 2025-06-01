import React, { useEffect, useState } from 'react';

import './create-product-sections.styles.scss';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../../../store/store';
import Button from '../../../../components/button/button.component';
import FormInput from '../../../../components/form-input/form-input.component';
import SectionEditor from './section-editor/section-editor.component';
import { ProductType } from '../../../../models/product/product.types';

interface CreateProductSectionsProps {
  sections: any[];
  productType: ProductType;
}

export interface NewProductSectionFormData {
  id: string; // Initially empty, will be set after product creation
  title: string;
  description: string;
}

const CreateProductSections: React.FC<CreateProductSectionsProps> = ({
  sections,
  productType,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const [formDataList, setFormDataList] = useState<NewProductSectionFormData[]>(
    []
  );

  useEffect(() => {
    // We clone here so that editing doesn't directly mutate the prop
    setFormDataList(sections.map((s) => ({ ...s })));
  }, [sections]);

  const handleRemove = () => {
    // onSectionRemove(index);
    console.log('Remove section');
  };

  // const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   onSectionChange(index, 'title', e.target.value);
  // };

  // const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   onSectionChange(index, 'description', e.target.value);
  // };

  const handleSave = () => {
    // Logic to save the section can be added here

    // dispatch(
    //   updateSectionDetails(section).then((updatedSection) => {
    //     console.log('Section updated:', updatedSection);
    //   })
    // );
    console.log('Section saved');
  };

  const handleChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormDataList((prevList) => {
      const newList = [...prevList];
      newList[index] = { ...newList[index], [name]: value };
      return newList;
    });
  };

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
        />
      ))}
    </div>
  );
};

export default CreateProductSections;
