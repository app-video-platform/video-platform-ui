/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable indent */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import GalButton from '../../../../../../components/gal-button/gal-button.component';
import GalUppyFileUploader from '../../../../../../components/gal-uppy-file-uploader/gal-uppy-file-uploader.component';
import {
  updateSectionDetails,
  createSection,
  deleteSection,
} from '../../../../../../store/product-store/product.slice';
import { AppDispatch } from '../../../../../../store/store';
import CourseLessons from '../../course-lessons/course-lessons.component';
import GalFormInput from '../../../../../../components/gal-form-input/gal-form-input.component';

import { selectAuthUser } from '../../../../../../store/auth-store/auth.selectors';
import {
  CourseProductSection,
  CourseSectionCreateRequest,
  CourseSectionUpdateRequest,
} from '../../../../../../api/models/product/section';

import './section-editor.styles.scss';
import { IRemoveItemPayload } from '../../../../../../api/models/product/product';
import { ProductType } from '../../../../../../api/types/products.types';

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

  const user = useSelector(selectAuthUser);

  const safeSectionData: NewProductSectionFormData = {
    id: sectionData?.id || '',
    title: sectionData?.title || '',
    description: sectionData?.description || '',
    lessons: sectionData?.lessons ? [...sectionData.lessons] : [],
    files: sectionData?.files ? [...sectionData.files] : [],
  };

  const [localData, setLocalData] =
    useState<NewProductSectionFormData>(safeSectionData);
  const [files, setFiles] = useState<File[]>([]);

  useEffect(() => {
    if (sectionData && sectionData.id !== localData.id) {
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
    if (!user || !user.id) {
      console.error('User ID is not available for removal');
      return;
    }

    if (localData.id) {
      const removeSectionPayload: IRemoveItemPayload = {
        id: localData.id,
        userId: user.id, // Replace with actual user ID from auth state if needed
      };

      dispatch(deleteSection(removeSectionPayload))
        .unwrap()
        .then(() => {
          onRemoveFromParent(index);
        })
        .catch((err) => {
          console.error('Failed to delete section (child):', err);
        });
    } else {
      onRemoveFromParent(index);
    }
  };

  const handleUpdate = () => {
    if (!user || !user.id) {
      console.error('User ID is not available for update');
      return;
    }

    const updatedSection: CourseSectionUpdateRequest = {
      ...localData,
      position: index,
      productId: productId,
      userId: user.id, // Replace with actual user ID from auth state if needed
    };

    // Dispatch the update from inside the child
    dispatch(updateSectionDetails(updatedSection))
      .unwrap()
      .then((updated) => {
        // Optionally sync localData to match the “confirmed” updated data:
      })
      .catch((err) => {
        console.error('Failed to update section (child):', err);
      });
  };

  const handleSectionCreation = () => {
    if (localData.id) {
      console.warn(
        'Section already exists, cannot create again:',
        localData.id,
      );
      return;
    }

    if (!user || !user.id) {
      console.error('User ID is not available for creation');
      return;
    }

    if (!localData.title) {
      console.warn('Section title is required for creation');
      window.alert('Section title is required for creation');
      return;
    }

    const newSection: CourseSectionCreateRequest = {
      // ...localData,
      title: localData.title,
      description: localData.description,
      position: index,
      productId: productId,
      userId: user.id, // Replace with actual user ID from auth state if needed
    };

    dispatch(createSection(newSection))
      .unwrap()
      .then((createdSection: CourseProductSection) => {
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
  };

  const handleFilesChange = (files: File[]) => {
    // Callback to update the form's state with files from GalUppyFileUploader
    setFiles(files);
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
            <GalButton
              onClick={handleUpdate}
              text="Update section"
              type="primary"
              disabled={isUnchanged}
              htmlType="button"
            />
          )}
          {showRemoveButton && (
            <GalButton
              onClick={handleRemove}
              text="Remove"
              type="secondary"
              htmlType="button"
            />
          )}
        </>
      </div>

      <GalFormInput
        label="Section Title"
        type="text"
        name="title"
        value={localData.title}
        onChange={handleChange}
      />

      <GalFormInput
        label="Section Description"
        type="text"
        name="description"
        value={localData.description}
        onChange={handleChange}
      />

      {!localData.id && (
        <GalButton
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
                  <GalUppyFileUploader onFilesChange={handleFilesChange} />
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
