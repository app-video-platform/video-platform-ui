/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';

import { Select, Input, SelectOption } from '@shared/ui';
import { FormErrors } from '@pages/app';
import {
  MeetingMethods,
  CANCELATION_POLICIES,
  CancelationPolicyId,
} from '@api/enums';
import { CancelationPolicy, MeetingMethod } from '@api/models';
import { ProductDraft } from '../models';

import './consultation-details.styles.scss';

export interface IConsultationDetails {
  duration: number;
  meetingMethod?: MeetingMethod;
  customLocation?: string;
  bufferBefore?: number;
  bufferAfter?: number;
  maxSessions?: number;
  confirmationMessage?: string;
  cancelationPolicy?: CancelationPolicy;
}

interface ConsultationDetailsProps {
  formData: ProductDraft;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  setFormData: (e: any) => void;
  errors: FormErrors;
  // showRestOfForm: boolean;
  userId: string;
  // setShowLoadingRestOfForm: (loading: boolean) => void;
  // setShowRestOfForm: (show: boolean) => void;
}

const ConsultationDetails: React.FC<ConsultationDetailsProps> = ({
  formData,
  setFormData,
  errors,
  userId,
}) => {
  const defaultPolicy = CANCELATION_POLICIES.find(
    (p) => p.id === CancelationPolicyId.Full24h,
  );
  const [consultationForm, setConsultationForm] =
    useState<IConsultationDetails>({
      duration: 0,
      maxSessions: 999,
      meetingMethod: MeetingMethods.ZOOM,
      customLocation: '',
      bufferAfter: 0,
      bufferBefore: 0,
      confirmationMessage: '',
      cancelationPolicy: defaultPolicy,
    });

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
    setConsultationForm((prev: IConsultationDetails) => ({
      ...prev,
      [field]: value,
    }));

    const newData = { ...formData, consultationDetails: consultationForm };
    setFormData(newData);
  };

  return (
    <div className="consultation-details">
      <Select
        options={TIME_OPTIONS}
        name="duration"
        label="Duration"
        value={consultationForm.duration}
        onChange={(e: { target: { value: string } }) =>
          handleFormChange('duration', Number(e.target.value))
        }
      />

      <Select
        options={MEETING_METHOD_OPTIONS}
        name="meetingMethod"
        label="Meeting Method"
        value={consultationForm.meetingMethod ?? ''}
        onChange={(e: { target: { value: string } }) =>
          handleFormChange('meetingMethod', e.target.value)
        }
      />

      {consultationForm.meetingMethod === MeetingMethods.OTHER && (
        <Input
          label="Custom Location"
          type="text"
          name="customLocation"
          value={consultationForm.customLocation ?? ''}
          onChange={(e: { target: { value: string } }) =>
            handleFormChange('customLocation', e.target.value)
          }
        />
      )}

      <Input
        label="Buffer Time Before"
        type="number"
        name="bufferBefore"
        value={consultationForm.bufferBefore ?? ''}
        onChange={(e: { target: { value: string } }) =>
          handleFormChange('bufferBefore', e.target.value)
        }
      />

      <Input
        label="Buffer Time After"
        type="number"
        name="bufferAfter"
        value={consultationForm.bufferAfter ?? ''}
        onChange={(e: { target: { value: string } }) =>
          handleFormChange('bufferAfter', e.target.value)
        }
      />

      <Input
        label="Max Sessions per Day"
        type="number"
        name="maxSessions"
        value={consultationForm.maxSessions ?? ''}
        onChange={(e: { target: { value: string } }) =>
          handleFormChange('maxSessions', e.target.value)
        }
      />

      <Input
        label="Confirmation Message"
        type="number"
        name="confirmationMessage"
        value={consultationForm.confirmationMessage ?? ''}
        onChange={(e: { target: { value: string } }) =>
          handleFormChange('confirmationMessage', e.target.value)
        }
      />
    </div>
  );
};

export default ConsultationDetails;
