// lib/metadata.ts
import type { Metadata, ResolvingMetadata } from "next";

export type MetadataProps = {
  params: { [key: string]: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

export interface GenerateMetadataOptions {
  title?: string;
  description?: string;
  images?: string[];
  noIndex?: boolean;
  siteName?: string;
  type?: "website" | "article" | "profile";
  locale?: string;
}

export async function generateDynamicMetadata(
  options: GenerateMetadataOptions,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const previousImages = (await parent).openGraph?.images || [];
  //   const parentTitle = (await parent).title || '';

  const {
    title,
    description,
    images = [],
    noIndex = false,
    siteName = "Your Site Name",
    type = "website",
    locale = "en_US",
  } = options;

  return {
    title: title,
    description: description,
    openGraph: {
      title: title,
      description: description,
      siteName: siteName,
      type: type,
      locale: locale,
      images: [...images, ...previousImages],
    },
    twitter: {
      card: "summary_large_image",
      title: title,
      description: description,
    },
    robots: {
      index: !noIndex,
      follow: !noIndex,
    },
    alternates: {
      canonical: typeof window !== "undefined" ? window.location.href : "",
    },
  };
}
