import React from 'react';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, useLocation, useNavigate } from 'react-router-dom';
import '@testing-library/jest-dom';

import { fetchProducts } from 'core/api/services';
import SearchResultsPage from './search-page.component';
import SmartSearch from 'domains/app/features/smart-search/smart-search.component';

jest.mock('core/api/services', () => ({ fetchProducts: jest.fn() }));

const response = (term: string, page: number, totalPages = 3) => ({
  content: [{ id: `${term || 'empty'}-${page}`, title: `${term} result ${page}` }],
  number: page,
  totalPages,
  totalElements: totalPages * 20,
  last: page >= totalPages - 1,
});

const LocationState = () => {
  const location = useLocation();
  const navigate = useNavigate();
  return (
    <>
      <output data-testid="location">{location.pathname + location.search}</output>
      <button type="button" onClick={() => navigate(-1)}>Back</button>
      <button type="button" onClick={() => navigate(1)}>Forward</button>
    </>
  );
};

const renderSearch = (initialEntries: string[], initialIndex?: number, withNavbar = false) => {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false, gcTime: Infinity } },
  });
  return render(
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={initialEntries} initialIndex={initialIndex}>
        <LocationState />
        {withNavbar && <SmartSearch />}
        <SearchResultsPage />
      </MemoryRouter>
    </QueryClientProvider>,
  );
};

