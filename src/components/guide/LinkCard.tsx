"use client";

import { useState } from "react";
import Image from "next/image";

interface LinkCardProps {
  title: string;
  description: string;
  url: string;
  icon?: string;
  iconAlt?: string;
}

export default function LinkCard({
  title,
  description,
  url,
  icon,
  iconAlt = "",
}: LinkCardProps) {
  const [imageError, setImageError] = useState(false);

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="block border border-gray-200 rounded-lg p-4 hover:border-indigo-300 hover:shadow-md transition-all mb-4"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-4">
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
            {icon && !imageError ? (
              <Image
                src={icon}
                alt={iconAlt}
                width={40}
                height={40}
                className="rounded"
                onError={() => setImageError(true)}
              />
            ) : (
              <span className="text-indigo-600 font-bold text-lg">{title.charAt(0)}</span>
            )}
          </div>
        </div>
        
        <div>
          <h3 className="text-lg font-medium text-indigo-600 mb-1">{title}</h3>
          <p className="text-gray-600 text-sm">{description}</p>
          
          <div className="flex items-center mt-2 text-sm text-gray-500">
            <span className="truncate">{url}</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ml-1"
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
              <polyline points="15 3 21 3 21 9"></polyline>
              <line x1="10" y1="14" x2="21" y2="3"></line>
            </svg>
          </div>
        </div>
      </div>
    </a>
  );
} 