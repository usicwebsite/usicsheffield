"use client";

import React from 'react';

interface AdminTimeoutModalProps {
  isOpen: boolean;
  remainingSeconds: number;
  onStayLoggedIn: () => void;
  onLogout: () => void;
}

export default function AdminTimeoutModal({
  isOpen,
  remainingSeconds,
  onStayLoggedIn,
  onLogout
}: AdminTimeoutModalProps) {
  if (!isOpen) return null;

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4 p-6">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <svg
              className="h-6 w-6 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>

          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Session Timeout Warning
          </h3>

          <p className="text-sm text-gray-500 mb-4">
            Your admin session will expire due to inactivity in:
          </p>

          <p className="text-xs text-gray-400 mb-4">
            Note: Your session will remain active if you refresh the page or navigate between tabs.
          </p>

          <div className="text-3xl font-bold text-red-600 mb-6">
            {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
          </div>

          <p className="text-sm text-gray-600 mb-6">
            You will be automatically logged out after 15 minutes of inactivity to protect your account security.
          </p>

          <div className="flex space-x-3">
            <button
              onClick={onStayLoggedIn}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
            >
              Stay Logged In
            </button>

            <button
              onClick={onLogout}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-2 px-4 rounded-md transition-colors duration-200"
            >
              Logout Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