describe('SearchResultsPage URL state', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (fetchProducts as jest.Mock).mockImplementation(({ term, page }) =>
      Promise.resolve(response(term, page)),
    );
  });

  it('loads a deep-linked zero-based page and displays a one-based label', async () => {
    renderSearch(['/app/explore/search?term=course&page=1']);

    expect(await screen.findByText('Page 2 of 3')).toBeInTheDocument();
    expect(fetchProducts).toHaveBeenCalledWith({ term: 'course', page: 1, size: 20 });
    expect(screen.getByTestId('location')).toHaveTextContent('term=course&page=1');
  });

  it('uses the URL page when navigating Back and Forward', async () => {
    renderSearch(
      ['/app/explore/search?term=older&page=1', '/app/explore/search?term=newer'],
      1,
    );

    expect(await screen.findByRole('heading', { name: 'Results for “newer”' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Back' }));
    expect(await screen.findByRole('heading', { name: 'Results for “older”' })).toBeInTheDocument();
    expect(await screen.findByText('Page 2 of 3')).toBeInTheDocument();
    expect(fetchProducts).toHaveBeenCalledWith({ term: 'older', page: 1, size: 20 });

    fireEvent.click(screen.getByRole('button', { name: 'Forward' }));
    expect(await screen.findByRole('heading', { name: 'Results for “newer”' })).toBeInTheDocument();
    expect(await screen.findByText('Page 1 of 3')).toBeInTheDocument();
  });

  it('starts a submitted new search on page zero and syncs heading and navbar', async () => {
    renderSearch(['/app/explore/search?term=older&page=2'], undefined, true);
    const input = screen.getByRole('combobox', { name: 'Product search' });
    await waitFor(() => expect(input).toHaveValue('older'));

    fireEvent.change(input, { target: { value: 'new subject' } });
    fireEvent.submit(input.closest('form') as HTMLFormElement);

    expect(await screen.findByRole('heading', { name: 'Results for “new subject”' })).toBeInTheDocument();
    expect(input).toHaveValue('new subject');
    expect(screen.getByTestId('location')).toHaveTextContent('term=new+subject');
    expect(screen.getByTestId('location')).not.toHaveTextContent('page=');
    expect(await screen.findByText('Page 1 of 3')).toBeInTheDocument();
    expect(fetchProducts).toHaveBeenCalledWith({ term: 'new subject', page: 0, size: 20 });
  });

  it('resets the page when submitting the same term from a later page', async () => {
    renderSearch(['/app/explore/search?term=older&page=2'], undefined, true);
    const input = screen.getByRole('combobox', { name: 'Product search' });
    await waitFor(() => expect(input).toHaveValue('older'));
    fireEvent.submit(input.closest('form') as HTMLFormElement);

    await waitFor(() => expect(screen.getByTestId('location')).toHaveTextContent('term=older'));
    expect(screen.getByTestId('location')).not.toHaveTextContent('page=');
    expect(await screen.findByText('Page 1 of 3')).toBeInTheDocument();
  });

  it('preserves encoded special characters as the search term', async () => {
    renderSearch(['/app/explore/search?term=old'], undefined, true);
    const input = screen.getByRole('combobox', { name: 'Product search' });
    fireEvent.change(input, { target: { value: 'C++ & design' } });
    fireEvent.submit(input.closest('form') as HTMLFormElement);

    expect(await screen.findByRole('heading', { name: 'Results for “C++ & design”' })).toBeInTheDocument();
    expect(screen.getByTestId('location')).toHaveTextContent('term=C%2B%2B+%26+design');
  });

  it('supports a direct empty-term search without displaying page zero', async () => {
    renderSearch(['/app/explore/search?term=']);

    expect(await screen.findByRole('heading', { name: 'Results for “”' })).toBeInTheDocument();
    expect(screen.getByText('Page 1 of 3')).toBeInTheDocument();
    expect(fetchProducts).toHaveBeenCalledWith({ term: '', page: 0, size: 20 });
  });

  it('ignores a late response for the previous search term', async () => {
    let finishPrevious: () => void = () => undefined;
    (fetchProducts as jest.Mock).mockImplementation(({ term, page }) => {
      if (term === 'previous') {
        return new Promise((resolve) => {
          finishPrevious = () => resolve(response('previous', 0));
        });
      }
      return Promise.resolve(response(term, page));
    });
    renderSearch(['/app/explore/search?term=previous'], undefined, true);
    const input = screen.getByRole('combobox', { name: 'Product search' });
    await waitFor(() => expect(input).toHaveValue('previous'));
    await waitFor(() => expect(fetchProducts).toHaveBeenCalledWith({ term: 'previous', page: 0, size: 20 }));

    fireEvent.change(input, { target: { value: 'current' } });
    fireEvent.submit(input.closest('form') as HTMLFormElement);
    expect(await screen.findByText('current result 0')).toBeInTheDocument();
    await act(async () => { finishPrevious(); });

    expect(screen.getByText('current result 0')).toBeInTheDocument();
    expect(screen.queryByText('previous result 0')).not.toBeInTheDocument();
  });

  it.each(['-2', 'nonsense', ''])('normalizes malformed page %s without adding history', async (page) => {
    renderSearch([`/app/explore/search?term=hello&page=${page}`]);

    await waitFor(() => expect(screen.getByTestId('location')).not.toHaveTextContent('page='));
    expect(await screen.findByText('Page 1 of 3')).toBeInTheDocument();
    expect(fetchProducts).toHaveBeenCalledWith({ term: 'hello', page: 0, size: 20 });
  });

  it('normalizes an empty result page label without claiming the backend has more pages', async () => {
    (fetchProducts as jest.Mock).mockResolvedValueOnce({
      content: [], number: 0, totalPages: 0, totalElements: 0, last: true,
    });
    renderSearch(['/app/explore/search?term=missing']);

    expect(await screen.findByText('No products found for “missing”.')).toBeInTheDocument();
    expect(screen.getByText('Page 1 of 1')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Next results page' })).toBeDisabled();
  });

  it('does not invent a page count for a deep link with no returned rows', async () => {
    (fetchProducts as jest.Mock).mockResolvedValueOnce({
      content: [], number: 5, totalPages: 2, totalElements: 40, last: true,
    });
    renderSearch(['/app/explore/search?term=missing&page=5']);

    expect(await screen.findByText('Page 6')).toBeInTheDocument();
    expect(screen.getByText('No products found on page 6 for “missing”.')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Return to first page' }));
    await waitFor(() => expect(screen.getByTestId('location')).not.toHaveTextContent('page='));
  });
});
