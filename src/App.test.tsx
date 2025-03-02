// App.test.tsx

import React from 'react';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import '@testing-library/jest-dom';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { mockInitialState } from './utils/store.mock';

// Optional: include jest-dom matchers if not already globally set up
// import '@testing-library/jest-dom/extend-expect';

const mockStore = configureStore([]);
const store = mockStore(mockInitialState); // pass initial state as needed

describe('App Component', () => {
  test('renders without crashing', () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <App />
        </MemoryRouter>
      </Provider>
    );

    // Verify that the Navigation component is rendered.
    // Adjust the query if Navigation doesn't contain text "Navigation".
    // For now, we assume Navigation renders a nav element.
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  test('matches snapshot', () => {
    const { container } = render(
      <Provider store={store}>
        <MemoryRouter>
          <App />
        </MemoryRouter>

      </Provider>
    );
    expect(container).toMatchSnapshot();
  });
});
