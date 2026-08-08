import React, { useRef, useState } from 'react';

import { Button } from '@shared/ui';
import MembershipIncludedProducts from './membership-included-products.component';
import MembershipContentTypeChooser from './membership-content-type-chooser.component';
import MembershipPostEditor from './membership-post-editor.component';
import {
  MEMBERSHIP_CONTENT_TYPE_LABELS,
  MembershipContentChooserSelection,
  MembershipContentCreationMode,
  MembershipContentItem,
  MembershipPostDraft,
  createBlankMembershipPostDraft,
  createMembershipPostItem,
  updateMembershipPostItem,
} from './models';
import './membership-content.styles.scss';

interface MembershipContentSectionProps {
  ownerId?: string;
  currentProductId?: string;
}

const MembershipContentSection: React.FC<MembershipContentSectionProps> = ({
  ownerId,
  currentProductId,
}) => {
  const nextLocalPostId = useRef(1);
  const [nativeContentItems, setNativeContentItems] = useState<
    MembershipContentItem[]
  >([]);
  const [isChooserOpen, setIsChooserOpen] = useState(false);
  const [creationMode, setCreationMode] =
    useState<MembershipContentCreationMode>(null);
  const [editingContentId, setEditingContentId] = useState<string | null>(null);
  const [postDraft, setPostDraft] = useState<MembershipPostDraft>(
    createBlankMembershipPostDraft,
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
  };

  const handleSavePost = () => {
    const title = postDraft.title.trim();
    const body = postDraft.body.trim();

    if (!title || !body) {
      return;
    }

    const now = new Date().toISOString();

    if (editingContentId) {
      setNativeContentItems((currentItems) =>
        currentItems.map((item) =>
          item.id === editingContentId && item.type === 'POST'
            ? updateMembershipPostItem(item, postDraft, now)
            : item,
        ),
      );
    } else {
      const localPostId = `membership-post-${nextLocalPostId.current}`;
      nextLocalPostId.current += 1;

      setNativeContentItems((currentItems) => [
        ...currentItems,
        createMembershipPostItem(postDraft, localPostId, now),
      ]);
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

  const handleEditContent = (contentId: string) => {
    const content = nativeContentItems.find((item) => item.id === contentId);

    if (!content || content.type !== 'POST') {
      return;
    }

    setIsChooserOpen(false);
    setCreationMode('POST');
    setEditingContentId(content.id);
    setPostDraft({
      title: content.title,
      body: content.body,
      status: content.status,
    });
  };

  const handleDeleteContent = (contentId: string) => {
    setNativeContentItems((currentItems) =>
      currentItems.filter((item) => item.id !== contentId),
    );
  };

  const isPostEditorOpen = creationMode === 'POST';

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

      {creationMode && creationMode !== 'POST' && (
        <div className="membership-content-creation-placeholder">
          <div>
            <h4>
              Creating {MEMBERSHIP_CONTENT_TYPE_LABELS[creationMode]}
            </h4>
            <p>
              {MEMBERSHIP_CONTENT_TYPE_LABELS[creationMode]} editor coming next.
            </p>
          </div>
          <Button
            type="button"
            variant="tertiary"
            onClick={() => setCreationMode(null)}
          >
            Cancel
          </Button>
        </div>
      )}

      <MembershipIncludedProducts
        ownerId={ownerId}
        currentProductId={currentProductId}
        nativeContentItems={nativeContentItems}
        productPickerRequest={productPickerRequest}
        isContentListHidden={Boolean(creationMode)}
        onEditContent={handleEditContent}
        onDeleteContent={handleDeleteContent}
      />
    </div>
  );
};

export default MembershipContentSection;
