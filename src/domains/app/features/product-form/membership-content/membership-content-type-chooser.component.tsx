import React from 'react';
import {
  HiDocumentText,
  HiFolderAdd,
  HiPlay,
  HiPlusCircle,
} from 'react-icons/hi';
import { IconType } from 'react-icons';

import { Button, Icon } from '@shared/ui';
import { getCssVar } from '@shared/utils';
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
  icon: IconType;
}> = [
  {
    selection: 'POST',
    label: 'Post',
    description: 'Publish a written update for members.',
    icon: HiDocumentText,
  },
  {
    selection: 'VIDEO',
    label: 'Video',
    description: 'Select a member-only video file.',
    icon: HiPlay,
  },
  {
    selection: 'RESOURCE',
    label: 'Resource',
    description: 'Select a downloadable file for members.',
    icon: HiFolderAdd,
  },
  {
    selection: 'EXISTING_PRODUCT',
    label: 'Existing Product',
    description: 'Include an existing Course or Download.',
    icon: HiPlusCircle,
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
          <span className="membership-content-type-chooser__option-icon">
            <Icon
              icon={option.icon}
              size={18}
              color={getCssVar('--brand-primary')}
            />
          </span>
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
