import React, { useState } from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router-dom';

import ConsultationDetailsSection from './consultation-details.component';
import { ProductDraft } from '../models';

const mockNavigate = jest.fn();

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

const baseDraft: ProductDraft = {
  id: 'consultation-1',
  type: 'CONSULTATION',
  name: 'Offer audit',
  status: 'DRAFT',
  price: 150,
};

const renderConsultationDetails = (initial: ProductDraft = baseDraft) => {
  const updates: ProductDraft[] = [];

  const Harness = () => {
    const [formData, setFormData] = useState<ProductDraft>(initial);

    const handleSetFormData = (next: ProductDraft) => {
      updates.push(next);
      setFormData(next);
    };

    return (
      <MemoryRouter>
        <ConsultationDetailsSection
          formData={formData}
          setFormData={handleSetFormData}
          errors={{}}
        />
      </MemoryRouter>
    );
  };

  return {
    updates,
    ...render(<Harness />),
  };
};

describe('<ConsultationDetailsSection />', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('creates a useful default schedule for a new Consultation', async () => {
    const { updates } = renderConsultationDetails();

    expect(await screen.findByLabelText('Session duration')).toHaveValue('50');
    expect(screen.getByLabelText('Meeting method')).toHaveValue('ZOOM');
    expect(screen.getByLabelText('Monday')).toBeChecked();
    expect(screen.getByLabelText('Friday')).toBeChecked();
    expect(screen.getByLabelText('Saturday')).not.toBeChecked();
    expect(screen.getByLabelText('Sunday')).not.toBeChecked();
    expect(screen.getByLabelText('Monday range 1 start')).toHaveValue('09:00');
    expect(screen.getByLabelText('Monday range 1 end')).toHaveValue('17:00');

    expect(updates[0].consultationDetails?.weeklyAvailability).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          day: 'MONDAY',
          enabled: true,
          windows: [{ startTime: '09:00', endTime: '17:00' }],
        }),
        expect.objectContaining({
          day: 'SATURDAY',
          enabled: false,
          windows: [],
        }),
      ]),
    );
  });

  it('edits session duration and shows custom location only for Other meeting method', async () => {
    const user = userEvent.setup();
    const { updates } = renderConsultationDetails({
      ...baseDraft,
      consultationDetails: {
        durationMinutes: 50,
        meetingMethod: 'ZOOM',
        weeklyAvailability: [],
      },
    });

    await user.selectOptions(screen.getByLabelText('Session duration'), '60');
    await user.selectOptions(screen.getByLabelText('Meeting method'), 'OTHER');

    const customLocation = screen.getByLabelText(
      'Custom location or instructions',
    );
    await user.type(customLocation, 'Call my studio line');

    expect(customLocation).toHaveValue('Call my studio line');
    expect(updates.at(-1)?.consultationDetails).toMatchObject({
      durationMinutes: 60,
      meetingMethod: 'OTHER',
      customLocation: 'Call my studio line',
    });

    await user.selectOptions(screen.getByLabelText('Meeting method'), 'PHONE');
    expect(
      screen.queryByLabelText('Custom location or instructions'),
    ).not.toBeInTheDocument();
  });

  it('supports enabling days, adding and removing ranges, and editing times', async () => {
    const user = userEvent.setup();
    const { updates } = renderConsultationDetails();

    await screen.findByLabelText('Wednesday');
    await user.click(screen.getByLabelText('Wednesday'));
    expect(screen.getByLabelText('Wednesday')).not.toBeChecked();

    await user.click(screen.getByLabelText('Saturday'));
    expect(screen.getByLabelText('Saturday')).toBeChecked();
    expect(screen.getByLabelText('Saturday range 1 start')).toHaveValue('09:00');

    const saturdayGroup = screen
      .getByLabelText('Saturday')
      .closest('.availability-day') as HTMLElement;
    await user.click(within(saturdayGroup).getByRole('button', {
      name: 'Add range',
    }));
    expect(screen.getByLabelText('Saturday range 2 start')).toHaveValue('14:00');

    await user.clear(screen.getByLabelText('Saturday range 2 start'));
    await user.type(screen.getByLabelText('Saturday range 2 start'), '18:00');
    await user.clear(screen.getByLabelText('Saturday range 2 end'));
    await user.type(screen.getByLabelText('Saturday range 2 end'), '19:00');

    await user.click(screen.getByRole('button', {
      name: 'Remove Saturday range 1',
    }));

    const saturday = updates
      .at(-1)
      ?.consultationDetails?.weeklyAvailability?.find(
        (day) => day.day === 'SATURDAY',
      );

    expect(saturday).toMatchObject({
      enabled: true,
      windows: [{ startTime: '18:00', endTime: '19:00' }],
    });
  });

  it('surfaces invalid and overlapping weekly availability ranges', async () => {
    const user = userEvent.setup();

    renderConsultationDetails({
      ...baseDraft,
      consultationDetails: {
        durationMinutes: 50,
        meetingMethod: 'ZOOM',
        weeklyAvailability: [
          {
            day: 'MONDAY',
            enabled: true,
            windows: [{ startTime: '17:00', endTime: '09:00' }],
          },
        ],
      },
    });

    expect(await screen.findByRole('alert')).toHaveTextContent(
      'Start time must be before end time.',
    );

    await user.clear(screen.getByLabelText('Monday range 1 start'));
    await user.type(screen.getByLabelText('Monday range 1 start'), '09:00');
    await user.clear(screen.getByLabelText('Monday range 1 end'));
    await user.type(screen.getByLabelText('Monday range 1 end'), '12:00');

    const mondayGroup = screen
      .getByLabelText('Monday')
      .closest('.availability-day') as HTMLElement;
    await user.click(within(mondayGroup).getByRole('button', {
      name: 'Add range',
    }));
    await user.clear(screen.getByLabelText('Monday range 2 start'));
    await user.type(screen.getByLabelText('Monday range 2 start'), '11:00');
    await user.clear(screen.getByLabelText('Monday range 2 end'));
    await user.type(screen.getByLabelText('Monday range 2 end'), '13:00');

    expect(screen.getByRole('alert')).toHaveTextContent(
      'Time ranges cannot overlap.',
    );
  });

  it('allows every weekday to be unavailable without breaking the surface', async () => {
    const user = userEvent.setup();

    renderConsultationDetails();
    await screen.findByLabelText('Monday');

    for (const day of ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']) {
      await user.click(screen.getByLabelText(day));
    }

    expect(screen.getByText('No days available')).toBeInTheDocument();
  });

  it('edits scheduling rules, confirmation message, and cancellation policy', async () => {
    const user = userEvent.setup();
    const { updates } = renderConsultationDetails();

    await screen.findByLabelText('Buffer before (minutes)');
    await user.clear(screen.getByLabelText('Buffer before (minutes)'));
    await user.type(screen.getByLabelText('Buffer before (minutes)'), '15');
    await user.clear(screen.getByLabelText('Buffer after (minutes)'));
    await user.type(screen.getByLabelText('Buffer after (minutes)'), '20');
    await user.clear(screen.getByLabelText('Maximum sessions per day'));
    await user.type(screen.getByLabelText('Maximum sessions per day'), '4');
    await user.clear(screen.getByLabelText('Confirmation message'));
    await user.type(
      screen.getByLabelText('Confirmation message'),
      'Bring your latest offer draft.',
    );
    await user.click(screen.getByLabelText(/Full refund.*48h/i));

    expect(updates.at(-1)?.consultationDetails).toMatchObject({
      bufferBeforeMinutes: 15,
      bufferAfterMinutes: 20,
      maxSessionsPerDay: 4,
      confirmationMessage: 'Bring your latest offer draft.',
      cancellationPolicy: 'full_48h',
    });
  });

  it('renders disconnected and connected account calendar states', async () => {
    const user = userEvent.setup();

    renderConsultationDetails({
      ...baseDraft,
      consultationDetails: {
        durationMinutes: 50,
        meetingMethod: 'ZOOM',
        connectedCalendars: [],
        weeklyAvailability: [],
      },
    });

    expect(await screen.findByText('No calendar connected')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Manage calendars' }));
    expect(mockNavigate).toHaveBeenCalledWith('/app/settings?tab=calendar');

    renderConsultationDetails({
      ...baseDraft,
      consultationDetails: {
        durationMinutes: 50,
        meetingMethod: 'GOOGLE_MEET',
        connectedCalendars: [
          {
            id: 'calendar-1',
            provider: 'Google Calendar',
            email: 'maya@example.test',
          },
        ],
        weeklyAvailability: [],
      },
    });

    expect(screen.getByText('Connected')).toBeInTheDocument();
    expect(screen.getByText('Google Calendar')).toBeInTheDocument();
    expect(screen.getByText('maya@example.test')).toBeInTheDocument();
  });
});
