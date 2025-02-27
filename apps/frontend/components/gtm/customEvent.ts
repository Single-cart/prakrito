/* eslint-disable @typescript-eslint/no-explicit-any */
export const customEvent = (data: any) => {
  if (window.dataLayer) {
    window.dataLayer.push(data);
  }
};
