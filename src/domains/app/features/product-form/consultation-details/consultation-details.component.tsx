import React, { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

import {
  Button,
  Input,
  Radio,
  RadioGroup,
  Select,
  SelectOption,
  StatusBadge,
  Textarea,
} from '@shared/ui';
import { FormErrors } from 'domains/app/pages';
import {
  CancelationPolicyId,
  CANCELATION_POLICIES,
  MeetingMethods,
} from 'core/enums';
import { MEETING_METHODS } from 'core/constants';
import {
  ConsultationAvailabilityWindow,
  ConsultationDayAvailability,
  ConsultationDetails,
  ConsultationWeekday,
} from 'core/api/models';
import { ProductDraft } from '../models';

import './consultation-details.styles.scss';

interface ConsultationDetailsProps {
  formData: ProductDraft;
  // eslint-disable-next-line no-unused-vars
  setFormData: (e: ProductDraft) => void;
  errors: FormErrors;
}

const DAY_LABELS: Record<ConsultationWeekday, string> = {
  MONDAY: 'Monday',
  TUESDAY: 'Tuesday',
  WEDNESDAY: 'Wednesday',
  THURSDAY: 'Thursday',
  FRIDAY: 'Friday',
  SATURDAY: 'Saturday',
  SUNDAY: 'Sunday',
};

const WEEKDAYS = Object.keys(DAY_LABELS) as ConsultationWeekday[];

const DEFAULT_WEEKLY_AVAILABILITY: ConsultationDayAvailability[] = WEEKDAYS.map(
  (day) => ({
    day,
    enabled: !['SATURDAY', 'SUNDAY'].includes(day),
    windows: !['SATURDAY', 'SUNDAY'].includes(day)
      ? [{ startTime: '09:00', endTime: '17:00' }]
      : [],
  }),
);

const TIME_OPTIONS: SelectOption[] = [30, 45, 50, 60, 75, 90, 120].map(
  (value) => ({
    value,
    label: value < 60 ? `${value} minutes` : `${value / 60} hour${value === 60 ? '' : 's'}`,
  }),
);

const MEETING_METHOD_OPTIONS: SelectOption[] = Object.entries(MEETING_METHODS)
  .map(([value, label]) => ({
    value,
    label,
  }));

const defaultPolicy = CANCELATION_POLICIES.find(
  (policy) => policy.id === CancelationPolicyId.Full24h,
);

const createDefaultConsultationDetails = (): ConsultationDetails => ({
  bufferAfterMinutes: 10,
  bufferBeforeMinutes: 10,
  cancellationPolicy: defaultPolicy?.id,
  confirmationMessage:
    'Thanks for booking. You will receive the session details after your booking is confirmed.',
  connectedCalendars: [],
  customLocation: '',
  durationMinutes: 50,
  maxSessionsPerDay: 8,
  meetingMethod: MeetingMethods.ZOOM,
  weeklyAvailability: DEFAULT_WEEKLY_AVAILABILITY,
});

const normalizeWeeklyAvailability = (
  value?: ConsultationDayAvailability[],
): ConsultationDayAvailability[] =>
  WEEKDAYS.map((day) => {
    const existing = value?.find((item) => item.day === day);
    const defaultDay = DEFAULT_WEEKLY_AVAILABILITY.find(
      (item) => item.day === day,
    ) ?? {
      day,
      enabled: false,
      windows: [],
    };

    if (existing) {
      return {
        day,
        enabled: existing.enabled,
        windows: existing.enabled && existing.windows.length === 0
          ? [{ startTime: '09:00', endTime: '17:00' }]
          : existing.windows,
      };
    }

    return defaultDay;
  });

const toMinutes = (value: string) => {
  const [hours, minutes] = value.split(':').map(Number);

  return hours * 60 + minutes;
};

const getDayValidation = (day: ConsultationDayAvailability): string | null => {
  if (!day.enabled) {
    return null;
  }

  if (day.windows.length === 0) {
    return `${DAY_LABELS[day.day]} needs at least one time range.`;
  }

  const sorted = [...day.windows].sort(
    (a, b) => toMinutes(a.startTime) - toMinutes(b.startTime),
  );

  for (const window of sorted) {
    if (!window.startTime || !window.endTime) {
      return 'Start and end times are required.';
    }

    if (toMinutes(window.startTime) >= toMinutes(window.endTime)) {
      return 'Start time must be before end time.';
    }
  }

  for (let index = 1; index < sorted.length; index += 1) {
    const previous = sorted[index - 1];
    const current = sorted[index];

    if (toMinutes(current.startTime) < toMinutes(previous.endTime)) {
      return 'Time ranges cannot overlap.';
    }
  }

  return null;
};

const ConsultationDetailsSection: React.FC<ConsultationDetailsProps> = ({
  formData,
  setFormData,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (formData.consultationDetails) {
      return;
    }

    setFormData({
      ...formData,
      consultationDetails: createDefaultConsultationDetails(),
    });
  }, [formData, setFormData]);

  const details = formData.consultationDetails ?? createDefaultConsultationDetails();
  const weeklyAvailability = useMemo(
    () => normalizeWeeklyAvailability(details.weeklyAvailability),
    [details.weeklyAvailability],
  );
  const connectedCalendars = details.connectedCalendars ?? [];
  const enabledDays = weeklyAvailability.filter((day) => day.enabled);
  const dayErrors = weeklyAvailability.reduce<Record<ConsultationWeekday, string | null>>(
    (acc, day) => ({
      ...acc,
      [day.day]: getDayValidation(day),
    }),
    {} as Record<ConsultationWeekday, string | null>,
  );
  const hasAvailabilityErrors = Object.values(dayErrors).some(Boolean);

  const updateDetails = (patch: Partial<ConsultationDetails>) => {
    setFormData({
      ...formData,
      consultationDetails: {
        ...details,
        ...patch,
      },
    });
  };

  const updateDay = (
    day: ConsultationWeekday,
    updater: (
      // eslint-disable-next-line no-unused-vars
      value: ConsultationDayAvailability,
    ) => ConsultationDayAvailability,
  ) => {
    updateDetails({
      weeklyAvailability: weeklyAvailability.map((item) =>
        item.day === day ? updater(item) : item,
      ),
    });
  };

  const updateWindow = (
    day: ConsultationWeekday,
    windowIndex: number,
    patch: Partial<ConsultationAvailabilityWindow>,
  ) => {
    updateDay(day, (item) => ({
      ...item,
      windows: item.windows.map((window, index) =>
        index === windowIndex ? { ...window, ...patch } : window,
      ),
    }));
  };

  const addRange = (day: ConsultationWeekday) => {
    updateDay(day, (item) => ({
      ...item,
      enabled: true,
      windows: [...item.windows, { startTime: '14:00', endTime: '17:00' }],
    }));
  };

  const removeRange = (day: ConsultationWeekday, windowIndex: number) => {
    updateDay(day, (item) => ({
      ...item,
      windows: item.windows.filter((_, index) => index !== windowIndex),
    }));
  };

  return (
    <div className="consultation-details">
      <section className="consultation-settings-section">
        <div className="consultation-settings-section__header">
          <div>
            <h3>Session</h3>
            <p>Define how this Consultation is delivered.</p>
          </div>
        </div>
        <div className="consultation-settings-grid">
          <Select
            options={TIME_OPTIONS}
            name="durationMinutes"
            label="Session duration"
            value={details.durationMinutes ?? 50}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
              updateDetails({ durationMinutes: Number(event.target.value) })
            }
          />
          <Select
            options={MEETING_METHOD_OPTIONS}
            name="meetingMethod"
            label="Meeting method"
            value={details.meetingMethod ?? ''}
            onChange={(event: React.ChangeEvent<HTMLSelectElement>) =>
              updateDetails({ meetingMethod: event.target.value as MeetingMethods })
            }
          />
        </div>
        {details.meetingMethod === MeetingMethods.OTHER && (
          <Input
            label="Custom location or instructions"
            type="text"
            name="customLocation"
            value={details.customLocation ?? ''}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              updateDetails({ customLocation: event.target.value })
            }
          />
        )}
        {details.meetingMethod &&
          [MeetingMethods.ZOOM, MeetingMethods.GOOGLE_MEET].includes(
            details.meetingMethod as MeetingMethods,
          ) && (
          <p className="consultation-details__note">
            This records the intended delivery method. Automatic meeting-room
            creation remains integration-dependent.
          </p>
        )}
      </section>

      <section className="consultation-settings-section">
        <div className="consultation-settings-section__header">
          <div>
            <h3>Weekly availability</h3>
            <p>Choose when customers are allowed to book this Consultation.</p>
          </div>
          <StatusBadge
            label={
              enabledDays.length === 0
                ? 'No days available'
                : `${enabledDays.length} days available`
            }
            tone={
              enabledDays.length === 0 || hasAvailabilityErrors
                ? 'warning'
                : 'neutral'
            }
            size="sm"
          />
        </div>

        <div className="weekly-availability" aria-label="Weekly availability">
          {weeklyAvailability.map((day) => {
            const label = DAY_LABELS[day.day];
            const error = dayErrors[day.day];

            return (
              <div className="availability-day" key={day.day}>
                <div className="availability-day__summary">
                  <label className="availability-day__toggle">
                    <input
                      type="checkbox"
                      checked={day.enabled}
                      aria-describedby={
                        error ? `availability-${day.day}-error` : undefined
                      }
                      onChange={(event) =>
                        updateDay(day.day, (item) => ({
                          ...item,
                          enabled: event.target.checked,
                          windows: event.target.checked && item.windows.length === 0
                            ? [{ startTime: '09:00', endTime: '17:00' }]
                            : item.windows,
                        }))
                      }
                    />
                    <span>{label}</span>
                  </label>
                  {!day.enabled && (
                    <StatusBadge label="Unavailable" tone="neutral" size="sm" />
                  )}
                </div>

                {day.enabled && (
                  <div className="availability-day__ranges">
                    {day.windows.map((window, index) => (
                      <div className="availability-range" key={`${day.day}-${index}`}>
                        <Input
                          label={`${label} range ${index + 1} start`}
                          type="time"
                          name={`${day.day}-${index}-start`}
                          value={window.startTime}
                          error={index === 0 && error ? error : undefined}
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                            updateWindow(day.day, index, {
                              startTime: event.target.value,
                            })
                          }
                        />
                        <Input
                          label={`${label} range ${index + 1} end`}
                          type="time"
                          name={`${day.day}-${index}-end`}
                          value={window.endTime}
                          onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
                            updateWindow(day.day, index, {
                              endTime: event.target.value,
                            })
                          }
                        />
                        <Button
                          type="button"
                          variant="danger"
                          size="sm"
                          aria-label={`Remove ${label} range ${index + 1}`}
                          onClick={() => removeRange(day.day, index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                    {error && (
                      <p
                        className="consultation-details__error"
                        id={`availability-${day.day}-error`}
                        role="alert"
                      >
                        {error}
                      </p>
                    )}
                    <Button
                      type="button"
                      variant="tertiary"
                      size="sm"
                      onClick={() => addRange(day.day)}
                    >
                      Add range
                    </Button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section className="consultation-settings-section">
        <div className="consultation-settings-section__header">
          <div>
            <h3>Calendar</h3>
            <p>Account calendars are used later to protect against conflicts.</p>
          </div>
          <StatusBadge
            label={connectedCalendars.length > 0 ? 'Connected' : 'Not connected'}
            tone={connectedCalendars.length > 0 ? 'success' : 'warning'}
            size="sm"
          />
        </div>
        {connectedCalendars.length > 0 ? (
          <div className="calendar-status-list">
            {connectedCalendars.map((calendar, index) => (
              <div className="calendar-status" key={calendar.id ?? index}>
                <strong>{calendar.provider ?? 'Calendar'}</strong>
                <span>
                  {calendar.email ??
                    calendar.displayName ??
                    calendar.id ??
                    'Connected account calendar'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="calendar-empty-state">
            <strong>No calendar connected</strong>
            <p>
              Connect a calendar in account settings to prevent future bookings
              from overlapping existing events. OAuth remains external to this
              Product builder.
            </p>
          </div>
        )}
        <Button
          type="button"
          variant="secondary"
          onClick={() => navigate('/app/settings?tab=calendar')}
        >
          Manage calendars
        </Button>
      </section>

      <section className="consultation-settings-section">
        <div className="consultation-settings-section__header">
          <div>
            <h3>Scheduling rules</h3>
            <p>Control spacing and daily load for this Consultation.</p>
          </div>
        </div>
        <div className="consultation-settings-grid consultation-settings-grid--three">
          <Input
            type="number"
            min={0}
            name="bufferBeforeMinutes"
            label="Buffer before (minutes)"
            value={details.bufferBeforeMinutes ?? 0}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              updateDetails({ bufferBeforeMinutes: Number(event.target.value) })
            }
          />
          <Input
            type="number"
            min={0}
            name="bufferAfterMinutes"
            label="Buffer after (minutes)"
            value={details.bufferAfterMinutes ?? 0}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              updateDetails({ bufferAfterMinutes: Number(event.target.value) })
            }
          />
          <Input
            type="number"
            min={1}
            name="maxSessionsPerDay"
            label="Maximum sessions per day"
            value={details.maxSessionsPerDay ?? 1}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              updateDetails({ maxSessionsPerDay: Number(event.target.value) })
            }
          />
        </div>
      </section>

      <section className="consultation-settings-section">
        <div className="consultation-settings-section__header">
          <div>
            <h3>Client communication</h3>
            <p>
              This message is shown after a customer successfully books this
              Consultation. Automated email delivery is not implemented here.
            </p>
          </div>
        </div>
        <Textarea
          label="Confirmation message"
          name="confirmationMessage"
          value={details.confirmationMessage ?? ''}
          onChange={(event: React.ChangeEvent<HTMLTextAreaElement>) =>
            updateDetails({ confirmationMessage: event.target.value })
          }
          block
        />
      </section>

      <section className="consultation-settings-section">
        <div className="consultation-settings-section__header">
          <div>
            <h3>Cancellation</h3>
            <p>Set the customer-facing policy for this Consultation.</p>
          </div>
        </div>
        <RadioGroup
          name="cancellationPolicy"
          value={details.cancellationPolicy ?? ''}
          onChange={(policyId) => updateDetails({ cancellationPolicy: policyId })}
          label="Cancellation policy"
          className="cancellation-group"
        >
          {CANCELATION_POLICIES.map((policy) => (
            <Radio
              key={policy.id}
              value={policy.id}
              label={policy.label}
              description={policy.notes}
            />
          ))}
        </RadioGroup>
      </section>
    </div>
  );
};

export default ConsultationDetailsSection;
