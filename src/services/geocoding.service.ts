// /services/geocoding.service.ts

export async function getCoordinatesFromLocation(city: string, district: string, state: string) {
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

  const data = await response.json();

  if (data.length === 0) {
    throw new Error("Location not found");
  }

  const { lat, lon } = data[0];

  return {
    lat: parseFloat(lat),
    lng: parseFloat(lon),
  };
}
