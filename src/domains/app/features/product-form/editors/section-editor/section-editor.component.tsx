/* eslint-disable indent */
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { HiArrowDown, HiArrowUp, HiOutlineTrash } from 'react-icons/hi';
import { PiRectangleDashed } from 'react-icons/pi';

import CourseLessons from '../../course-lessons/course-lessons.component';
import {
  AppDispatch,
  FileDownloadProductResponse,
  ProductSection,
  ProductType,
} from 'core/api/models';
import {
  Button,
  Icon,
  StatusBadge,
  Textarea,
  UppyFileUploader,
} from '@shared/ui';
import { selectAuthUser } from 'core/store/auth-store';
import {
  deleteDownloadSectionFile,
  uploadDownloadSectionFile,
} from 'core/store/product-store';
import { EditableTitle } from '../editable-title';
import { getCssVar } from '@shared/utils';
import { SectionDraft } from 'domains/app/features/product-form/models';
import { useSectionAutosave } from 'domains/app/features/product-form/hooks';

import './section-editor.styles.scss';

interface SectionEditorProps {
  index: number;
  section: SectionDraft;
  productType: ProductType;
  productId: string;
  // eslint-disable-next-line no-unused-vars
  onChange: (index: number, section: SectionDraft) => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  canMoveUp?: boolean;
  canMoveDown?: boolean;
  deleteCopy?: string;
  deleteTargetId?: string | null;
  onRequestDelete?: () => void;
  onCancelDelete?: () => void;
  onConfirmDelete?: () => void;
  showRemoveButton?: boolean;
  // eslint-disable-next-line no-unused-vars
  onRemove?: (index: number) => void;
}

type UploadStatus = 'uploading' | 'uploaded' | 'failed';

const formatFileSize = (size?: number) => {
  if (!size) {
    return 'Size unavailable';
  }

  if (size < 1024 * 1024) {
    return `${(size / 1024).toFixed(1)} KB`;
  }

  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
};

const getFileTypeLabel = (fileType?: string, fileName?: string) => {
  const extension = fileName?.split('.').pop()?.toUpperCase();
  if (extension && extension.length <= 5) {
    return extension;
  }

  if (!fileType) {
    return 'File';
  }

  return fileType.split('/').pop()?.toUpperCase() ?? 'File';
};

