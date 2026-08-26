import React, { useState } from 'react';

import { Button, UppyFileUploader, Input, Select, Textarea } from '@shared/ui';
import {
  MembershipContentStatus,
  MEMBERSHIP_CONTENT_STATUS_OPTIONS,
  MembershipResourceDraft,
  createMembershipResourceFileRef,
  formatMembershipFileSize,
} from './models';

interface MembershipResourceEditorProps {
  value: MembershipResourceDraft;
  // eslint-disable-next-line no-unused-vars
  onChange: (value: MembershipResourceDraft) => void;
  onSave: () => Promise<void> | void;
  onCancel: () => void;
  isSaving?: boolean;
  saveError?: string | null;
  saveLabel?: string;
}

const RESOURCE_ALLOWED_FILE_TYPES = [
  'application/pdf',
  'application/zip',
  'application/x-zip-compressed',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'text/*',
  'image/*',
  'audio/*',
];
const MAX_RESOURCE_FILE_SIZE = 500 * 1024 * 1024;

const isValidResourceDraft = (value: MembershipResourceDraft) =>
  value.title.trim().length > 0 && Boolean(value.file);

const MembershipResourceEditor: React.FC<MembershipResourceEditorProps> = ({
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
    hasSubmitted && !value.title.trim() ? 'Enter a resource title.' : undefined;
  const fileError =
    hasSubmitted && !value.file ? 'Select a resource file.' : undefined;

  const handleFilesChange = (files: File[]) => {
    const selectedFile = files[0];

    onChange({
      ...value,
      file: selectedFile ? createMembershipResourceFileRef(selectedFile) : null,
    });
  };

  const handleSave = () => {
    setHasSubmitted(true);

    if (!isValidResourceDraft(value)) {
      return;
    }

    onSave();
  };

  return (
    <div className="membership-resource-editor">
      <Input
        name="membership-resource-title"
        label="Title"
        value={value.title}
        placeholder="Resource title"
        error={titleError}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          onChange({ ...value, title: event.target.value })
        }
      />

      <Textarea
        name="membership-resource-description"
        label="Description"
        value={value.description}
        placeholder="Describe this member-only resource"
        block
        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
          onChange({ ...value, description: event.target.value })
        }
      />

      <div className="membership-resource-editor__file">
        <div className="membership-content-editor__field-heading">
          <span id="membership-resource-file-label">Selected file</span>
          <small>
            File upload will be connected when media storage is available.
          </small>
        </div>
        <UppyFileUploader
          allowedFileTypes={RESOURCE_ALLOWED_FILE_TYPES}
          maxNumberOfFiles={1}
          maxFileSize={MAX_RESOURCE_FILE_SIZE}
          disableImporters
          uploadMode="SELECT_ONLY"
          onFilesChange={handleFilesChange}
        />
        {fileError && (
          <span className="input-error-message" role="alert">
            {fileError}
          </span>
        )}
        {value.file && (
          <p className="membership-resource-editor__selected">
            Selected file: {value.file.fileName} (
            {formatMembershipFileSize(value.file.size)})
          </p>
        )}
      </div>

      <Select
        name="membership-resource-status"
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

      <div className="membership-resource-editor__actions">
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

export default MembershipResourceEditor;
