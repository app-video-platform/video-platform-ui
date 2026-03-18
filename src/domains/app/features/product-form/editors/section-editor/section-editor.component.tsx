/* eslint-disable indent */
import React, { useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PiRectangleDashed } from 'react-icons/pi';

import CourseLessons from '../../course-lessons/course-lessons.component';
import {
  CourseProductSection,
  FileDownloadProductResponse,
  ProductSectionCreateRequest,
  ProductType,
  AppDispatch,
} from 'core/api/models';
import {
  Button,
  ExpansionPanel,
  GalIcon,
  GalUppyFileUploader,
  Textarea,
} from '@shared/ui';
import { selectAuthUser } from 'core/store/auth-store';
import {
  createProductSection,
  deleteDownloadSectionFile,
  deleteProductSection,
  uploadDownloadSectionFile,
} from 'core/store/product-store';
import { EditableTitle } from '../editable-title';
import { getCssVar } from '@shared/utils';
import { SectionDraft } from 'domains/app/features/product-form/models';

import './section-editor.styles.scss';
import { useSectionAutosave } from 'domains/app/features/product-form/hooks';

interface SectionEditorProps {
  index: number;
  section: SectionDraft;
  productType: ProductType;
  showRemoveButton?: boolean;
  productId: string;
  // eslint-disable-next-line no-unused-vars
  onRemove: (index: number) => void;
  // eslint-disable-next-line no-unused-vars
  onChange: (index: number, section: SectionDraft) => void;
}

