import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { IoAddOutline } from 'react-icons/io5';

import { Button, Icon, Input, Textarea } from '@shared/ui';
import {
  AppDispatch,
  ProductSectionCreateRequest,
  ProductType,
} from 'core/api/models';
import { selectAuthUser } from 'core/store/auth-store';
import {
  createProductSection,
  deleteProductSection,
  updateProductSection,
} from 'core/store/product-store';
import { getCssVar } from '@shared/utils';
import SectionEditor from '../editors/section-editor/section-editor.component';
import { SectionDraft } from '../models';

import './create-product-sections.styles.scss';

interface CreateProductSectionsProps {
  sections: SectionDraft[];
  productType: ProductType;
  productId: string;
  // eslint-disable-next-line no-unused-vars
  onSectionsChange: (sections: SectionDraft[]) => void;
}

const getContentCopy = (productType: ProductType) =>
  productType === 'DOWNLOAD'
    ? {
      title: 'Files',
      description: 'Organize the files customers receive with this Download.',
      emptyTitle: 'Create a file group to start adding customer downloads.',
      emptyDescription:
          'File groups keep related deliverables together and make larger Downloads easier to scan.',
      addLabel: 'Add file group',
      firstAddLabel: 'Add your first file group',
      titleLabel: 'File group title',
      titlePlaceholder: 'Launch assets',
      descriptionLabel: 'File group description',
      descriptionPlaceholder: 'Describe the files in this group.',
      entityName: 'file group',
      deleteCopy:
          'This removes the file group and any files it contains from this Download.',
    }
    : {
      title: 'Curriculum',
      description: 'Build and organize the lessons included in this Course.',
      emptyTitle: 'Add your first section to start building this Course.',
      emptyDescription:
          'Sections group related lessons so customers can understand the learning path.',
      addLabel: 'Add section',
      firstAddLabel: 'Add your first section',
      titleLabel: 'Section title',
      titlePlaceholder: 'Getting started',
      descriptionLabel: 'Section description',
      descriptionPlaceholder: 'Describe what this section covers.',
      entityName: 'section',
      deleteCopy:
          'This removes the section and any lessons it contains from this Course.',
    };

const normalizePositions = (sections: SectionDraft[]) =>
  sections.map((section, index) => ({
    ...section,
    position: index + 1,
  }));

