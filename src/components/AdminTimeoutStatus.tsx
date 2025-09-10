"use client";

import React from 'react';
import { useAdminTimeoutContext } from './AdminTimeoutProvider';

interface AdminTimeoutStatusProps {
  className?: string;
}

export default function AdminTimeoutStatus({ className = '' }: AdminTimeoutStatusProps) {
  const { isActive, timeRemaining } = useAdminTimeoutContext();

  const minutes = Math.floor(timeRemaining / (60 * 1000));
  const seconds = Math.floor((timeRemaining % (60 * 1000)) / 1000);

  const formatTime = (mins: number, secs: number) => {
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${className}`}>
      <div className={`w-2 h-2 rounded-full mr-2 ${isActive ? 'bg-green-500' : 'bg-yellow-500'}`} />
      <span className="text-white">
        {isActive ? 'Active' : 'Inactive'} - {formatTime(minutes, seconds)}
      </span>
    </div>
  );
}
