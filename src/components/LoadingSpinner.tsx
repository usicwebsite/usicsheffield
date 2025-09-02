"use client";

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export function LoadingSpinner({ size = 'md', text, className = '' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div className={`animate-spin rounded-full border-b-2 border-blue-500 ${sizeClasses[size]}`}></div>
      {text && (
        <p className="mt-2 text-gray-400 text-sm">{text}</p>
      )}
    </div>
  );
}

export function PageLoadingSpinner() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0A1219] to-[#18384D] flex items-center justify-center">
      <LoadingSpinner size="lg" text="Loading..." />
    </div>
  );
}

export function InlineLoadingSpinner({ text }: { text?: string }) {
  return (
    <div className="flex items-center justify-center py-4">
      <LoadingSpinner size="md" text={text} />
    </div>
  );
}
