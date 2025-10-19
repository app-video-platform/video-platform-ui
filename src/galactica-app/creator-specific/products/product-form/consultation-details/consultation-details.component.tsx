/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import React, { useState } from 'react';

import { FormErrors, NewProductFormData } from '../product-form.component';
import GalSelect, {
  GalSelectOption,
} from '../../../../../components/gal-select/gal-select.component';
import GalFormInput from '../../../../../components/gal-form-input/gal-form-input.component';

import './consultation-details.styles.scss';
import {
  CancelationPolicyId,
  CANCELATION_POLICIES,
} from '../../../../../api/enums/cancellation-policy.enum';
import { MeetingMethods } from '../../../../../api/enums/meeting-methods.enum';
import { CancelationPolicy } from '../../../../../api/models/cancellation/cancellation-policy';

export interface IConsultationDetails {
  duration: number;
  meetingMethod: MeetingMethods;
  customLocation?: string;
  bufferBefore?: number;
  bufferAfter?: number;
  maxSessions?: number;
  confirmationMessage?: string;
  cancelationPolicy?: CancelationPolicy;
}

interface ConsultationDetailsProps {
  formData: NewProductFormData;
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

  const TIME_OPTIONS: GalSelectOption[] = Array.from(
    { length: (120 - 20) / 5 + 1 },
    (_, i) => {
      const value = 20 + i * 5;
      return {
        value,
        label: `${value} minutes`,
      };
    },
  );

  const MEETING_METHOD_OPTIONS: GalSelectOption[] = Object.entries(
    MeetingMethods,
  ).map(([key, value]) => ({
    value: key, // 'ZOOM', 'GOOGLE', etc.
    label: value, // 'Zoom', 'Google Meet', etc.
  }));

  const handleFormChange = (field: string, value: string | number) => {
    setConsultationForm((prev: any) => ({ ...prev, [field]: value }));

    const newData = { ...formData, consultationDetails: consultationForm };
    setFormData(newData);
  };

  return (
    <div className="consultation-details">
      <GalSelect
        options={TIME_OPTIONS}
        name="duration"
        label="Duration"
        value={consultationForm.duration}
        onChange={(e: { target: { value: string } }) =>
          handleFormChange('duration', Number(e.target.value))
        }
      />

      <GalSelect
        options={MEETING_METHOD_OPTIONS}
        name="meetingMethod"
        label="Meeting Method"
        value={consultationForm.meetingMethod}
        onChange={(e: { target: { value: string } }) =>
          handleFormChange('meetingMethod', e.target.value)
        }
      />

      {consultationForm.meetingMethod === MeetingMethods.OTHER && (
        <GalFormInput
          label="Custom Location"
          type="text"
          name="customLocation"
          value={consultationForm.customLocation ?? ''}
          onChange={(e: { target: { value: string } }) =>
            handleFormChange('customLocation', e.target.value)
          }
        />
      )}

      <GalFormInput
        label="Buffer Time Before"
        type="number"
        name="bufferBefore"
        value={consultationForm.bufferBefore ?? ''}
        onChange={(e: { target: { value: string } }) =>
          handleFormChange('bufferBefore', e.target.value)
        }
      />

      <GalFormInput
        label="Buffer Time After"
        type="number"
        name="bufferAfter"
        value={consultationForm.bufferAfter ?? ''}
        onChange={(e: { target: { value: string } }) =>
          handleFormChange('bufferAfter', e.target.value)
        }
      />

      <GalFormInput
        label="Max Sessions per Day"
        type="number"
        name="maxSessions"
        value={consultationForm.maxSessions ?? ''}
        onChange={(e: { target: { value: string } }) =>
          handleFormChange('maxSessions', e.target.value)
        }
      />

      <GalFormInput
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
