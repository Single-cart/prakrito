export const customEvent = (data: any) => {
  if (window.dataLayer) {
    window.dataLayer.push(data);
  }
};
