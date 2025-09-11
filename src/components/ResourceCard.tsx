'use client';

import Image from 'next/image';

interface ResourceCardProps {
  id: number;
  title: string;
  description: string;
  imagePath: string;
  category: string;
  link?: string;
  isExternal?: boolean;
  isModal?: boolean;
  linkText: string;
  onModalClick?: () => void;
}

export default function ResourceCard({
  title,
  description,
  imagePath,
  category,
  link,
  isExternal = false,
  isModal = false,
  linkText,
  onModalClick
}: ResourceCardProps) {
  const cardContent = (
    <>
      {/* Resource image */}
      <div className="relative h-[300px] overflow-hidden">
        <Image 
          src={imagePath}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/30"></div>
        
        {/* Category tag */}
        <div className="absolute top-4 left-4 bg-white text-[#18384D] px-3 py-1 text-sm font-bold rounded">
          {category}
        </div>
      </div>
      
      {/* Resource content */}
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-3 uppercase tracking-wide">{title}</h2>
        <p className="text-blue-100 mb-4">{description}</p>
        <div className="inline-block text-white border-b-2 border-white pb-1 transition-all duration-300 group-hover:text-blue-200 group-hover:border-blue-200">
          {linkText}
        </div>
      </div>
    </>
  );

  if (isModal) {
    return (
      <div className="relative group overflow-hidden rounded-lg shadow-lg bg-[#0F1E2C] transition-all duration-300 hover:shadow-xl cursor-pointer">
        <button
          onClick={onModalClick}
          className="w-full h-full text-left"
        >
          {cardContent}
        </button>
      </div>
    );
  }

  return (
    <div className="relative group overflow-hidden rounded-lg shadow-lg bg-[#0F1E2C] transition-all duration-300 hover:shadow-xl cursor-pointer">
      <a
        href={link}
        target={isExternal ? "_blank" : undefined}
        rel={isExternal ? "noopener noreferrer" : undefined}
        className="block w-full h-full"
      >
        {cardContent}
      </a>
    </div>
  );
}
