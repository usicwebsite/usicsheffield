"use client";

import { useState } from "react";
import Image from "next/image";

interface ImageWithCaptionProps {
  src: string;
  alt: string;
  caption?: string;
  width: number;
  height: number;
}

export default function ImageWithCaption({
  src,
  alt,
  caption,
  width,
  height,
}: ImageWithCaptionProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <figure className="my-8">
      <div className="overflow-hidden rounded-lg border border-gray-200">
        {imageError ? (
          <div 
            className="w-full bg-gray-100 flex items-center justify-center text-gray-500"
            style={{ height: `${height / 2}px`, minHeight: "200px" }}
          >
            <div className="text-center p-4">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="48" 
                height="48" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="1.5" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                className="mx-auto mb-2"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
              <p>{alt || "Image not available"}</p>
            </div>
          </div>
        ) : (
          <Image
            src={src}
            alt={alt}
            width={width}
            height={height}
            className="w-full h-auto"
            onError={() => setImageError(true)}
          />
        )}
      </div>
      {caption && (
        <figcaption className="mt-2 text-center text-sm text-gray-500">
          {caption}
        </figcaption>
      )}
    </figure>
  );
} 