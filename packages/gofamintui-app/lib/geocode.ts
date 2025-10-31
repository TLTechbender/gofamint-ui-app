// lib/geocode.ts
export const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    );
    const data = await response.json();
    
    if (data.status === 'OK' && data.results[0]) {
      return data.results[0].formatted_address;
    }
    return `${lat}, ${lng}`; // Fallback to coordinates if address not found
  } catch (error) {
  
    return `${lat}, ${lng}`;
  }
};