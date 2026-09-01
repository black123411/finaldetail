import type { MouseEvent } from 'react';

type AnalyticsParams = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
  }
}

export const trackEvent = (eventName: string, params: AnalyticsParams = {}) => {
  if (typeof window === 'undefined') return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    event_id: typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    page_path: `${window.location.pathname}${window.location.search}`,
    ...params,
  });
};

type BookingHandoffParams = AnalyticsParams & {
  location: string;
  service_id?: string;
};

const bookingEventParams = (href: string, params: BookingHandoffParams) => ({
  booking_provider: 'square',
  destination_host: new URL(href, window.location.href).hostname,
  ...params,
});

/**
 * Gives GTM a brief chance to send the outbound booking event before the page
 * leaves for Square. Modified clicks still open normally in a new tab/window.
 */
export const trackBookingHandoff = (
  event: MouseEvent<HTMLAnchorElement>,
  params: BookingHandoffParams,
) => {
  if (typeof window === 'undefined') return;

  const href = event.currentTarget.href;
  const details = bookingEventParams(href, params);
  const modifiedClick = event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;

  trackEvent('booking_select_service', details);

  if (modifiedClick || event.currentTarget.target === '_blank') {
    trackEvent('begin_booking', details);
    return;
  }

  event.preventDefault();
  let navigated = false;
  const continueToSquare = () => {
    if (navigated) return;
    navigated = true;
    window.location.assign(href);
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'begin_booking',
    event_id: typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    page_path: `${window.location.pathname}${window.location.search}`,
    ...details,
    eventCallback: continueToSquare,
    eventTimeout: 700,
  });

  window.setTimeout(continueToSquare, 750);
};

export const redirectToBookingAfterTracking = (href: string, params: BookingHandoffParams) => {
  if (typeof window === 'undefined') return () => undefined;

  const details = bookingEventParams(href, params);
  trackEvent('booking_select_service', details);

  let navigated = false;
  const continueToSquare = () => {
    if (navigated) return;
    navigated = true;
    window.location.replace(href);
  };

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'begin_booking',
    event_id: typeof crypto?.randomUUID === 'function' ? crypto.randomUUID() : `${Date.now()}-${Math.random()}`,
    page_path: `${window.location.pathname}${window.location.search}`,
    ...details,
    eventCallback: continueToSquare,
    eventTimeout: 700,
  });

  const timeoutId = window.setTimeout(continueToSquare, 750);
  return () => window.clearTimeout(timeoutId);
};
