/* eslint-disable @typescript-eslint/no-explicit-any */
// Initialize dataLayer
export const initDataLayer = () => {
  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || [];
  }
};

// Push event to dataLayer
export const pushToDataLayer = (data: any) => {
  if (typeof window !== "undefined") {
    if (window.dataLayer) {
      window.dataLayer.push(data);
    } else {
      console.warn("Google Tag Manager dataLayer not found");
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push(data);
    }
  }
};