const SectionEditor: React.FC<SectionEditorProps> = ({
  index,
  section,
  productType,
  showRemoveButton,
  productId,
  onRemove,
  onChange,
}) => {
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector(selectAuthUser);
  const latestSectionRef = useRef(section);
  const uploadedFileSignaturesRef = useRef(new Set<string>());
  const uploadedFileSignatureByIdRef = useRef(new Map<string, string>());

  const { isAutosaving, lastSavedAt } = useSectionAutosave({
    section,
    user,
    productId,
    dispatch,
  });

  useEffect(() => {
    if (section && section.id) {
      return;
    }
    if (!section.id && section && section.title) {
      handleSectionCreation();
    }
  }, [section]);

  useEffect(() => {
    latestSectionRef.current = section;
  }, [section]);

  const applySectionUpdate = (updater: (current: SectionDraft) => SectionDraft) => {
    const next = updater(latestSectionRef.current);
    latestSectionRef.current = next;
    onChange(index, next);
  };

  const updateSection = (patch: Partial<SectionDraft>) => {
    applySectionUpdate((current) => ({
      ...current,
      ...patch,
    }));
  };

  const handleRemove = () => {
    if (!user || !user.id) {
      return;
    }

    if (section.id) {
      dispatch(
        deleteProductSection({
          productId,
          sectionId: section.id,
        }),
      )
        .unwrap()
        .then(() => onRemove(index));
    } else {
      onRemove(index);
    }
  };

  const handleSectionCreation = () => {
    if (section.id) {
      return;
    }

    if (!user || !user.id) {
      return;
    }

    if (!section.title) {
      window.alert('Section title is required for creation');
      return;
    }

    const newSection: ProductSectionCreateRequest = {
      title: section.title,
      description: section.description,
      position: index,
      productId,
    };

    dispatch(createProductSection(newSection))
      .unwrap()
      .then((createdSection: CourseProductSection) => {
        const normalized: SectionDraft = {
          id: createdSection.id ?? '',
          title: createdSection.title ?? '',
          description: createdSection.description ?? '',
          position: createdSection.position,
          lessons: createdSection.lessons ?? [],
          files: createdSection.files ?? [],
        };
        latestSectionRef.current = normalized;
        onChange(index, normalized);
      });
  };

  const handleFilesChange = (filesFromUploader: File[]) => {
    if (productType !== 'DOWNLOAD' || !section.id) {
      return;
    }

    const getSignature = (file: File) =>
      `${file.name}:${file.size}:${file.lastModified}`;

    filesFromUploader.forEach((file) => {
      const signature = getSignature(file);

      if (uploadedFileSignaturesRef.current.has(signature)) {
        return;
      }

      uploadedFileSignaturesRef.current.add(signature);

      dispatch(
        uploadDownloadSectionFile({
          productId,
          sectionId: section.id ?? '',
          file,
        }),
      )
        .unwrap()
        .then(({ file: uploadedFile }) => {
          if (uploadedFile.id) {
            uploadedFileSignatureByIdRef.current.set(uploadedFile.id, signature);
          }

          applySectionUpdate((current) => {
            const existingFiles = current.files ?? [];
            const alreadyExists = existingFiles.some(
              (existing) => existing.id === uploadedFile.id,
            );

            if (alreadyExists) {
              return current;
            }

            return {
              ...current,
              files: [...existingFiles, uploadedFile],
            };
          });
        })
        .catch((error) => {
          uploadedFileSignaturesRef.current.delete(signature);
          console.error('Failed to upload download section file:', error);
        });
    });
  };

  const handleRemoveUploadedFile = (fileId?: string) => {
    if (!fileId || productType !== 'DOWNLOAD' || !section.id) {
      return;
    }

    dispatch(
      deleteDownloadSectionFile({
        productId,
        sectionId: section.id,
        fileId,
      }),
    )
      .unwrap()
      .then(() => {
        const signature = uploadedFileSignatureByIdRef.current.get(fileId);
        if (signature) {
          uploadedFileSignaturesRef.current.delete(signature);
          uploadedFileSignatureByIdRef.current.delete(fileId);
        }

        applySectionUpdate((current) => ({
          ...current,
          files: (current.files ?? []).filter((file) => file.id !== fileId),
        }));
      });
  };

  const handleLessonsChange = (lessons: CourseProductSection['lessons']) => {
    updateSection({ lessons });
  };

  const sectionDomId = section.id || `temp-${index}`;

  return (
    <ExpansionPanel
      className="section-editor"
      id={`lesson-${sectionDomId}`}
      defaultExpanded={true}
      hideToggle={!section.id}
      header={
        <>
          <div className="section-divider">
            <span className="divider-title">Section {index + 1}</span>
            <div className="divider-line" />
          </div>
          <div className="section-header-line">
            <div className="section-title-block">
              <GalIcon
                icon={PiRectangleDashed}
                size={24}
                color={getCssVar('--text-primary')}
              />
              <EditableTitle
                value={section.title}
                placeholder={`Untitled section ${index + 1}`}
                onChange={(title: string) => updateSection({ title })}
              />
            </div>
            {showRemoveButton && (
              <Button onClick={handleRemove} variant="remove" type="button">
                Remove
              </Button>
            )}
          </div>
        </>
      }
    >
      <Textarea
        value={section.description ?? ''}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          updateSection({ description: e.target.value })
        }
        placeholder="Write a short description for this section..."
        isMaxLengthShown={true}
        maxLength={250}
        className="section-description"
        block
      />

      {section.id &&
        (() => {
          switch (productType) {
            case 'COURSE':
              return (
                <div className="course-specific-fields">
                  <CourseLessons
                    key={section.id}
                    productId={productId}
                    sectionId={section.id}
                    lessons={(section as CourseProductSection).lessons || []}
                    onLessonsChange={handleLessonsChange}
                  />
                </div>
              );
            case 'DOWNLOAD':
              return (
                <div className="download-specific-fields">
                  <GalUppyFileUploader onFilesChange={handleFilesChange} />
                  {(section.files ?? []).length > 0 && (
                    <div className="download-uploaded-files">
                      {(section.files ?? []).map(
                        (file: FileDownloadProductResponse) => (
                          <div key={file.id ?? file.fileName} className="lesson-line">
                            <div>
                              <h3>{file.fileName}</h3>
                              <p>{file.fileType ?? 'Unknown file type'}</p>
                            </div>
                            <Button
                              type="button"
                              variant="remove"
                              onClick={() => handleRemoveUploadedFile(file.id)}
                            >
                              Remove
                            </Button>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </div>
              );

            default:
              return null;
          }
        })()}
    </ExpansionPanel>
  );
};

export default SectionEditor;
