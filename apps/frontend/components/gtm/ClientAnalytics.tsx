/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import dynamic from "next/dynamic";

// Dynamically import the PageViewTracker with SSR disabled
const PageViewTracker = dynamic(
  () => import("./PageViewTracker"),
  { ssr: false } // This is crucial - it prevents server-side rendering
);

interface ClientAnalyticsProps {
  event: string;
  pageData: {
    title: string;
    type: string;
  };
  productData?: any;
}

const ClientAnalytics: React.FC<ClientAnalyticsProps> = ({
  event,
  pageData,
  productData,
}) => {
  // This component will only render on the client side
  return (
    <PageViewTracker
      event={event}
      pageData={pageData}
      productData={productData}
    />
  );
};

export default ClientAnalytics;
