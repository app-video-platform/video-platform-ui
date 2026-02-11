/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
// GoogleSignInButton.test.tsx
import React from 'react';
import { render, act } from '@testing-library/react';
import GoogleSignInButton from './google-sign-in-button.component';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Mock useDispatch and useNavigate hooks
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
}));
jest.mock('react-router-dom', () => ({
  useNavigate: jest.fn(),
}));

describe('GoogleSignInButton component', () => {
  let mockDispatch: jest.Mock;
  let mockNavigate: jest.Mock;

  beforeEach(() => {
    mockDispatch = jest.fn();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
    // Clean up window.google between tests
    delete (window as any).google;
  });

  it('initializes and renders google sign in button if window.google is available', () => {
    // Set up a fake window.google with the required methods
    const initializeMock = jest.fn();
    const renderButtonMock = jest.fn();
    (window as any).google = {
      accounts: {
        id: {
          initialize: initializeMock,
          renderButton: renderButtonMock,
        },
      },
    };

    // Render component
    const { container } = render(<GoogleSignInButton />);
    const googleDiv = container.querySelector('div');

    // Verify that initialize and renderButton were called
    expect(initializeMock).toHaveBeenCalled();
    expect(renderButtonMock).toHaveBeenCalledWith(googleDiv, {
      theme: 'outline',
      size: 'large',
      type: 'standard',
    });
  });

  it('initializes google sign in button after gsi-loaded event if window.google was not initially available', () => {
    // Ensure window.google is not available at first.
    delete (window as any).google;

    // Later, define window.google
    const initializeMock = jest.fn();
    const renderButtonMock = jest.fn();
    (window as any).google = {
      accounts: {
        id: {
          initialize: initializeMock,
          renderButton: renderButtonMock,
        },
      },
    };

    // Render component. It will add an event listener for 'gsi-loaded'.
    const { unmount } = render(<GoogleSignInButton />);

    // Simulate firing the custom 'gsi-loaded' event.
    act(() => {
      window.dispatchEvent(new Event('gsi-loaded'));
    });

    // Now initialize should have been called.
    expect(initializeMock).toHaveBeenCalled();

    // Clean up by unmounting the component.
    unmount();
  });

  it('handles credential response and navigates to dashboard on success', async () => {
    // Prepare a fake callback variable that will be set via initialize.
    let callbackFn: (
      response: google.accounts.id.CredentialResponse,
    ) => void = () => {};
    const initializeMock = jest.fn((config) => {
      callbackFn = config.callback;
    });
    const renderButtonMock = jest.fn();
    (window as any).google = {
      accounts: {
        id: {
          initialize: initializeMock,
          renderButton: renderButtonMock,
        },
      },
    };

    // Set up the dispatch mock to simulate successful actions.
    // First call resolves (googleSignInUser), second resolves with a truthy value (getUserProfile).
    mockDispatch.mockResolvedValueOnce(true);
    mockDispatch.mockResolvedValueOnce(true);

    // Render the component.
    render(<GoogleSignInButton />);

    // Simulate the Google credential response.
    const fakeResponse = {
      credential: 'fake-token',
    } as google.accounts.id.CredentialResponse;
    await act(async () => {
      callbackFn(fakeResponse);
      // Flush pending promises.
      await Promise.resolve();
    });

    // Verify that navigate was called with 'app'.
    expect(mockNavigate).toHaveBeenCalledWith('/app');
  });
});
