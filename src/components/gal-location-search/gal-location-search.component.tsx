import React, { useState } from 'react';
import {
  OpenStreetMapAutocomplete,
  OpeenStreetMap,
} from '@amraneze/osm-autocomplete';

export interface GalLocation {
  lat: number;
  lon: number;
  city: string;
  country: string;
}

interface Props {
  // eslint-disable-next-line no-unused-vars
  onSelect: (place: GalLocation) => void;
}

async function fetchStructuredAddress(lat: number, lon: number) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`,
  );
  const data = await res.json();
  // data.address might look like:
  // { city: "Malaga", town: "...", county: "...", state: "...", country: "Spain", ... }
  const { address } = data;
  const city =
    address.city || address.town || address.village || address.county || '';
  const country = address.country || '';
  return { city, country };
}

const OSMLocationSearch: React.FC<Props> = ({ onSelect }) => {
  const [value, setValue] = useState<OpeenStreetMap | null>(null);

  return (
    <OpenStreetMapAutocomplete
      value={value}
      placeholder="Search city or country"
      debounce={300} // ms to wait between keystrokes
      noOptionName="No locations" // text when nothing matches
      onChange={async (place) => {
        setValue(place);
        if (!place) {
          return;
        }
        const lat = parseFloat(place.lat);
        const lon = parseFloat(place.lon);
        const { city, country } = await fetchStructuredAddress(lat, lon);
        onSelect({ lat, lon, city, country });
      }}
      // defaults to hitting https://nominatim.openstreetmap.org
    />
  );
};

export default OSMLocationSearch;
