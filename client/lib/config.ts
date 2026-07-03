/**
 * Utility to get configuration values with support for local session overrides.
 * This allows the user to enter keys in the Admin UI and have them work immediately.
 */

export const getConfig = (key: string, defaultValue: string = ''): string => {
  // Check localStorage for a "SESSION_" override first
  try {
    const sessionValue = localStorage.getItem(`SESSION_${key}`);
    if (sessionValue) return sessionValue;
  } catch (e) {}

  // Explicitly check for known keys since Vite replaces them statically
  if (key === 'GEMINI_API_KEY') return (import.meta as any).env?.VITE_GEMINI_API_KEY || '';
  if (key === 'VITE_SQUARE_APP_ID') return (import.meta as any).env?.VITE_SQUARE_APP_ID || '';
  if (key === 'VITE_SQUARE_LOCATION_ID') return (import.meta as any).env?.VITE_SQUARE_LOCATION_ID || '';
  if (key === 'GOOGLE_MAPS_API_KEY' || key === 'GOOGLE_PLACES_API_KEY') return (import.meta as any).env?.VITE_GOOGLE_MAPS_API_KEY || (import.meta as any).env?.VITE_GOOGLE_PLACES_API_KEY || '';

  return defaultValue;
};

export const getGeminiKey = () => getConfig('GEMINI_API_KEY') || (import.meta.env as any).VITE_GEMINI_API_KEY;
export const getSquareAppId = () => getConfig('VITE_SQUARE_APP_ID');
export const getSquareLocationId = () => getConfig('VITE_SQUARE_LOCATION_ID');
export const getSquareAccessToken = () => getConfig('SQUARE_ACCESS_TOKEN');
export const getGoogleMapsApiKey = () => getConfig('GOOGLE_PLACES_API_KEY') || getConfig('GOOGLE_MAPS_API_KEY');
export const getGooglePlaceId = () => getConfig('GOOGLE_PLACE_ID');

export const getSquareHeaders = () => ({
  'x-square-access-token': getSquareAccessToken(),
  'x-square-location-id': getSquareLocationId(),
  'x-google-maps-api-key': getGoogleMapsApiKey(),
  'x-google-place-id': getGooglePlaceId()
});
