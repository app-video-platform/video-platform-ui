import React from 'react';

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
  onSave: () => void;
  onCancel: () => void;
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
}) => {
  const canSave = isValidResourceDraft(value);

  const handleFilesChange = (files: File[]) => {
    const selectedFile = files[0];

    onChange({
      ...value,
      file: selectedFile ? createMembershipResourceFileRef(selectedFile) : null,
    });
  };

  return (
    <div className="membership-resource-editor">
      <Input
        name="membership-resource-title"
        label="Title"
        value={value.title}
        placeholder="Resource title"
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
        <label>File</label>
        <UppyFileUploader
          allowedFileTypes={RESOURCE_ALLOWED_FILE_TYPES}
          maxNumberOfFiles={1}
          maxFileSize={MAX_RESOURCE_FILE_SIZE}
          disableImporters
          uploadMode="SELECT_ONLY"
          onFilesChange={handleFilesChange}
        />
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

      <div className="membership-resource-editor__actions">
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

export default MembershipResourceEditor;
