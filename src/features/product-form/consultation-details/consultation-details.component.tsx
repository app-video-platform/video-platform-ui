/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useEffect } from 'react';

import {
  Select,
  Input,
  SelectOption,
  Textarea,
  InfoPopover,
  RadioGroup,
  Radio,
} from '@shared/ui';
import { FormErrors } from '@pages/app';
import {
  MeetingMethods,
  CANCELATION_POLICIES,
  CancelationPolicyId,
} from '@api/enums';
import { ConsultationDetails } from '@api/models';
import { ProductDraft } from '../models';

import './consultation-details.styles.scss';

interface ConsultationDetailsProps {
  formData: ProductDraft;
  // eslint-disable-next-line no-unused-vars
  setFormData: (e: ProductDraft) => void;
  errors: FormErrors;
}

const ConsultationDetailsSection: React.FC<ConsultationDetailsProps> = ({
  formData,
  setFormData,
}) => {
  const defaultPolicy = CANCELATION_POLICIES.find(
    (p) => p.id === CancelationPolicyId.Full24h,
  );

  useEffect(() => {
    const consDetails: ConsultationDetails = {
      bufferAfterMinutes: 10,
      bufferBeforeMinutes: 10,
      cancellationPolicy: defaultPolicy?.id,
      confirmationMessage:
        'Thanks for booking! Please check your inbox for the Zoom link.',
      connectedCalendars: [],
      customLocation: '',
      duration: 50,
      maxSessionsPerDay: 8,
      meetingMethod: MeetingMethods.ZOOM,
    };
    const newData = { ...formData, consultationDetails: consDetails };
    setFormData(newData);
  }, []);

  const TIME_OPTIONS: SelectOption[] = Array.from(
    { length: (120 - 20) / 5 + 1 },
    (_, i) => {
      const value = 20 + i * 5;
      return {
        value,
        label: `${value} minutes`,
      };
    },
  );

  const MEETING_METHOD_OPTIONS: SelectOption[] = Object.entries(
    MeetingMethods,
  ).map(([key, value]) => ({
    value: key, // 'ZOOM', 'GOOGLE', etc.
    label: value, // 'Zoom', 'Google Meet', etc.
  }));

  const handleFormChange = (field: string, value: string | number) => {
    const consDetails = { ...formData.consultationDetails, [field]: value };

    const newData = { ...formData, consultationDetails: consDetails };
    setFormData(newData);
  };

  const handleCancellationPolicyChange = (policyId: string) => {
    const policy = CANCELATION_POLICIES.find((p) => p.id === policyId);
    const newData = {
      ...formData,
      consultationDetails: {
        ...formData.consultationDetails,
        cancelationPolicy: policy,
      },
    };
    setFormData(newData);
  };

  return (
    <div className="consultation-details">
      <div className="inline-fields">
        <Select
          options={TIME_OPTIONS}
          name="duration"
          label="Meeting Duration"
          value={formData.consultationDetails?.duration ?? 0}
          onChange={(e: { target: { value: string } }) =>
            handleFormChange('duration', Number(e.target.value))
          }
        />

        <Select
          options={MEETING_METHOD_OPTIONS}
          name="meetingMethod"
          label="Meeting Method"
          value={formData.consultationDetails?.meetingMethod ?? ''}
          onChange={(e: { target: { value: string } }) =>
            handleFormChange('meetingMethod', e.target.value)
          }
        />
      </div>

      {formData.consultationDetails?.meetingMethod === MeetingMethods.OTHER && (
        <Input
          label="Custom Location"
          type="text"
          name="customLocation"
          value={formData.consultationDetails?.customLocation ?? ''}
          onChange={(e: { target: { value: string } }) =>
            handleFormChange('customLocation', e.target.value)
          }
        />
      )}

      <div className="sentence-field">
        <span>I want</span>

        <Input
          type="number"
          name="bufferBefore"
          className="sentence-input"
          value={formData.consultationDetails?.bufferBeforeMinutes ?? ''}
          onChange={(e: { target: { value: string } }) =>
            handleFormChange('bufferBefore', e.target.value)
          }
        />
        <span>minutes buffer before each meeting</span>
        <InfoPopover>
          Extra time added before each session. This prevents back-to-back
          bookings and gives you preparation time before meeting the next client
        </InfoPopover>
      </div>

      <div className="sentence-field">
        <span>I want</span>

        <Input
          type="number"
          name="bufferAfter"
          className="sentence-input"
          value={formData.consultationDetails?.bufferAfterMinutes ?? ''}
          onChange={(e: { target: { value: string } }) =>
            handleFormChange('bufferAfter', e.target.value)
          }
        />
        <span>minutes buffer after each meeting</span>
        <InfoPopover>
          Extra time added after each session to prevent immediate back-to-back
          bookings
        </InfoPopover>
      </div>

      <div className="sentence-field">
        <span>I can do maximum</span>

        <Input
          type="number"
          name="maxSessions"
          className="sentence-input"
          value={formData.consultationDetails?.maxSessionsPerDay ?? ''}
          onChange={(e: { target: { value: string } }) =>
            handleFormChange('maxSessions', e.target.value)
          }
        />
        <span>session per day</span>
        <InfoPopover>
          The maximum number of sessions you allow clients to book in a single
          day
        </InfoPopover>
      </div>

      <Textarea
        label="Confirmation Message"
        name="confirmationMessage"
        value={formData.consultationDetails?.confirmationMessage ?? ''}
        onChange={(e: { target: { value: string } }) =>
          handleFormChange('confirmationMessage', e.target.value)
        }
      />

      <RadioGroup
        name="cancelationPolicy"
        value={formData.consultationDetails?.cancellationPolicy ?? ''}
        onChange={(v) => handleCancellationPolicyChange(v)}
        label="Cancellation Policy"
        className="cancellation-group"
      >
        {CANCELATION_POLICIES.map((policy, index) => (
          <Radio
            key={index}
            value={policy.id}
            label={policy.label}
            description={policy.notes}
          />
        ))}
      </RadioGroup>
    </div>
  );
};

export default ConsultationDetailsSection;
