/* eslint-disable indent */
import React, { useEffect, useState } from 'react';

import Button from '../../../../../components/button/button.component';
import FormInput from '../../../../../components/form-input/form-input.component';

import './section-editor.styles.scss';
import { ProductType } from '../../../../../models/product/product.types';
import UppyFileUploader from '../../../../../components/uppy-file-uploader/uppy-file-uploader.component';
import CourseLessons from './course-lessons/course-lessons.component';
import { AppDispatch } from '../../../../../store/store';
import { useDispatch } from 'react-redux';
import {
  createSection,
  updateSectionDetails,
} from '../../../../../store/product-store/product.slice';

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
  showRemoveButton?: boolean;
  onRemoveFromParent: (index: number) => void;
}

const SectionEditor: React.FC<SectionEditorProps> = ({
  index,
  sectionData,
  productType,
  showRemoveButton,
  onRemoveFromParent,
}) => {
  const dispatch = useDispatch<AppDispatch>();

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
    console.log('Remove section:', localData.id);
    onRemoveFromParent(index);

    if (localData.id) {
      console.info('[TODO] Remove section:', localData.id);
      // dispatch(deleteSection(localData.id))
      //   .unwrap()
      //   .then(() => {
      //     console.log('Section deleted from backend:', localData.id);
      //   })
      //   .catch((err) => {
      //     console.error('Failed to delete section (child):', err);
      //   });
    }
  };

  const handleUpdate = () => {
    const updatedSection = {
      ...localData,
      position: index,
    };

    // Dispatch the update from inside the child
    dispatch(updateSectionDetails(updatedSection))
      .unwrap()
      .then((updated) => {
        console.log('Section updated from child:', updated);
        // Optionally sync localData to match the “confirmed” updated data:
        setLocalData({
          ...updated,
          id: updated.id ?? '',
          title: updated.title ?? '',
          description: updated.description ?? '',
        });
      })
      .catch((err) => {
        console.error('Failed to save section (child):', err);
      });

    console.log('Save section:', localData);
  };

  const handleSectionCreation = () => {
    if (localData.id) {
      console.warn(
        'Section already exists, cannot create again:',
        localData.id
      );
      return;
    }

    if (!localData.title) {
      console.warn('Section title is required for creation');
      window.alert('Section title is required for creation');
      return;
    }
    const newSection = {
      ...localData,
      position: index,
    };

    dispatch(createSection(newSection))
      .unwrap()
      .then((createdSection) => {
        console.log('Section created from child:', createdSection);
        // Optionally sync localData to match the “confirmed” created data:
        setLocalData({
          ...createdSection,
          id: createdSection.id ?? '',
          title: createdSection.title ?? '',
          description: createdSection.description ?? '',
        });
      })
      .catch((err) => {
        console.error('Failed to create section (child):', err);
      });
    console.log('Create section:', localData);
  };

  const handleFilesChange = (files: File[]) => {
    // Callback to update the form's state with files from UppyFileUploader
    setFiles(files);

    console.log('files', files);
  };

  const isUnchanged =
    localData.title === sectionData.title &&
    localData.description === sectionData.description;

  return (
    <div className="section-container">
      <div className="section-header-line">
        <h3>Section {index + 1}</h3>

        {localData.id && (
          <>
            <Button
              onClick={handleUpdate}
              text="Update section"
              type="primary"
              disabled={isUnchanged}
            />

            {showRemoveButton && (
              <Button onClick={handleRemove} text="Remove" type="secondary" />
            )}
          </>
        )}
      </div>

      <FormInput
        label="Section Title"
        type="text"
        name="title"
        value={localData.title}
        onChange={handleChange}
      />

      <FormInput
        label="Section Description"
        type="text"
        name="description"
        value={localData.description}
        onChange={handleChange}
      />

      {!localData.id && (
        <Button
          onClick={handleSectionCreation}
          text="Create section"
          type="primary"
        />
      )}

      {localData.id &&
        (() => {
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
