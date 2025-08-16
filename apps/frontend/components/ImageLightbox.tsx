'use client';

import { Dialog, DialogContent, DialogTrigger } from '@workspace/ui/components/dialog';
import Image from 'next/image';
import { ReactNode } from 'react';

interface ImageLightboxProps {
  imageUrl: string;
  altText: string;
  children: ReactNode; // The trigger element
}

export default function ImageLightbox({
  imageUrl,
  altText,
  children,
}: ImageLightboxProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="p-0 border-0 max-w-5xl w-full bg-transparent shadow-none outline-none">
        <div className="relative aspect-video w-full">
          <Image
            src={imageUrl}
            alt={altText}
            fill
            className="object-contain"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
