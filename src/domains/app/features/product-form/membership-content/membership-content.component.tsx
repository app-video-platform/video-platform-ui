import React, { useState } from 'react';

import { Button, Radio, RadioGroup } from '@shared/ui';
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
  createMembershipResourceItem,
  createMembershipPostItem,
  createMembershipVideoItem,
  updateMembershipResourceItem,
  updateMembershipPostItem,
  updateMembershipVideoItem,
} from './models';
import './membership-content.styles.scss';

interface MembershipContentSectionProps {
  ownerId?: string;
  currentProductId?: string;
  nativeContentItems: MembershipContentItem[];
  feedEntries: MembershipFeedEntry[];
  orderingMode: MembershipOrderingMode;
  includedProductEntries: MembershipProductFeedEntry[];
  // eslint-disable-next-line no-unused-vars
  getNextNativeContentId: (type: MembershipContentItem['type']) => string;
  // eslint-disable-next-line no-unused-vars
  onAddNativeContentItem: (
    // eslint-disable-next-line no-unused-vars
    item: MembershipContentItem,
    // eslint-disable-next-line no-unused-vars
    addedAt: string,
  ) => void;
  // eslint-disable-next-line no-unused-vars
  onUpdateNativeContentItem: (
    // eslint-disable-next-line no-unused-vars
    contentId: string,
    // eslint-disable-next-line no-unused-vars
    updater: (item: MembershipContentItem) => MembershipContentItem,
  ) => void;
  // eslint-disable-next-line no-unused-vars
  onDeleteNativeContentItem: (contentId: string) => void;
  // eslint-disable-next-line no-unused-vars
  onOrderingModeChange: (orderingMode: MembershipOrderingMode) => void;
  // eslint-disable-next-line no-unused-vars
  onAddIncludedProducts: (productIds: string[], addedAt: string) => void;
  // eslint-disable-next-line no-unused-vars
  onRemoveIncludedProduct: (productId?: string) => void;
  // eslint-disable-next-line no-unused-vars
  onMoveFeedEntry: (entryId: string, direction: 'UP' | 'DOWN') => void;
}

const MembershipContentSection: React.FC<MembershipContentSectionProps> = ({
  ownerId,
  currentProductId,
  nativeContentItems,
  feedEntries,
  orderingMode,
  includedProductEntries,
  getNextNativeContentId,
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

  const handleSelectContentType = (
    selection: MembershipContentChooserSelection,
  ) => {
    setIsChooserOpen(false);

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

  const handleSavePost = () => {
    const title = postDraft.title.trim();
    const body = postDraft.body.trim();

    if (!title || !body) {
      return;
    }

    const now = new Date().toISOString();

    if (editingContentId) {
      onUpdateNativeContentItem(editingContentId, (item) =>
        item.type === 'POST' ? updateMembershipPostItem(item, postDraft, now) : item,
      );
    } else {
      const localPostId = getNextNativeContentId('POST');

      onAddNativeContentItem(
        createMembershipPostItem(postDraft, localPostId, now),
        now,
      );
    }

    setCreationMode(null);
    setEditingContentId(null);
    setPostDraft(createBlankMembershipPostDraft());
  };

  const handleCancelPostEditing = () => {
    setCreationMode(null);
    setEditingContentId(null);
    setPostDraft(createBlankMembershipPostDraft());
  };

  const handleSaveVideo = () => {
    const title = videoDraft.title.trim();

    if (!title || !videoDraft.video) {
      return;
    }

    const now = new Date().toISOString();

    if (editingContentId) {
      onUpdateNativeContentItem(editingContentId, (item) =>
        item.type === 'VIDEO'
          ? updateMembershipVideoItem(item, videoDraft, now)
          : item,
      );
    } else {
      const localVideoId = getNextNativeContentId('VIDEO');

      onAddNativeContentItem(
        createMembershipVideoItem(videoDraft, localVideoId, now),
        now,
      );
    }

    setCreationMode(null);
    setEditingContentId(null);
    setVideoDraft(createBlankMembershipVideoDraft());
  };

  const handleCancelVideoEditing = () => {
    setCreationMode(null);
    setEditingContentId(null);
    setVideoDraft(createBlankMembershipVideoDraft());
  };

  const handleSaveResource = () => {
    const title = resourceDraft.title.trim();

    if (!title || !resourceDraft.file) {
      return;
    }

    const now = new Date().toISOString();

    if (editingContentId) {
      onUpdateNativeContentItem(editingContentId, (item) =>
        item.type === 'RESOURCE'
          ? updateMembershipResourceItem(item, resourceDraft, now)
          : item,
      );
    } else {
      const localResourceId = getNextNativeContentId('RESOURCE');

      onAddNativeContentItem(
        createMembershipResourceItem(resourceDraft, localResourceId, now),
        now,
      );
    }

    setCreationMode(null);
    setEditingContentId(null);
    setResourceDraft(createBlankMembershipResourceDraft());
  };

  const handleCancelResourceEditing = () => {
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

  const handleDeleteContent = (contentId: string) => {
    onDeleteNativeContentItem(contentId);
  };

  const isPostEditorOpen = creationMode === 'POST';
  const isVideoEditorOpen = creationMode === 'VIDEO';
  const isResourceEditorOpen = creationMode === 'RESOURCE';

  return (
    <div className="membership-content">
      <div className="membership-content__header">
        <div>
          <h3>Membership Content</h3>
          <p>Add member-only content or include existing products.</p>
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={() => setIsChooserOpen(true)}
        >
          + Add Content
        </Button>
      </div>

      {isChooserOpen && (
        <MembershipContentTypeChooser
          onSelect={handleSelectContentType}
          onCancel={() => setIsChooserOpen(false)}
        />
      )}

      {isPostEditorOpen && (
        <MembershipPostEditor
          value={postDraft}
          onChange={setPostDraft}
          onSave={handleSavePost}
          onCancel={handleCancelPostEditing}
        />
      )}

      {isVideoEditorOpen && (
        <MembershipVideoEditor
          value={videoDraft}
          onChange={setVideoDraft}
          onSave={handleSaveVideo}
          onCancel={handleCancelVideoEditing}
        />
      )}

      {isResourceEditorOpen && (
        <MembershipResourceEditor
          value={resourceDraft}
          onChange={setResourceDraft}
          onSave={handleSaveResource}
          onCancel={handleCancelResourceEditing}
        />
      )}

      <div className="membership-content-ordering">
        <RadioGroup
          name="membership-content-ordering"
          label="Content order"
          value={orderingMode}
          onChange={(value) =>
            onOrderingModeChange(value as MembershipOrderingMode)
          }
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
        productPickerRequest={productPickerRequest}
        isContentListHidden={Boolean(creationMode)}
        onAddProducts={onAddIncludedProducts}
        onRemoveProduct={onRemoveIncludedProduct}
        onMoveFeedEntry={onMoveFeedEntry}
        onEditContent={handleEditContent}
        onDeleteContent={handleDeleteContent}
      />
    </div>
  );
};

export default MembershipContentSection;
