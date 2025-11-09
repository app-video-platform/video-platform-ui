// SignUp.test.tsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';
import { authReducer } from '@store/auth-store';
import SignUp from './sign-up.component';
import '@testing-library/jest-dom';

// Mock the useNavigate hook from react-router-dom
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('SignUp Component', () => {
  let store: ReturnType<typeof configureStore>;

  beforeEach(() => {
    store = configureStore({
      reducer: { auth: authReducer },
    });
    jest.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <MemoryRouter>
          <SignUp />
        </MemoryRouter>
      </Provider>,
    );

  test('renders the sign up form with all input fields', () => {
    renderComponent();
    expect(screen.getByTestId('sign-up-header')).toBeInTheDocument();
    // Check for input fields by label text
    expect(screen.getByLabelText(/First Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Last Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Email/i)).toBeInTheDocument();
    expect(screen.getByTestId('input-password')).toBeInTheDocument();
    expect(screen.getByLabelText(/Confirm Password/i)).toBeInTheDocument();
  });

  // test('validates the form and shows errors when fields are empty', async () => {
  //   renderComponent();
  //   // Find and click the submit button (assuming its text is "Sign Up")
  //   const submitButton = screen.getByRole('button', { name: /Sign Up/i });
  //   fireEvent.click(submitButton);

  //   await waitFor(() => {
  //     expect(screen.getByText(/First name is required/i)).toBeInTheDocument();
  //     expect(screen.getByText(/Last name is required/i)).toBeInTheDocument();
  //     expect(screen.getByText(/Email is required/i)).toBeInTheDocument();
  //     expect(screen.getByText(/Password is required/i)).toBeInTheDocument();
  //     expect(screen.getByText(/Confirm password is required/i)).toBeInTheDocument();
  //   });
  // });

  test('submits the form successfully and navigates to /email-sent', async () => {
    // Override store.dispatch to simulate a successful signupUser thunk
    const mockDispatch = jest.fn(() => ({
      unwrap: () => Promise.resolve({}),
    }));
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (store.dispatch as any) = mockDispatch;

    renderComponent();

    // Fill in valid form data
    fireEvent.change(screen.getByLabelText(/First Name/i), {
      target: { value: 'John' },
    });
    fireEvent.change(screen.getByLabelText(/Last Name/i), {
      target: { value: 'Doe' },
    });
    fireEvent.change(screen.getByLabelText(/Email/i), {
      target: { value: 'john.doe@example.com' },
    });
    fireEvent.change(screen.getByTestId('input-password'), {
      target: { value: 'Password123!' },
    });
    fireEvent.change(screen.getByLabelText(/Confirm Password/i), {
      target: { value: 'Password123!' },
    });

    const submitButton = screen.getByRole('button', { name: /Sign Up/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/email-sent');
    });
  });

  test('toggles password visibility', () => {
    renderComponent();
    // Assuming that the password field is labeled "Password"
    const passwordInput = screen.getByTestId('input-password');
    // Since the toggle button does not have accessible text, we use a test id or a query based on class.
    // For this example, assume you add a data-testid="toggle-password" attribute to the button.
    const toggleButton = screen.getByTestId('toggle-password-password');

    // Initially, the password field type should be "password"
    expect(passwordInput).toHaveAttribute('type', 'password');

    // Click to toggle
    fireEvent.click(toggleButton);
    // After toggle, the field should switch to "text"
    expect(passwordInput).toHaveAttribute('type', 'text');

    // Click again to toggle back
    fireEvent.click(toggleButton);
    expect(passwordInput).toHaveAttribute('type', 'password');
  });
});