const CreateProductSections: React.FC<CreateProductSectionsProps> = ({
  sections,
  productType,
  productId,
  onSectionsChange,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectAuthUser);
  const copy = getContentCopy(productType);
  const [isCreating, setIsCreating] = useState(false);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftDescription, setDraftDescription] = useState('');
  const [createError, setCreateError] = useState<string | null>(null);
  const [isSavingCreate, setIsSavingCreate] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [operationError, setOperationError] = useState<string | null>(null);

  const handleSectionChange = (index: number, nextSection: SectionDraft) => {
    const updated = sections.map((section: SectionDraft, i: number) =>
      i === index ? nextSection : section,
    );
    onSectionsChange(updated);
  };

  const resetCreate = () => {
    setDraftTitle('');
    setDraftDescription('');
    setCreateError(null);
    setIsCreating(false);
  };

  const handleCreateSection = async () => {
    const title = draftTitle.trim();

    if (!title) {
      setCreateError(`${copy.titleLabel} is required.`);
      return;
    }

    if (!user?.id) {
      setCreateError('Creator session is required before content can be created.');
      return;
    }

    const payload: ProductSectionCreateRequest = {
      productId,
      title,
      description: draftDescription.trim(),
      position: sections.length + 1,
    };

    setIsSavingCreate(true);
    setCreateError(null);

    try {
      const createdSection = await dispatch(createProductSection(payload)).unwrap();
      const nextSection: SectionDraft = {
        id: createdSection.id ?? '',
        title: createdSection.title,
        description: createdSection.description ?? '',
        position: createdSection.position,
        lessons: createdSection.lessons ?? [],
        files: createdSection.files ?? [],
      };

      onSectionsChange(normalizePositions([...sections, nextSection]));
      resetCreate();
    } catch (error) {
      setCreateError(
        typeof error === 'string'
          ? error
          : `Could not create this ${copy.entityName}.`,
      );
    } finally {
      setIsSavingCreate(false);
    }
  };

  const persistSectionPosition = (section: SectionDraft, position: number) => {
    if (!section.id) {
      return;
    }

    dispatch(
      updateProductSection({
        productId,
        sectionId: section.id,
        title: section.title,
        description: section.description,
        position,
      }),
    )
      .unwrap()
      .catch(() => {
        setOperationError(`Could not save ${copy.entityName} order.`);
      });
  };

  const handleMoveSection = (index: number, direction: -1 | 1) => {
    const nextIndex = index + direction;
    if (nextIndex < 0 || nextIndex >= sections.length) {
      return;
    }

    const next = [...sections];
    const [moved] = next.splice(index, 1);
    next.splice(nextIndex, 0, moved);
    const normalized = normalizePositions(next);

    onSectionsChange(normalized);
    persistSectionPosition(normalized[index], normalized[index].position);
    persistSectionPosition(
      normalized[nextIndex],
      normalized[nextIndex].position,
    );
  };

  const handleDeleteSection = async (section: SectionDraft, index: number) => {
    if (!section.id) {
      onSectionsChange(normalizePositions(sections.filter((_, i) => i !== index)));
      return;
    }

    try {
      await dispatch(
        deleteProductSection({
          productId,
          sectionId: section.id,
        }),
      ).unwrap();
      onSectionsChange(normalizePositions(sections.filter((_, i) => i !== index)));
      setDeleteTargetId(null);
    } catch (error) {
      setOperationError(
        typeof error === 'string'
          ? error
          : `Could not delete this ${copy.entityName}.`,
      );
    }
  };

  return (
    <div className="sections-wrapper">
      <div className="content-manager__intro">
        <div>
          <h3>{copy.title}</h3>
          <p>{copy.description}</p>
        </div>
        {!isCreating && sections.length > 0 && (
          <Button
            type="button"
            variant="secondary"
            onClick={() => setIsCreating(true)}
          >
            <Icon
              icon={IoAddOutline}
              color={getCssVar('--text-primary')}
              size={18}
            />
            <span>{copy.addLabel}</span>
          </Button>
        )}
      </div>

      {operationError && (
        <p className="content-manager__error" role="alert">
          {operationError}
        </p>
      )}

      {sections.length === 0 && !isCreating && (
        <div className="content-manager__empty">
          <h4>{copy.emptyTitle}</h4>
          <p>{copy.emptyDescription}</p>
          <Button type="button" onClick={() => setIsCreating(true)}>
            <Icon
              icon={IoAddOutline}
              color={getCssVar('--surface-canvas')}
              size={18}
            />
            <span>{copy.firstAddLabel}</span>
          </Button>
        </div>
      )}

      {isCreating && (
        <section
          className="content-manager__create"
          aria-labelledby="create-content-group-title"
        >
          <div>
            <h4 id="create-content-group-title">{copy.addLabel}</h4>
            <p>Create the group first, then add lessons or files.</p>
          </div>
          <Input
            name="content-group-title"
            label={copy.titleLabel}
            value={draftTitle}
            placeholder={copy.titlePlaceholder}
            error={createError ?? undefined}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              setDraftTitle(event.target.value)
            }
          />
          <Textarea
            name="content-group-description"
            label={copy.descriptionLabel}
            value={draftDescription}
            placeholder={copy.descriptionPlaceholder}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
              setDraftDescription(event.target.value)
            }
          />
          <div className="content-manager__create-actions">
            <Button type="button" variant="tertiary" onClick={resetCreate}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={handleCreateSection}
              loading={isSavingCreate}
            >
              Create {copy.entityName}
            </Button>
          </div>
        </section>
      )}

      <div className="content-manager__groups">
        {sections.map((sectionData: SectionDraft, index: number) => (
          <SectionEditor
            key={sectionData.id || index}
            index={index}
            section={sectionData}
            productType={productType}
            productId={productId}
            onChange={handleSectionChange}
            onMoveUp={() => handleMoveSection(index, -1)}
            onMoveDown={() => handleMoveSection(index, 1)}
            canMoveUp={index > 0}
            canMoveDown={index < sections.length - 1}
            deleteCopy={copy.deleteCopy}
            deleteTargetId={deleteTargetId}
            showRemoveButton={sections.length > 1}
            onRequestDelete={() => setDeleteTargetId(sectionData.id ?? `${index}`)}
            onCancelDelete={() => setDeleteTargetId(null)}
            onConfirmDelete={() => handleDeleteSection(sectionData, index)}
          />
        ))}
      </div>
    </div>
  );
};

export default CreateProductSections;
