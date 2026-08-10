import React from 'react';

import { Button, GalUppyFileUploader, Input, Select, Textarea } from '@shared/ui';
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
  onSave: () => void;
  onCancel: () => void;
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
}) => {
  const canSave = isValidVideoDraft(value);

  const handleFilesChange = (files: File[]) => {
    const selectedVideo = files[0];

    onChange({
      ...value,
      video: selectedVideo ? createMembershipVideoFileRef(selectedVideo) : null,
    });
  };

  return (
    <div className="membership-video-editor">
      <Input
        name="membership-video-title"
        label="Title"
        value={value.title}
        placeholder="Video title"
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
        <label>Video</label>
        <GalUppyFileUploader
          allowedFileTypes={VIDEO_ALLOWED_FILE_TYPES}
          maxNumberOfFiles={1}
          maxFileSize={MAX_VIDEO_FILE_SIZE}
          disableImporters
          uploadMode="SELECT_ONLY"
          onFilesChange={handleFilesChange}
        />
        {value.video && (
          <p className="membership-video-editor__selected">
            Selected video: {value.video.fileName} (
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

      <div className="membership-video-editor__actions">
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

export default MembershipVideoEditor;
