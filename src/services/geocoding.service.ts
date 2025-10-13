// /services/geocoding.service.ts

export interface Coordinates {
  lat: number;
  lng: number;
}

interface NominatimResult {
  lat: string;
  lon: string;
  display_name?: string;
  [key: string]: any; // Allow additional fields from the API
}

export async function getCoordinatesFromLocation(
  city: string,
  district: string,
  state: string
): Promise<Coordinates> {
  const query = `${city}, ${district}, ${state}, India`;
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`;

  const response = await fetch(url, {
    headers: {
      'User-Agent': 'market-locator/1.0 (your-email@example.com)' // Required by Nominatim
    }
  });

  if (!response.ok) {
    throw new Error("Failed to fetch location data");
  }

  const data = await response.json() as NominatimResult[];

  if (!Array.isArray(data) || data.length === 0) {
    throw new Error("Location not found");
  }

  const { lat, lon } = data[0];

  const parsedLat = parseFloat(lat);
  const parsedLon = parseFloat(lon);

  if (isNaN(parsedLat) || isNaN(parsedLon)) {
    throw new Error("Invalid coordinate format received");
  }

  return {
    lat: parsedLat,
    lng: parsedLon,
  };
}
