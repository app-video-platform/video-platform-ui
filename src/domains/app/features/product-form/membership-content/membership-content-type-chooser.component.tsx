import React from 'react';

import { Button } from '@shared/ui';
import { MembershipContentChooserSelection } from './models';

interface MembershipContentTypeChooserProps {
  // eslint-disable-next-line no-unused-vars
  onSelect: (selection: MembershipContentChooserSelection) => void;
  onCancel: () => void;
}

const CONTENT_OPTIONS: Array<{
  selection: MembershipContentChooserSelection;
  label: string;
  description: string;
}> = [
  {
    selection: 'VIDEO',
    label: 'Video',
    description: 'Upload a member-only video',
  },
  {
    selection: 'POST',
    label: 'Post',
    description: 'Publish a text update',
  },
  {
    selection: 'RESOURCE',
    label: 'Resource',
    description: 'Share a downloadable file',
  },
  {
    selection: 'EXISTING_PRODUCT',
    label: 'Existing Product',
    description: 'Include an existing Course or Download',
  },
];

const MembershipContentTypeChooser: React.FC<
  MembershipContentTypeChooserProps
> = ({ onSelect, onCancel }) => (
  <div className="membership-content-type-chooser">
    <div className="membership-content-type-chooser__options">
      {CONTENT_OPTIONS.map((option) => (
        <button
          key={option.selection}
          type="button"
          className="membership-content-type-chooser__option"
          onClick={() => onSelect(option.selection)}
        >
          <span>{option.label}</span>
          <small>{option.description}</small>
        </button>
      ))}
    </div>
    <div className="membership-content-type-chooser__actions">
      <Button type="button" variant="tertiary" onClick={onCancel}>
        Cancel
      </Button>
    </div>
  </div>
);

export default MembershipContentTypeChooser;
