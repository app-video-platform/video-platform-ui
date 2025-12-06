/* eslint-disable indent */
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { PiRectangleDashed } from 'react-icons/pi';

import CourseLessons from '../../course-lessons/course-lessons.component';
import {
  CourseLesson,
  CourseProductSection,
  CourseSectionCreateRequest,
  IRemoveItemPayload,
  ProductType,
  AppDispatch,
} from '@api/models';
import {
  Button,
  ExpansionPanel,
  GalIcon,
  GalUppyFileUploader,
  Textarea,
} from '@shared/ui';
import { selectAuthUser } from '@store/auth-store';
import { deleteSection, createSection } from '@store/product-store';
import { EditableTitle } from '../editable-title';
import { getCssVar } from '@shared/utils';
import { SectionDraft } from '@features/product-form/models';

import './section-editor.styles.scss';
import { useSectionAutosave } from '@features/product-form/hooks';

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
  const [files, setFiles] = useState<File[]>([]);

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

  const updateSection = (patch: Partial<SectionDraft>) => {
    const next: SectionDraft = {
      ...section,
      ...patch,
    };
    onChange(index, next);
  };

  const handleRemove = () => {
    if (!user || !user.id) {
      return;
    }

    if (section.id) {
      const removeSectionPayload: IRemoveItemPayload = {
        id: section.id,
        userId: user.id,
      };

      dispatch(deleteSection(removeSectionPayload))
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

    const newSection: CourseSectionCreateRequest = {
      title: section.title,
      description: section.description,
      position: index,
      productId,
      userId: user.id,
    };

    dispatch(createSection(newSection))
      .unwrap()
      .then((createdSection: CourseProductSection) => {
        const normalized: SectionDraft = {
          id: createdSection.id ?? '',
          title: createdSection.title ?? '',
          description: createdSection.description ?? '',
          position: createdSection.position,
          lessons: createdSection.lessons ?? [],
          // files: createdSection.files ?? [],
        };
        onChange(index, normalized);
      });
  };

  const handleFilesChange = (filesFromUploader: File[]) => {
    setFiles(filesFromUploader);
    // updateSection({ files: filesFromUploader });
  };

  const handleLessonsChange = (lessons: CourseLesson[]) => {
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
