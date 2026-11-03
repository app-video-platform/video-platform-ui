import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { useDispatch, useSelector } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';

import MultiStepForm from './multi-step-form.component';
import { UserRole } from '@core/api';
import { User } from 'core/api/models';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

const mockDispatch = jest.fn();
let mockState: { auth: { user: User; sessionVersion: number } };

const creator: User = {
  id: 'creator-1',
  firstName: 'Taylor',
  lastName: 'Creator',
  email: 'creator@example.test',
  roles: [UserRole.CREATOR],
  onboardingCompleted: false,
};

const makeDeferred = <T,>() => {
  // eslint-disable-next-line no-unused-vars
  let resolve!: (value: T) => void;
  // eslint-disable-next-line no-unused-vars
  let reject!: (reason?: unknown) => void;
  const promise = new Promise<T>((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
};

const renderForm = () =>
  render(
    <MemoryRouter>
      <MultiStepForm />
    </MemoryRouter>,
  );

beforeEach(() => {
  mockState = { auth: { user: creator, sessionVersion: 1 } };
  (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
    selector(mockState),
  );
  (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
  mockDispatch.mockReset();
  mockDispatch.mockReturnValue({ unwrap: () => Promise.resolve(creator) });
});

describe('MultiStepForm profile persistence', () => {
  it('waits for a successful save and prevents duplicate submissions or navigation', async () => {
    const save = makeDeferred<User>();
    mockDispatch.mockReturnValue({ unwrap: () => save.promise });

    renderForm();
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(screen.getByRole('heading', { name: 'Basic Profile' })).toBeInTheDocument();

    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'Music teacher' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    expect(screen.getByRole('heading', { name: 'Basic Profile' })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled());
    expect(screen.getByRole('button', { name: 'Back' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'Skip' })).toBeDisabled();
    expect(screen.getByRole('status')).toHaveTextContent(/saving profile changes/i);
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(mockDispatch).toHaveBeenCalledTimes(1);

    await act(async () => {
      save.resolve({ ...creator, title: 'Music teacher' });
      await save.promise;
    });

    expect(screen.getByRole('heading', { name: 'About You' })).toBeInTheDocument();
  });

  it('stays on the step with entered values after rejection and retries the same data', async () => {
    const failedSave = makeDeferred<User>();
    const retrySave = makeDeferred<User>();
    mockDispatch
      .mockReturnValueOnce({ unwrap: () => failedSave.promise })
      .mockReturnValueOnce({ unwrap: () => retrySave.promise });

    renderForm();
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    const title = screen.getByLabelText('Title');
    fireEvent.change(title, { target: { value: 'Music teacher' } });
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    await act(async () => {
      failedSave.reject(new Error('Service unavailable'));
      await failedSave.promise.catch(() => undefined);
    });

    expect(screen.getByRole('heading', { name: 'Basic Profile' })).toBeInTheDocument();
    expect(screen.getByLabelText('Title')).toHaveValue('Music teacher');
    expect(screen.getByRole('alert')).toHaveTextContent(/answers are still here/i);

    fireEvent.click(screen.getByRole('button', { name: 'Retry save' }));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled());
    await act(async () => {
      retrySave.resolve({ ...creator, title: 'Music teacher' });
      await retrySave.promise;
    });

    expect(screen.getByRole('heading', { name: 'About You' })).toBeInTheDocument();
    expect(mockDispatch).toHaveBeenCalledTimes(2);
  });

  it('ignores a late save completion after the session identity changes', async () => {
    const save = makeDeferred<User>();
    mockDispatch.mockReturnValue({ unwrap: () => save.promise });

    const view = renderForm();
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    fireEvent.change(screen.getByLabelText('Title'), {
      target: { value: 'Music teacher' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    await waitFor(() => expect(screen.getByRole('status')).toBeInTheDocument());

    mockState = {
      auth: {
        user: { ...creator, id: 'creator-2', title: 'Other profile' },
        sessionVersion: 2,
      },
    };
    view.rerender(
      <MemoryRouter>
        <MultiStepForm />
      </MemoryRouter>,
    );
    await act(async () => {
      save.resolve({ ...creator, title: 'Music teacher' });
      await save.promise;
    });

    expect(screen.getByRole('heading', { name: 'Basic Profile' })).toBeInTheDocument();
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('associates invalid fields and their messages across validated steps', async () => {
    renderForm();
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    const title = screen.getByLabelText('Title');
    fireEvent.change(title, { target: { value: 'A' } });
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    await waitFor(() => expect(title).toHaveAttribute('aria-invalid', 'true'));
    expect(title).toHaveAttribute('aria-describedby', 'title-error');
    expect(document.getElementById('title-error')).toHaveTextContent(
      /at least 2 characters/i,
    );

    fireEvent.change(title, { target: { value: 'Music teacher' } });
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(await screen.findByRole('heading', { name: 'About You' })).toBeInTheDocument();

    const bio = screen.getByLabelText('Bio');
    fireEvent.change(bio, { target: { value: 'Too short' } });
    const tagline = screen.getByLabelText('Tagline / Mission');
    fireEvent.change(tagline, { target: { value: 'Short' } });
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    await waitFor(() => expect(bio).toHaveAttribute('aria-invalid', 'true'));
    expect(bio).toHaveAttribute('aria-describedby', 'bio-error');
    expect(document.getElementById('bio-error')).toHaveTextContent(/at least 30/i);
    expect(tagline).toHaveAttribute('aria-invalid', 'true');
    expect(tagline).toHaveAttribute('aria-describedby', 'tagline-error');
    expect(document.getElementById('tagline-error')).toHaveTextContent(/at least 10/i);

    fireEvent.change(bio, {
      target: {
        value: 'A short biography that is longer than thirty characters.',
      },
    });
    fireEvent.change(tagline, {
      target: { value: 'Helping people learn music' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    expect(
      await screen.findByRole('heading', { name: 'Additional information' }),
    ).toBeInTheDocument();

    const website = screen.getByLabelText('Website');
    fireEvent.change(website, { target: { value: 'not a website' } });
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));
    await waitFor(() => expect(website).toHaveAttribute('aria-invalid', 'true'));
    expect(website).toHaveAttribute('aria-describedby', 'website-error');
    expect(document.getElementById('website-error')).toHaveTextContent(/valid url/i);
  });
});
