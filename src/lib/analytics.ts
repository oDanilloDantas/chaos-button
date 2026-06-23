type DataLayerEvent = Record<string, unknown> & { event: string };

declare global {
  interface Window {
    dataLayer?: DataLayerEvent[];
  }
}

/** Pushes an event to the GTM dataLayer (no-op on the server). */
export function pushDataLayer(event: string, data?: Record<string, unknown>): void {
  if (typeof window === "undefined") {
    return;
  }
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...data });
}
