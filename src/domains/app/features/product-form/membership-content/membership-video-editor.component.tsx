import React, { useState } from 'react';

import { Button, UppyFileUploader, Input, Select, Textarea } from '@shared/ui';
import {
  MembershipContentStatus,
  MEMBERSHIP_CONTENT_STATUS_OPTIONS,
  MembershipVideoDraft,
  createMembershipVideoFileRef,
  formatMembershipFileSize,
} from './models';

interface MembershipVideoEditorProps {
  value: MembershipVideoDraft;
  // eslint-disable-next-line no-unused-vars
  onChange: (value: MembershipVideoDraft) => void;
  onSave: () => Promise<void> | void;
  onCancel: () => void;
  isSaving?: boolean;
  saveError?: string | null;
  saveLabel?: string;
}

const VIDEO_ALLOWED_FILE_TYPES = ['video/*'];
const MAX_VIDEO_FILE_SIZE = 500 * 1024 * 1024;

const isValidVideoDraft = (value: MembershipVideoDraft) =>
  value.title.trim().length > 0 && Boolean(value.video);

const MembershipVideoEditor: React.FC<MembershipVideoEditorProps> = ({
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
    hasSubmitted && !value.title.trim() ? 'Enter a video title.' : undefined;
  const videoError =
    hasSubmitted && !value.video ? 'Select a video file.' : undefined;

  const handleFilesChange = (files: File[]) => {
    const selectedVideo = files[0];

    onChange({
      ...value,
      video: selectedVideo ? createMembershipVideoFileRef(selectedVideo) : null,
    });
  };

  const handleSave = () => {
    setHasSubmitted(true);

    if (!isValidVideoDraft(value)) {
      return;
    }

    onSave();
  };

  return (
    <div className="membership-video-editor">
      <Input
        name="membership-video-title"
        label="Title"
        value={value.title}
        placeholder="Video title"
        error={titleError}
        onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
          onChange({ ...value, title: event.target.value })
        }
      />

      <Textarea
        name="membership-video-description"
        label="Description"
        value={value.description}
        placeholder="Describe this member-only video"
        block
        onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
          onChange({ ...value, description: event.target.value })
        }
      />

      <div className="membership-video-editor__video">
        <div className="membership-content-editor__field-heading">
          <span id="membership-video-file-label">Selected video</span>
          <small>
            Video upload will be connected when media storage is available.
          </small>
        </div>
        <UppyFileUploader
          allowedFileTypes={VIDEO_ALLOWED_FILE_TYPES}
          maxNumberOfFiles={1}
          maxFileSize={MAX_VIDEO_FILE_SIZE}
          disableImporters
          uploadMode="SELECT_ONLY"
          onFilesChange={handleFilesChange}
        />
        {videoError && (
          <span className="input-error-message" role="alert">
            {videoError}
          </span>
        )}
        {value.video && (
          <p className="membership-video-editor__selected">
            Selected file: {value.video.fileName} (
            {formatMembershipFileSize(value.video.size)})
          </p>
        )}
      </div>

      <Select
        name="membership-video-status"
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

      <div className="membership-video-editor__actions">
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

export default MembershipVideoEditor;
