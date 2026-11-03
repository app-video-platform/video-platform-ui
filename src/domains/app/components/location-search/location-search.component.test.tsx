import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';

import OSMLocationSearch from './location-search.component';
import { LocationSearchPlace } from './location-search.component';

const mockValidPlace = {
  lat: '37.3891',
  lon: '-5.9845',
  type: 'city',
  class: 'place',
  osm_id: 1,
  licence: 'synthetic',
  osm_type: 'relation',
  place_id: 1,
  importance: 1,
  display_name: 'Seville, Spain',
  boundingbox: [],
};
let mockNextPlace = mockValidPlace;

jest.mock('@amraneze/osm-autocomplete', () => {
  const ReactActual = jest.requireActual<typeof import('react')>('react');
  return {
    OpenStreetMapAutocomplete: ({
      onChange,
    }: {
      // eslint-disable-next-line no-unused-vars
      onChange: (place: typeof mockValidPlace | null) => void;
    }) =>
      ReactActual.createElement(
        'div',
        null,
        ReactActual.createElement(
          'button',
          { type: 'button', onClick: () => onChange(mockNextPlace) },
          'Select location',
        ),
        ReactActual.createElement(
          'button',
          { type: 'button', onClick: () => onChange(null) },
          'Clear search',
        ),
      ),
  };
});

const setFetch = (implementation: jest.Mock) => {
  global.fetch = implementation as unknown as typeof fetch;
};

const response = (payload: unknown, ok = true) =>
  ({ ok, json: async () => payload }) as Response;

describe('OSMLocationSearch reverse-geocoding recovery', () => {
  let onSelect: jest.Mock<void, [LocationSearchPlace]>;

  beforeEach(() => {
    mockNextPlace = mockValidPlace;
    onSelect = jest.fn();
    setFetch(jest.fn().mockResolvedValue(
      response({ address: { city: 'Seville', country: 'Spain' } }),
    ));
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns a valid location after successful reverse geocoding', async () => {
    render(<OSMLocationSearch onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('button', { name: 'Select location' }));

    await waitFor(() =>
      expect(onSelect).toHaveBeenCalledWith({
        lat: 37.3891,
        lon: -5.9845,
        city: 'Seville',
        country: 'Spain',
      }),
    );
  });

  it('shows a retryable error on a non-2xx response and accepts a successful retry', async () => {
    const fetchMock = jest.fn().mockResolvedValueOnce(response({ error: 'busy' }, false));
    setFetch(fetchMock);
    render(<OSMLocationSearch onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('button', { name: 'Select location' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/could not look up/i);
    expect(onSelect).not.toHaveBeenCalled();

    fetchMock.mockResolvedValueOnce(
      response({ address: { town: 'Seville', country: 'Spain' } }),
    );
    fireEvent.click(screen.getByRole('button', { name: 'Retry location lookup' }));

    await waitFor(() => expect(onSelect).toHaveBeenCalledTimes(1));
  });

  it.each([
    ['network rejection', () => Promise.reject(new Error('offline'))],
    ['missing address data', () => Promise.resolve(response({ error: 'missing' }))],
  ])('shows recoverable feedback for %s', async (_case, implementation) => {
    setFetch(jest.fn().mockImplementation(implementation));
    render(<OSMLocationSearch onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('button', { name: 'Select location' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/could not look up/i);
    expect(onSelect).not.toHaveBeenCalled();
    expect(
      screen.getByRole('button', { name: 'Retry location lookup' }),
    ).toBeInTheDocument();
  });

  it('rejects malformed coordinates before requesting or submitting a location', async () => {
    mockNextPlace = { ...mockValidPlace, lat: '91' };
    const fetchMock = jest.fn();
    setFetch(fetchMock);
    render(<OSMLocationSearch onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('button', { name: 'Select location' }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/valid coordinates/i);
    expect(fetchMock).not.toHaveBeenCalled();
    expect(onSelect).not.toHaveBeenCalled();
    expect(
      screen.queryByRole('button', { name: 'Retry location lookup' }),
    ).not.toBeInTheDocument();
  });

  it('does not replace a previously accepted selection when the search is cleared', async () => {
    render(<OSMLocationSearch onSelect={onSelect} />);
    fireEvent.click(screen.getByRole('button', { name: 'Select location' }));
    await waitFor(() => expect(onSelect).toHaveBeenCalledTimes(1));

    fireEvent.click(screen.getByRole('button', { name: 'Clear search' }));
    expect(onSelect).toHaveBeenCalledTimes(1);
  });
});
