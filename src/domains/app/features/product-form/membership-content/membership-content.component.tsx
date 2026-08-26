import React, { useState } from 'react';

import { Button, Drawer, Radio, RadioGroup } from '@shared/ui';
import { ProductMinimised } from 'core/api/models';
import {
  MembershipContentCreateRequest,
  MembershipContentUpdateRequest,
} from 'core/api/models/membership';
import MembershipIncludedProducts from './membership-included-products.component';
import MembershipContentTypeChooser from './membership-content-type-chooser.component';
import MembershipPostEditor from './membership-post-editor.component';
import MembershipResourceEditor from './membership-resource-editor.component';
import MembershipVideoEditor from './membership-video-editor.component';
import {
  MembershipContentChooserSelection,
  MembershipContentCreationMode,
  MembershipContentItem,
  MembershipFeedEntry,
  MembershipOrderingMode,
  MembershipPostDraft,
  MembershipProductFeedEntry,
  MembershipResourceDraft,
  MembershipVideoDraft,
  MEMBERSHIP_ORDERING_MODE_OPTIONS,
  createBlankMembershipResourceDraft,
  createBlankMembershipPostDraft,
  createBlankMembershipVideoDraft,
} from './models';
import './membership-content.styles.scss';

interface MembershipContentSectionProps {
  ownerId?: string;
  currentProductId?: string;
  nativeContentItems: MembershipContentItem[];
  feedEntries: MembershipFeedEntry[];
  orderingMode: MembershipOrderingMode;
  includedProductEntries: MembershipProductFeedEntry[];
  productSummaries: ProductMinimised[] | null;
  includedProducts: ProductMinimised[];
  isLoadingProducts: boolean;
  productsError: string | null;
  // eslint-disable-next-line no-unused-vars
  onAddNativeContentItem: (
    // eslint-disable-next-line no-unused-vars
    payload: MembershipContentCreateRequest,
    // eslint-disable-next-line no-unused-vars
    addedAt: string,
  ) => Promise<void> | void;
  // eslint-disable-next-line no-unused-vars
  onUpdateNativeContentItem: (
    // eslint-disable-next-line no-unused-vars
    contentId: string,
    // eslint-disable-next-line no-unused-vars
    payload: MembershipContentUpdateRequest,
  ) => Promise<void> | void;
  // eslint-disable-next-line no-unused-vars
  onDeleteNativeContentItem: (contentId: string) => Promise<void> | void;
  // eslint-disable-next-line no-unused-vars
  onOrderingModeChange: (orderingMode: MembershipOrderingMode) => Promise<void> | void;
  // eslint-disable-next-line no-unused-vars
  onAddIncludedProducts: (productIds: string[], addedAt: string) => Promise<void> | void;
  // eslint-disable-next-line no-unused-vars
  onRemoveIncludedProduct: (productId?: string) => Promise<void> | void;
  // eslint-disable-next-line no-unused-vars
  onMoveFeedEntry: (entryId: string, direction: 'UP' | 'DOWN') => Promise<void> | void;
}

const mutationErrorMessage = (error: unknown, fallback: string) => {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
};

