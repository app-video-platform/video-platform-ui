import React, { useState } from 'react';

import { Button, Input, Select, Textarea } from '@shared/ui';
import {
  MembershipContentStatus,
  MEMBERSHIP_CONTENT_STATUS_OPTIONS,
  MembershipPostDraft,
} from './models';

interface MembershipPostEditorProps {
  value: MembershipPostDraft;
  // eslint-disable-next-line no-unused-vars
  onChange: (value: MembershipPostDraft) => void;
  onSave: () => Promise<void> | void;
  onCancel: () => void;
  isSaving?: boolean;
  saveError?: string | null;
  saveLabel?: string;
}

const isValidPostDraft = (value: MembershipPostDraft) =>
  value.title.trim().length > 0 && value.body.trim().length > 0;

const MembershipPostEditor: React.FC<MembershipPostEditorProps> = ({
  value,
  onChange,
  onSave,
  onCancel,
  isSaving = false,
  saveError,
  saveLabel = 'Save',
}) => {
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const titleError =
    hasSubmitted && !value.title.trim() ? 'Enter a post title.' : undefined;
  const bodyError =
    hasSubmitted && !value.body.trim() ? 'Write the member-only post body.' : undefined;

  const handleSave = () => {
    setHasSubmitted(true);

    if (!isValidPostDraft(value)) {
      return;
    }

    onSave();
  };

  return (
    <div className="membership-post-editor">
      <Input
        name="membership-post-title"
        label="Title"
        value={value.title}
        placeholder="Post title"
        error={titleError}
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
        error={bodyError}
        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
          onChange({ ...value, body: event.target.value })
        }
      />

      <Select
        name="membership-post-status"
        label="Status"
        value={value.status}
        options={MEMBERSHIP_CONTENT_STATUS_OPTIONS}
        onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
          onChange({
            ...value,
            status: event.target.value as MembershipContentStatus,
          })
        }
      />

      {saveError && (
        <p className="membership-content-editor__error" role="alert">
          {saveError}
        </p>
      )}

      <div className="membership-post-editor__actions">
        <Button
          type="button"
          variant="tertiary"
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancel
        </Button>
        <Button
          type="button"
          variant="primary"
          onClick={handleSave}
          loading={isSaving}
        >
          {saveLabel}
        </Button>
      </div>
    </div>
  );
};

export default MembershipPostEditor;
