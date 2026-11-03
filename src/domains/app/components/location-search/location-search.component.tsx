import React, { useRef, useState } from 'react';
import { Button } from '@shared/ui';
import {
  OpenStreetMapAutocomplete,
  OpeenStreetMap,
} from '@amraneze/osm-autocomplete';

export interface LocationSearchPlace {
  lat: number;
  lon: number;
  city: string;
  country: string;
}

interface Props {
  // eslint-disable-next-line no-unused-vars
  onSelect: (place: LocationSearchPlace) => void;
}

const parseCoordinates = (place: OpeenStreetMap) => {
  if (!place.lat.trim() || !place.lon.trim()) {
    return null;
  }
  const lat = Number(place.lat);
  const lon = Number(place.lon);
  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lon) ||
    lat < -90 ||
    lat > 90 ||
    lon < -180 ||
    lon > 180
  ) {
    return null;
  }
  return { lat, lon };
};

async function fetchStructuredAddress(lat: number, lon: number) {
  const response = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`,
  );
  if (!response.ok) {
    throw new Error('Location lookup failed');
  }

  const data: unknown = await response.json();
  if (!data || typeof data !== 'object' || !('address' in data)) {
    throw new Error('Location details are unavailable');
  }
  const address = (data as { address?: unknown }).address;
  if (!address || typeof address !== 'object') {
    throw new Error('Location details are unavailable');
  }
  const addressFields = address as Record<string, unknown>;
  const cityValue =
    addressFields.city ||
    addressFields.town ||
    addressFields.village ||
    addressFields.county;
  const city = typeof cityValue === 'string' ? cityValue.trim() : '';
  const country =
    typeof addressFields.country === 'string'
      ? addressFields.country.trim()
      : '';
  if (!city || !country) {
    throw new Error('Location details are incomplete');
  }
  return { city, country };
}

const OSMLocationSearch: React.FC<Props> = ({ onSelect }) => {
  const [value, setValue] = useState<OpeenStreetMap | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const selectedPlaceRef = useRef<OpeenStreetMap | null>(null);
  const requestIdRef = useRef(0);

  const resolvePlace = async (place: OpeenStreetMap) => {
    const requestId = ++requestIdRef.current;
    selectedPlaceRef.current = place;
    setValue(place);
    setError(null);

    const coordinates = parseCoordinates(place);
    if (!coordinates) {
      setIsLoading(false);
      setError('Choose a location with valid coordinates, then try again.');
      return;
    }
    const { lat, lon } = coordinates;

    setIsLoading(true);
    try {
      const { city, country } = await fetchStructuredAddress(lat, lon);
      if (requestId === requestIdRef.current) {
        onSelect({ lat, lon, city, country });
      }
    } catch {
      if (requestId === requestIdRef.current) {
        setError(
          'We could not look up this location. Retry the lookup or choose another result.',
        );
      }
    } finally {
      if (requestId === requestIdRef.current) {
        setIsLoading(false);
      }
    }
  };

  return (
    <div>
      <OpenStreetMapAutocomplete
        value={value}
        placeholder="Search city or country"
        debounce={300}
        noOptionName="No locations"
        onChange={(place) => {
          if (!place) {
            requestIdRef.current += 1;
            selectedPlaceRef.current = null;
            setValue(null);
            setIsLoading(false);
            setError(null);
            return;
          }
          void resolvePlace(place);
        }}
      />
      {isLoading && <p role="status">Looking up location…</p>}
      {error && (
        <div role="alert">
          <p>{error}</p>
          {selectedPlaceRef.current &&
            parseCoordinates(selectedPlaceRef.current) && (
            <Button
              type="button"
              variant="neutral"
              onClick={() => {
                if (selectedPlaceRef.current) {
                  void resolvePlace(selectedPlaceRef.current);
                }
              }}
            >
              Retry location lookup
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default OSMLocationSearch;