const MembershipContentSection: React.FC<MembershipContentSectionProps> = ({
  ownerId,
  currentProductId,
  nativeContentItems,
  feedEntries,
  orderingMode,
  includedProductEntries,
  productSummaries,
  includedProducts,
  isLoadingProducts,
  productsError,
  onAddNativeContentItem,
  onUpdateNativeContentItem,
  onDeleteNativeContentItem,
  onOrderingModeChange,
  onAddIncludedProducts,
  onRemoveIncludedProduct,
  onMoveFeedEntry,
}) => {
  const [isChooserOpen, setIsChooserOpen] = useState(false);
  const [creationMode, setCreationMode] =
    useState<MembershipContentCreationMode>(null);
  const [editingContentId, setEditingContentId] = useState<string | null>(null);
  const [postDraft, setPostDraft] = useState<MembershipPostDraft>(
    createBlankMembershipPostDraft,
  );
  const [videoDraft, setVideoDraft] = useState<MembershipVideoDraft>(
    createBlankMembershipVideoDraft,
  );
  const [resourceDraft, setResourceDraft] = useState<MembershipResourceDraft>(
    createBlankMembershipResourceDraft,
  );
  const [productPickerRequest, setProductPickerRequest] = useState(0);
  const [isMutating, setIsMutating] = useState(false);
  const [mutationError, setMutationError] = useState<string | null>(null);

  const resetMutationFeedback = () => {
    setMutationError(null);
  };

  const handleSelectContentType = (
    selection: MembershipContentChooserSelection,
  ) => {
    setIsChooserOpen(false);
    resetMutationFeedback();

    if (selection === 'EXISTING_PRODUCT') {
      setCreationMode(null);
      setProductPickerRequest((currentRequest) => currentRequest + 1);
      return;
    }

    setCreationMode(selection);

    if (selection === 'POST') {
      setEditingContentId(null);
      setPostDraft(createBlankMembershipPostDraft());
    }

    if (selection === 'VIDEO') {
      setEditingContentId(null);
      setVideoDraft(createBlankMembershipVideoDraft());
    }

    if (selection === 'RESOURCE') {
      setEditingContentId(null);
      setResourceDraft(createBlankMembershipResourceDraft());
    }
  };

  const handleSavePost = async () => {
    const title = postDraft.title.trim();
    const body = postDraft.body.trim();

    if (!title || !body) {
      return;
    }

    const now = new Date().toISOString();

    setIsMutating(true);
    resetMutationFeedback();

    try {
      if (editingContentId) {
        const saveResult = onUpdateNativeContentItem(editingContentId, {
          type: 'POST',
          title,
          body,
          status: postDraft.status,
        });
        if (saveResult) {
          await saveResult;
        }
      } else {
        const saveResult = onAddNativeContentItem(
          {
            type: 'POST',
            title,
            body,
            status: postDraft.status,
          },
          now,
        );
        if (saveResult) {
          await saveResult;
        }
      }

      setCreationMode(null);
      setEditingContentId(null);
      setPostDraft(createBlankMembershipPostDraft());
    } catch (error) {
      setMutationError(
        mutationErrorMessage(
          error,
          editingContentId
            ? 'Post update failed. Your draft is still here so you can retry.'
            : 'Post creation failed. Your draft is still here so you can retry.',
        ),
      );
    } finally {
      setIsMutating(false);
    }
  };

  const handleCancelPostEditing = () => {
    resetMutationFeedback();
    setCreationMode(null);
    setEditingContentId(null);
    setPostDraft(createBlankMembershipPostDraft());
  };

  const handleSaveVideo = async () => {
    const title = videoDraft.title.trim();

    if (!title || !videoDraft.video) {
      return;
    }

    const now = new Date().toISOString();

    setIsMutating(true);
    resetMutationFeedback();

    try {
      if (editingContentId) {
        const saveResult = onUpdateNativeContentItem(editingContentId, {
          type: 'VIDEO',
          title,
          description: videoDraft.description.trim() || undefined,
          status: videoDraft.status,
          video: videoDraft.video,
        });
        if (saveResult) {
          await saveResult;
        }
      } else {
        const saveResult = onAddNativeContentItem(
          {
            type: 'VIDEO',
            title,
            description: videoDraft.description.trim() || undefined,
            status: videoDraft.status,
            video: videoDraft.video,
          },
          now,
        );
        if (saveResult) {
          await saveResult;
        }
      }

      setCreationMode(null);
      setEditingContentId(null);
      setVideoDraft(createBlankMembershipVideoDraft());
    } catch (error) {
      setMutationError(
        mutationErrorMessage(
          error,
          editingContentId
            ? 'Video update failed. Your draft is still here so you can retry.'
            : 'Video creation failed. Your draft is still here so you can retry.',
        ),
      );
    } finally {
      setIsMutating(false);
    }
  };

  const handleCancelVideoEditing = () => {
    resetMutationFeedback();
    setCreationMode(null);
    setEditingContentId(null);
    setVideoDraft(createBlankMembershipVideoDraft());
  };

  const handleSaveResource = async () => {
    const title = resourceDraft.title.trim();

    if (!title || !resourceDraft.file) {
      return;
    }

    const now = new Date().toISOString();

    setIsMutating(true);
    resetMutationFeedback();

    try {
      if (editingContentId) {
        const saveResult = onUpdateNativeContentItem(editingContentId, {
          type: 'RESOURCE',
          title,
          description: resourceDraft.description.trim() || undefined,
          status: resourceDraft.status,
          file: resourceDraft.file,
        });
        if (saveResult) {
          await saveResult;
        }
      } else {
        const saveResult = onAddNativeContentItem(
          {
            type: 'RESOURCE',
            title,
            description: resourceDraft.description.trim() || undefined,
            status: resourceDraft.status,
            file: resourceDraft.file,
          },
          now,
        );
        if (saveResult) {
          await saveResult;
        }
      }

      setCreationMode(null);
      setEditingContentId(null);
      setResourceDraft(createBlankMembershipResourceDraft());
    } catch (error) {
      setMutationError(
        mutationErrorMessage(
          error,
          editingContentId
            ? 'Resource update failed. Your draft is still here so you can retry.'
            : 'Resource creation failed. Your draft is still here so you can retry.',
        ),
      );
    } finally {
      setIsMutating(false);
    }
  };

  const handleCancelResourceEditing = () => {
    resetMutationFeedback();
    setCreationMode(null);
    setEditingContentId(null);
    setResourceDraft(createBlankMembershipResourceDraft());
  };

  const handleEditContent = (contentId: string) => {
    const content = nativeContentItems.find((item) => item.id === contentId);

    if (!content) {
      return;
    }

    setIsChooserOpen(false);
    resetMutationFeedback();
    setEditingContentId(content.id);

    if (content.type === 'POST') {
      setCreationMode('POST');
      setPostDraft({
        title: content.title,
        body: content.body,
        status: content.status,
      });
      return;
    }

    if (content.type === 'VIDEO') {
      setCreationMode('VIDEO');
      setVideoDraft({
        title: content.title,
        description: content.description ?? '',
        status: content.status,
        video: content.video,
      });
      return;
    }

    if (content.type === 'RESOURCE') {
      setCreationMode('RESOURCE');
      setResourceDraft({
        title: content.title,
        description: content.description ?? '',
        status: content.status,
        file: content.file,
      });
    }
  };

  const handleDeleteContent = async (contentId: string) => {
    setIsMutating(true);
    resetMutationFeedback();

    try {
      await onDeleteNativeContentItem(contentId);
    } catch (error) {
      setMutationError(
        mutationErrorMessage(
          error,
          'Content deletion failed. Nothing was removed; try again.',
        ),
      );
      throw error;
    } finally {
      setIsMutating(false);
    }
  };

  const handleOrderingModeChange = async (value: string) => {
    setIsMutating(true);
    resetMutationFeedback();

    try {
      await onOrderingModeChange(value as MembershipOrderingMode);
    } catch (error) {
      setMutationError(
        mutationErrorMessage(
          error,
          'Content order update failed. The previous order is still shown.',
        ),
      );
    } finally {
      setIsMutating(false);
    }
  };

  const handleAddIncludedProducts = async (
    productIds: string[],
    addedAt: string,
  ) => {
    setIsMutating(true);
    resetMutationFeedback();

    try {
      await onAddIncludedProducts(productIds, addedAt);
    } catch (error) {
      setMutationError(
        mutationErrorMessage(
          error,
          'Product inclusion failed. No Product was added to this Membership.',
        ),
      );
      throw error;
    } finally {
      setIsMutating(false);
    }
  };

  const handleRemoveIncludedProduct = async (productId?: string) => {
    setIsMutating(true);
    resetMutationFeedback();

    try {
      await onRemoveIncludedProduct(productId);
    } catch (error) {
      setMutationError(
        mutationErrorMessage(
          error,
          'Product removal failed. The included Product is still available in this Membership.',
        ),
      );
      throw error;
    } finally {
      setIsMutating(false);
    }
  };

  const handleMoveFeedEntry = async (
    entryId: string,
    direction: 'UP' | 'DOWN',
  ) => {
    setIsMutating(true);
    resetMutationFeedback();

    try {
      await onMoveFeedEntry(entryId, direction);
    } catch (error) {
      setMutationError(
        mutationErrorMessage(
          error,
          'Manual order update failed. The previous order is still shown.',
        ),
      );
      throw error;
    } finally {
      setIsMutating(false);
    }
  };

  const isPostEditorOpen = creationMode === 'POST';
  const isVideoEditorOpen = creationMode === 'VIDEO';
  const isResourceEditorOpen = creationMode === 'RESOURCE';
  const isEditorOpen =
    isPostEditorOpen || isVideoEditorOpen || isResourceEditorOpen;
  const editorTitle = editingContentId
    ? `Edit ${creationMode?.toLowerCase() ?? 'content'}`
    : `Create ${creationMode?.toLowerCase() ?? 'content'}`;

  return (
    <div className="membership-content">
      <div className="membership-content__header">
        <div>
          <h3>Membership content hub</h3>
          <p>
            Build an evolving member feed with posts, videos, resources, and
            included Courses or Downloads.
          </p>
        </div>
        <Button
          type="button"
          variant="primary"
          onClick={() => setIsChooserOpen(true)}
        >
          + Add content
        </Button>
      </div>

      {mutationError && (
        <div className="membership-content__operation-error" role="alert">
          {mutationError}
        </div>
      )}

      <Drawer
        open={isChooserOpen}
        title="Add content"
        onClose={() => setIsChooserOpen(false)}
        closeLabel="Close add content"
        className="membership-content-drawer"
      >
        <MembershipContentTypeChooser
          onSelect={handleSelectContentType}
          onCancel={() => setIsChooserOpen(false)}
        />
      </Drawer>

      <Drawer
        open={isEditorOpen}
        title={editorTitle}
        onClose={() => {
          if (isPostEditorOpen) {
            handleCancelPostEditing();
          } else if (isVideoEditorOpen) {
            handleCancelVideoEditing();
          } else if (isResourceEditorOpen) {
            handleCancelResourceEditing();
          }
        }}
        closeLabel="Close content editor"
        className="membership-content-drawer"
      >
        {isPostEditorOpen && (
          <MembershipPostEditor
            value={postDraft}
            onChange={setPostDraft}
            onSave={handleSavePost}
            onCancel={handleCancelPostEditing}
            isSaving={isMutating}
            saveError={mutationError}
            saveLabel="Save"
          />
        )}

        {isVideoEditorOpen && (
          <MembershipVideoEditor
            value={videoDraft}
            onChange={setVideoDraft}
            onSave={handleSaveVideo}
            onCancel={handleCancelVideoEditing}
            isSaving={isMutating}
            saveError={mutationError}
            saveLabel="Save"
          />
        )}

        {isResourceEditorOpen && (
          <MembershipResourceEditor
            value={resourceDraft}
            onChange={setResourceDraft}
            onSave={handleSaveResource}
            onCancel={handleCancelResourceEditing}
            isSaving={isMutating}
            saveError={mutationError}
            saveLabel="Save"
          />
        )}
      </Drawer>

      <div className="membership-content-ordering">
        <RadioGroup
          name="membership-content-ordering"
          label="Content order"
          value={orderingMode}
          onChange={handleOrderingModeChange}
          className="membership-content-ordering__options"
        >
          {MEMBERSHIP_ORDERING_MODE_OPTIONS.map((option) => (
            <Radio
              key={option.value}
              label={option.label}
              value={option.value}
            />
          ))}
        </RadioGroup>
      </div>

      <MembershipIncludedProducts
        ownerId={ownerId}
        currentProductId={currentProductId}
        nativeContentItems={nativeContentItems}
        feedEntries={feedEntries}
        orderingMode={orderingMode}
        includedProductEntries={includedProductEntries}
        productSummaries={productSummaries}
        includedProducts={includedProducts}
        isLoadingProducts={isLoadingProducts}
        productsError={productsError}
        productPickerRequest={productPickerRequest}
        onAddProducts={handleAddIncludedProducts}
        onRemoveProduct={handleRemoveIncludedProduct}
        onMoveFeedEntry={handleMoveFeedEntry}
        onEditContent={handleEditContent}
        onDeleteContent={handleDeleteContent}
        onAddContent={() => setIsChooserOpen(true)}
      />
    </div>
  );
};

export default MembershipContentSection;
