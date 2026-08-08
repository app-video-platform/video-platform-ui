import React, { useState } from 'react';

import { Button } from '@shared/ui';
import MembershipIncludedProducts from './membership-included-products.component';
import MembershipContentTypeChooser from './membership-content-type-chooser.component';
import {
  MEMBERSHIP_CONTENT_TYPE_LABELS,
  MembershipContentChooserSelection,
  MembershipContentCreationMode,
  MembershipContentItemBase,
} from './models';
import './membership-content.styles.scss';

interface MembershipContentSectionProps {
  ownerId?: string;
  currentProductId?: string;
}

const nativeContentItems: MembershipContentItemBase[] = [];

const MembershipContentSection: React.FC<MembershipContentSectionProps> = ({
  ownerId,
  currentProductId,
}) => {
  const [isChooserOpen, setIsChooserOpen] = useState(false);
  const [creationMode, setCreationMode] =
    useState<MembershipContentCreationMode>(null);
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
  };

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

      {creationMode && (
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
      />
    </div>
  );
};

export default MembershipContentSection;