const SectionEditor: React.FC<SectionEditorProps> = ({
  index,
  section,
  productType,
  productId,
  onChange,
  onMoveUp = () => undefined,
  onMoveDown = () => undefined,
  canMoveUp = false,
  canMoveDown = false,
  deleteCopy = 'This removes this content group.',
  deleteTargetId,
  onRequestDelete = () => undefined,
  onCancelDelete = () => undefined,
  onConfirmDelete = () => undefined,
  onRemove,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectAuthUser);
  const latestSectionRef = useRef(section);
  const uploadedFileSignaturesRef = useRef(new Set<string>());
  const uploadedFileSignatureByIdRef = useRef(new Map<string, string>());
  const [uploadStatusBySignature, setUploadStatusBySignature] = useState<
    Record<string, UploadStatus>
  >({});
  const [fileDeleteTargetId, setFileDeleteTargetId] = useState<string | null>(
    null,
  );
  const [operationError, setOperationError] = useState<string | null>(null);
  const [isLocalDeleteOpen, setIsLocalDeleteOpen] = useState(false);

  const { isAutosaving, lastSavedAt } = useSectionAutosave({
    section,
    user,
    productId,
    dispatch,
  });

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
      setUploadStatusBySignature((current) => ({
        ...current,
        [signature]: 'uploading',
      }));

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

          setUploadStatusBySignature((current) => ({
            ...current,
            [signature]: 'uploaded',
          }));

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
          setUploadStatusBySignature((current) => ({
            ...current,
            [signature]: 'failed',
          }));
          setOperationError(
            typeof error === 'string'
              ? error
              : `Could not upload ${file.name}. Try again.`,
          );
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
          setUploadStatusBySignature((current) => {
            const next = { ...current };
            delete next[signature];
            return next;
          });
        }

        applySectionUpdate((current) => ({
          ...current,
          files: (current.files ?? []).filter((file) => file.id !== fileId),
        }));
        setFileDeleteTargetId(null);
      })
      .catch((error) => {
        setOperationError(
          typeof error === 'string'
            ? error
            : 'Could not remove this file. Try again.',
        );
      });
  };

  const handleLessonsChange = (lessons: ProductSection['lessons']) => {
    updateSection({ lessons });
  };

  const isDeleteOpen =
    deleteTargetId === undefined
      ? isLocalDeleteOpen
      : deleteTargetId === (section.id || `${index}`);
  const handleRequestDelete = () => {
    if (deleteTargetId === undefined) {
      setIsLocalDeleteOpen(true);
      return;
    }

    onRequestDelete();
  };
  const handleCancelDelete = () => {
    if (deleteTargetId === undefined) {
      setIsLocalDeleteOpen(false);
      return;
    }

    onCancelDelete();
  };
  const handleConfirmDelete = () => {
    if (deleteTargetId === undefined) {
      onRemove?.(index);
      setIsLocalDeleteOpen(false);
      return;
    }

    onConfirmDelete();
  };
  const entityLabel = productType === 'DOWNLOAD' ? 'file group' : 'section';
  const childCount =
    productType === 'DOWNLOAD'
      ? (section.files ?? []).length
      : (section.lessons ?? []).length;
  const childLabel = productType === 'DOWNLOAD' ? 'files' : 'lessons';
  const sectionDomId = section.id || `temp-${index}`;

  return (
    <section
      className="section-editor content-group"
      id={`section-${sectionDomId}`}
      aria-labelledby={`section-title-${sectionDomId}`}
    >
      <header className="content-group__header">
        <div className="content-group__identity">
          <Icon
            icon={PiRectangleDashed}
            size={22}
            color={getCssVar('--text-primary')}
          />
          <div>
            <span className="content-group__eyebrow">
              {productType === 'DOWNLOAD' ? 'File group' : 'Section'} {index + 1}
            </span>
            <div id={`section-title-${sectionDomId}`}>
              <EditableTitle
                value={section.title}
                placeholder={
                  productType === 'DOWNLOAD'
                    ? `Untitled file group ${index + 1}`
                    : `Untitled section ${index + 1}`
                }
                onChange={(title: string) => updateSection({ title })}
              />
            </div>
          </div>
        </div>
        <div className="content-group__meta">
          <StatusBadge
            label={
              isAutosaving
                ? 'Saving'
                : lastSavedAt
                  ? 'Saved'
                  : `${childCount} ${childLabel}`
            }
            tone={isAutosaving ? 'info' : 'neutral'}
            size="sm"
          />
          <Button
            type="button"
            variant="tertiary"
            size="sm"
            onClick={onMoveUp}
            disabled={!canMoveUp}
            aria-label={`Move ${section.title || entityLabel} up`}
          >
            <Icon icon={HiArrowUp} size={16} color={getCssVar('--text-primary')} />
            <span>Up</span>
          </Button>
          <Button
            type="button"
            variant="tertiary"
            size="sm"
            onClick={onMoveDown}
            disabled={!canMoveDown}
            aria-label={`Move ${section.title || entityLabel} down`}
          >
            <Icon
              icon={HiArrowDown}
              size={16}
              color={getCssVar('--text-primary')}
            />
            <span>Down</span>
          </Button>
          <Button
            type="button"
            variant="danger"
            size="sm"
            onClick={handleRequestDelete}
            aria-label={`Delete ${section.title || entityLabel}`}
          >
            <Icon
              icon={HiOutlineTrash}
              size={16}
              color={getCssVar('--text-primary')}
            />
            <span>Delete</span>
          </Button>
        </div>
      </header>

      <Textarea
        label={
          productType === 'DOWNLOAD'
            ? 'File group description'
            : 'Section description'
        }
        name={`section-description-${sectionDomId}`}
        value={section.description ?? ''}
        onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
          updateSection({ description: e.target.value })
        }
        placeholder={
          productType === 'DOWNLOAD'
            ? 'Describe this group of files.'
            : 'Describe what this section covers.'
        }
        className="section-description"
        block
      />

      {isDeleteOpen && (
        <div className="content-group__confirm" role="alertdialog">
          <div>
            <strong>Delete {section.title || entityLabel}?</strong>
            <p>{deleteCopy}</p>
          </div>
          <div>
            <Button type="button" variant="tertiary" onClick={handleCancelDelete}>
              Cancel
            </Button>
            <Button type="button" variant="danger" onClick={handleConfirmDelete}>
              Delete {entityLabel}
            </Button>
          </div>
        </div>
      )}

      {operationError && (
        <p className="content-group__error" role="alert">
          {operationError}
        </p>
      )}

      {productType === 'COURSE' && (
        <CourseLessons
          productId={productId}
          sectionId={section.id ?? ''}
          lessons={(section as ProductSection).lessons || []}
          onLessonsChange={handleLessonsChange}
        />
      )}

      {productType === 'DOWNLOAD' && (
        <div className="download-specific-fields">
          <div className="download-upload">
            <UppyFileUploader onFilesChange={handleFilesChange} />
          </div>

          {(section.files ?? []).length === 0 ? (
            <div className="content-group__empty">
              <h4>No files in this group yet.</h4>
              <p>Add files customers should receive when they access this Download.</p>
            </div>
          ) : (
            <div className="download-uploaded-files" aria-live="polite">
              {(section.files ?? []).map((file: FileDownloadProductResponse) => {
                const signature = file.id
                  ? uploadedFileSignatureByIdRef.current.get(file.id)
                  : undefined;
                const uploadStatus = signature
                  ? uploadStatusBySignature[signature]
                  : undefined;
                const fileLabel = file.fileName ?? 'Uploaded file';

                return (
                  <div key={file.id ?? file.fileName} className="file-row">
                    <span className="file-row__type">
                      {getFileTypeLabel(file.fileType, file.fileName)}
                    </span>
                    <div className="file-row__details">
                      <strong>{fileLabel}</strong>
                      <span>
                        {formatFileSize(file.size)}
                        {uploadStatus && ` • ${uploadStatus}`}
                      </span>
                    </div>
                    {fileDeleteTargetId === file.id ? (
                      <div className="file-row__confirm">
                        <span>Remove this file?</span>
                        <Button
                          type="button"
                          variant="tertiary"
                          size="sm"
                          onClick={() => setFileDeleteTargetId(null)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          variant="danger"
                          size="sm"
                          onClick={() => handleRemoveUploadedFile(file.id)}
                        >
                          Remove
                        </Button>
                      </div>
                    ) : (
                      <Button
                        type="button"
                        variant="danger"
                        size="sm"
                        onClick={() => setFileDeleteTargetId(file.id ?? null)}
                        aria-label={`Remove ${fileLabel}`}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default SectionEditor;
