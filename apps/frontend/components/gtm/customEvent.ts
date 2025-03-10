import { pushToDataLayer } from "@/lib/gtm";

/* eslint-disable @typescript-eslint/no-explicit-any */
export const customEvent = (data: any) => {
  pushToDataLayer(data);
};
