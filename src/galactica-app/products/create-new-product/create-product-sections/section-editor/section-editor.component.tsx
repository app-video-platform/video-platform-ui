/* eslint-disable indent */
import React, { useEffect, useState } from 'react';

import Button from '../../../../../components/button/button.component';
import FormInput from '../../../../../components/form-input/form-input.component';

import './section-editor.styles.scss';
import { ProductType } from '../../../../../models/product/product.types';
import UppyFileUploader from '../../../../../components/uppy-file-uploader/uppy-file-uploader.component';
import CourseLessons from './course-lessons/course-lessons.component';

// Re‐use the same interface for a section’s data shape
export interface NewProductSectionFormData {
  id: string;
  title: string;
  description: string;
  lessons?: any[]; // Optional: lessons for courses, etc.
  files?: File[]; // Optional: files for downloads, etc.
}

// Define the props that SectionEditor needs
interface SectionEditorProps {
  index: number;
  sectionData: NewProductSectionFormData;
  productType: ProductType;
  // // Callback when an input (title/description) changes
  // onFieldChange: (
  //   index: number,
  //   fieldName: 'title' | 'description',
  //   newValue: string
  // ) => void;

  // // Called when Save is clicked
  // onSave: (index: number) => void;

  // Called when Remove is clicked
  onRemoveFromParent: (index: number) => void;
}

const SectionEditor: React.FC<SectionEditorProps> = ({
  index,
  sectionData,
  productType,
  onRemoveFromParent,
}) => {
  const [localData, setLocalData] =
    useState<NewProductSectionFormData>(sectionData);
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    setLocalData(sectionData);
  }, [sectionData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRemove = () => {
    // If you have a backend‐side delete, you can dispatch it here:
    // dispatch(deleteSection(localData.id))
    //   .unwrap()
    //   .then(() => {
    //     console.log('Section deleted from backend:', localData.id);
    //     // Then tell parent to remove this item from its array
    //     onRemoveFromParent(index);
    //   })
    //   .catch((err) => {
    //     console.error('Failed to delete section (child):', err);
    //   });

    console.log('Remove section:', localData.id);
    onRemoveFromParent(index);
  };

  const handleSave = () => {
    // Dispatch the update from inside the child
    // dispatch(updateSectionDetails(localData))
    //   .unwrap()
    //   .then((updated) => {
    //     console.log('Section updated from child:', updated);
    //     // Optionally sync localData to match the “confirmed” updated data:
    //     setLocalData(updated);
    //   })
    //   .catch((err) => {
    //     console.error('Failed to save section (child):', err);
    //   });

    console.log('Save section:', localData);
  };

  const handleFilesChange = (files: File[]) => {
    // Callback to update the form's state with files from UppyFileUploader
    setFiles(files);

    console.log('files', files);
  };

  return (
    <div className="section-container">
      <div className="section-header-line">
        <h3>Section {index + 1}</h3>
        <Button onClick={handleSave} text="Update section" type="primary" />
        <Button onClick={handleRemove} text="Remove" type="secondary" />
      </div>

      <FormInput
        label="Section Title"
        type="text"
        name="title"
        value={sectionData.title}
        onChange={handleChange}
      />

      <FormInput
        label="Section Description"
        type="text"
        name="description"
        value={sectionData.description}
        onChange={handleChange}
      />

      {(() => {
        switch (productType) {
          case 'COURSE':
            return (
              <div className="course-specific-fields">
                <CourseLessons
                  sectionId={localData.id}
                  lessons={sectionData.lessons || []}
                />
              </div>
            );
          case 'DOWNLOAD':
            return (
              <div className="download-specific-fields">
                <UppyFileUploader onFilesChange={handleFilesChange} />
              </div>
            );

          default:
            return null;
        }
      })()}
    </div>
  );
};

export default SectionEditor;
