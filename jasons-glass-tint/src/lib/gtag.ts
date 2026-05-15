/**
 * Google Analytics 4 Event Tracking Utility
 * Sends custom events to GA4 for conversion tracking
 */

declare global {
  interface Window {
    gtag?: (command: string, ...args: unknown[]) => void;
  }
}

/**
 * Track a custom event in GA4
 * @param eventName - Name of the event (e.g., 'text_jason_click')
 * @param eventData - Additional data to send with the event
 */
export function trackEvent(eventName: string, eventData?: Record<string, unknown>) {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, {
      ...eventData,
      // Add automatic timestamp if not provided
      timestamp: new Date().toISOString(),
    });
  }
}

/**
 * Track "Text Jason" button click
 * @param source - Where the click came from (e.g., 'hero', 'cta_section', 'floating')
 */
export function trackTextJasonClick(source: string) {
  trackEvent('text_jason_click', {
    source_location: source,
    phone_number: '9494968468',
  });
}

/**
 * Track phone call button click
 * @param source - Where the click came from
 */
export function trackPhoneCallClick(source: string) {
  trackEvent('phone_call_click', {
    source_location: source,
    phone_number: '9494968468',
  });
}

/**
 * Track quote form submission (when form is submitted)
 * @param formData - Form data object
 */
export function trackQuoteFormSubmit(formData?: Record<string, unknown>) {
  trackEvent('quote_form_submit', {
    ...formData,
    service: formData?.service || 'general',
  });
}
