import React from 'react';

import { Button, Input, Select, Textarea } from '@shared/ui';
import {
  MembershipContentStatus,
  MembershipPostDraft,
} from './models';

interface MembershipPostEditorProps {
  value: MembershipPostDraft;
  // eslint-disable-next-line no-unused-vars
  onChange: (value: MembershipPostDraft) => void;
  onSave: () => void;
  onCancel: () => void;
}

const STATUS_OPTIONS: Array<{ value: MembershipContentStatus; label: string }> =
  [
    { value: 'DRAFT', label: 'Draft' },
    { value: 'PUBLISHED', label: 'Published' },
    { value: 'HIDDEN', label: 'Hidden' },
  ];

const isValidPostDraft = (value: MembershipPostDraft) =>
  value.title.trim().length > 0 && value.body.trim().length > 0;

const MembershipPostEditor: React.FC<MembershipPostEditorProps> = ({
  value,
  onChange,
  onSave,
  onCancel,
}) => {
  const canSave = isValidPostDraft(value);

  return (
    <div className="membership-post-editor">
      <Input
        name="membership-post-title"
        label="Title"
        value={value.title}
        placeholder="Post title"
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          onChange({ ...value, title: event.target.value })
        }
      />

      <Textarea
        name="membership-post-body"
        label="Body"
        value={value.body}
        placeholder="Write a member-only update"
        block
        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
          onChange({ ...value, body: event.target.value })
        }
      />

      <Select
        name="membership-post-status"
        label="Status"
        value={value.status}
        options={STATUS_OPTIONS}
        onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
          onChange({
            ...value,
            status: event.target.value as MembershipContentStatus,
          })
        }
      />

      <div className="membership-post-editor__actions">
        <Button type="button" variant="tertiary" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={onSave}
          disabled={!canSave}
        >
          Save
        </Button>
      </div>
    </div>
  );
};

export default MembershipPostEditor;
