import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, useLocation, useNavigate } from 'react-router-dom';
import '@testing-library/jest-dom';

import { fetchProducts } from 'core/api/services';
import SmartSearch from './smart-search.component';

jest.mock('core/api/services', () => ({ fetchProducts: jest.fn() }));

const LocationState = () => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <>
      <output data-testid="location">{location.pathname + location.search}</output>
      <button type="button" onClick={() => navigate(-1)}>Back</button>
    </>
  );
};

const renderSmartSearch = (entries = ['/app/explore']) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity } },
  });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={entries}>
        <LocationState />
        <SmartSearch />
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe('SmartSearch query freshness', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.clearAllMocks();
    (fetchProducts as jest.Mock).mockImplementation(({ term }) =>
      Promise.resolve({
        content: [{ id: term, title: `${term} suggestion` }],
      }),
    );
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('submits the current raw query after replacing a highlighted old suggestion', async () => {
    renderSmartSearch();
    const input = screen.getByRole('combobox', { name: 'Product search' });

    fireEvent.change(input, { target: { value: 'old product' } });
    await act(async () => {
      jest.advanceTimersByTime(250);
    });
    expect(await screen.findByRole('option', { name: 'old product suggestion' })).toBeInTheDocument();
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(input).toHaveAttribute('aria-activedescendant', 'product-search-option-0');

    fireEvent.change(input, { target: { value: 'new curriculum' } });
    expect(input).not.toHaveAttribute('aria-activedescendant');
    expect(screen.queryByRole('option', { name: 'old product suggestion' })).not.toBeInTheDocument();
    fireEvent.submit(input.closest('form') as HTMLFormElement);

    await waitFor(() =>
      expect(screen.getByTestId('location')).toHaveTextContent(
        '/app/explore/search?term=new+curriculum',
      ),
    );
  });

  it('keeps intentional current-query keyboard selection and synchronizes on history navigation', async () => {
    renderSmartSearch([
      '/app/explore/search?term=previous',
      '/app/explore/search?term=current',
    ]);
    const input = screen.getByRole('combobox', { name: 'Product search' });
    expect(input).toHaveValue('current');

    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    await waitFor(() => expect(input).toHaveValue('previous'));
  });

  it('uses the highlighted suggestion only when it belongs to the current query', async () => {
    renderSmartSearch();
    const input = screen.getByRole('combobox', { name: 'Product search' });
    fireEvent.change(input, { target: { value: 'course' } });
    await act(async () => {
      jest.advanceTimersByTime(250);
    });
    expect(await screen.findByRole('option', { name: 'course suggestion' })).toBeInTheDocument();
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    fireEvent.keyDown(input, { key: 'Enter' });

    await waitFor(() =>
      expect(screen.getByTestId('location')).toHaveTextContent(
        '/app/explore/search?term=course+suggestion',
      ),
    );
  });

  it('uses the raw query when no suggestion is highlighted', async () => {
    renderSmartSearch();
    const input = screen.getByRole('combobox', { name: 'Product search' });
    fireEvent.change(input, { target: { value: 'course' } });
    await act(async () => { jest.advanceTimersByTime(250); });
    expect(await screen.findByRole('option', { name: 'course suggestion' })).toBeInTheDocument();
    fireEvent.keyDown(input, { key: 'Enter' });

    await waitFor(() =>
      expect(screen.getByTestId('location')).toHaveTextContent(
        '/app/explore/search?term=course',
      ),
    );
  });

  it('supports selecting a current suggestion with the mouse', async () => {
    renderSmartSearch();
    const input = screen.getByRole('combobox', { name: 'Product search' });
    fireEvent.change(input, { target: { value: 'course' } });
    await act(async () => { jest.advanceTimersByTime(250); });
    fireEvent.mouseDown(await screen.findByRole('option', { name: 'course suggestion' }));

    await waitFor(() =>
      expect(screen.getByTestId('location')).toHaveTextContent(
        '/app/explore/search?term=course+suggestion',
      ),
    );
  });

  it('does not show an older asynchronous response after a newer query resolves', async () => {
    let finishOld: () => void = () => undefined;
    (fetchProducts as jest.Mock).mockImplementation(({ term }) => {
      if (term === 'older') {
        return new Promise((resolve) => {
          finishOld = () => resolve({ content: [{ id: 'older', title: 'older suggestion' }] });
        });
      }
      return Promise.resolve({
        content: [{ id: term, title: `${term} suggestion` }],
      });
    });
    renderSmartSearch();
    const input = screen.getByRole('combobox', { name: 'Product search' });

    fireEvent.change(input, { target: { value: 'older' } });
    await act(async () => { jest.advanceTimersByTime(250); });
    await waitFor(() => expect(fetchProducts).toHaveBeenCalledWith(expect.objectContaining({ term: 'older' })));

    fireEvent.change(input, { target: { value: 'newer' } });
    await act(async () => { jest.advanceTimersByTime(250); });
    expect(await screen.findByRole('option', { name: 'newer suggestion' })).toBeInTheDocument();

    await act(async () => {
      finishOld();
    });
    expect(screen.getByRole('option', { name: 'newer suggestion' })).toBeInTheDocument();
    expect(screen.queryByRole('option', { name: 'older suggestion' })).not.toBeInTheDocument();
  });

  it('clears selection on Escape and on clearing the query', async () => {
    renderSmartSearch();
    const input = screen.getByRole('combobox', { name: 'Product search' });
    fireEvent.change(input, { target: { value: 'course' } });
    await act(async () => { jest.advanceTimersByTime(250); });
    expect(await screen.findByRole('option', { name: 'course suggestion' })).toBeInTheDocument();
    fireEvent.keyDown(input, { key: 'ArrowDown' });
    expect(input).toHaveAttribute('aria-activedescendant', 'product-search-option-0');
    fireEvent.keyDown(input, { key: 'Escape' });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(input).not.toHaveAttribute('aria-activedescendant');

    fireEvent.change(input, { target: { value: '' } });
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(input).toHaveValue('');
  });
});
