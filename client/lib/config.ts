/**
 * Utility to get configuration values with support for local session overrides.
 * This allows the user to enter keys in the Admin UI and have them work immediately.
 */

export const getConfig = (key: string, defaultValue: string = ''): string => {
  // Check localStorage for a "SESSION_" override first
  const sessionValue = localStorage.getItem(`SESSION_${key}`);
  if (sessionValue) return sessionValue;

  // Fallback to process.env or import.meta.env
  // Note: prefixed with VITE_ for client-side exposure if using import.meta.env
  const envValue = (process.env as any)[key] || (import.meta.env as any)[key] || (import.meta.env as any)[`VITE_${key}`];
  if (envValue) return envValue;

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
