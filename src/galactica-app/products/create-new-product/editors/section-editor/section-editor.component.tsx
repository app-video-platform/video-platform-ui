/* eslint-disable indent */
import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { ProductType } from '../../../../../api/models/product/product.types';
import Button from '../../../../../components/button/button.component';
import UppyFileUploader from '../../../../../components/uppy-file-uploader/uppy-file-uploader.component';
import {
  updateSectionDetails,
  createSection,
  deleteSection,
} from '../../../../../store/product-store/product.slice';
import { AppDispatch } from '../../../../../store/store';
import CourseLessons from '../../course-lessons/course-lessons.component';
import FormInput from '../../../../../components/form-input/form-input.component';

import './section-editor.styles.scss';
import { IUpdateSectionDetails } from '../../../../../api/models/product/product';

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
  productId: string;
  onRemoveFromParent: (index: number) => void;
}

const SectionEditor: React.FC<SectionEditorProps> = ({
  index,
  sectionData,
  productType,
  showRemoveButton,
  productId,
  onRemoveFromParent,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const [localData, setLocalData] = useState<NewProductSectionFormData>({
    id: sectionData.id || '',
    title: sectionData.title || '',
    description: sectionData.description || '',
    lessons: sectionData.lessons ? [...sectionData.lessons] : [],
    files: sectionData.files ? [...sectionData.files] : [],
  });
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    if (sectionData.id !== localData.id) {
      setLocalData({
        id: sectionData.id || '',
        title: sectionData.title || '',
        description: sectionData.description || '',
        lessons: sectionData.lessons ? [...sectionData.lessons] : [],
        files: sectionData.files ? [...sectionData.files] : [],
      });
    }
    // We intentionally omit localData from the dependency array here,
    // because we only want to sync when sectionData.id itself changes.
  }, [sectionData.id, sectionData.title, sectionData.description]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLocalData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleRemove = () => {
    console.log('Remove section:', localData.id);

    if (localData.id) {
      dispatch(deleteSection(localData.id))
        .unwrap()
        .then(() => {
          console.log('Section deleted from backend:', localData.id);
          onRemoveFromParent(index);
        })
        .catch((err) => {
          console.error('Failed to delete section (child):', err);
        });
    } else {
      console.log('No section ID to remove, removing from local list only');
      onRemoveFromParent(index);
    }
  };

  const handleUpdate = () => {
    const updatedSection: IUpdateSectionDetails = {
      ...localData,
      position: index,
      productId: productId,
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
        console.error('Failed to update section (child):', err);
      });

    console.log('Update section:', localData);
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
      // ...localData,
      title: localData.title,
      description: localData.description,
      position: index,
      productId: productId,
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
        <>
          {localData.id && (
            <Button
              onClick={handleUpdate}
              text="Update section"
              type="primary"
              disabled={isUnchanged}
              htmlType="button"
            />
          )}
          {showRemoveButton && (
            <Button
              onClick={handleRemove}
              text="Remove"
              type="secondary"
              htmlType="button"
            />
          )}
        </>
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
          htmlType="button"
          disabled={!localData.title}
        />
      )}

      {localData.id &&
        (() => {
          switch (productType) {
            case 'COURSE':
              return (
                <div className="course-specific-fields">
                  <CourseLessons
                    key={localData.id}
                    sectionId={localData.id}
                    lessons={localData.lessons || []}
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
