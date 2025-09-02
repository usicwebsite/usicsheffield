"use client";

import React from 'react';
import { AlertTriangle, X, RefreshCw, AlertCircle, Info } from 'lucide-react';

export interface ErrorDisplayProps {
  error?: Error | string | null;
  title?: string;
  message?: string;
  type?: 'error' | 'warning' | 'info';
  showRetry?: boolean;
  onRetry?: () => void;
  onDismiss?: () => void;
  className?: string;
}

export function ErrorDisplay({
  error,
  title,
  message,
  type = 'error',
  showRetry = false,
  onRetry,
  onDismiss,
  className = ''
}: ErrorDisplayProps) {
  if (!error && !message) return null;

  const errorMessage = typeof error === 'string' ? error : error?.message;
  const displayMessage = message || errorMessage || 'An unexpected error occurred';

  const getIcon = () => {
    switch (type) {
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-red-400" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'warning':
        return 'bg-yellow-500/10 border-yellow-500/30';
      case 'info':
        return 'bg-blue-500/10 border-blue-500/30';
      default:
        return 'bg-red-500/10 border-red-500/30';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'warning':
        return 'text-yellow-300';
      case 'info':
        return 'text-blue-300';
      default:
        return 'text-red-300';
    }
  };

  return (
    <div className={`bg-white/5 backdrop-blur-sm border rounded-lg p-4 ${getBackgroundColor()} ${className}`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mt-0.5">
          {getIcon()}
        </div>
        
        <div className="ml-3 flex-1">
          {title && (
            <h3 className={`text-sm font-medium ${getTextColor()}`}>
              {title}
            </h3>
          )}
          <div className={`mt-1 text-sm ${getTextColor()}`}>
            <p>{displayMessage}</p>
          </div>
          
          {showRetry && onRetry && (
            <div className="mt-3">
              <button
                onClick={onRetry}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
              >
                <RefreshCw className="w-3 h-3 mr-1" />
                Try Again
              </button>
            </div>
          )}
        </div>
        
        {onDismiss && (
          <div className="ml-auto pl-3">
            <button
              onClick={onDismiss}
              className="inline-flex text-gray-400 hover:text-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// Specialized error components
export function NetworkError({ error, onRetry, onDismiss }: {
  error?: Error | string;
  onRetry?: () => void;
  onDismiss?: () => void;
}) {
  return (
    <ErrorDisplay
      error={error}
      title="Network Error"
      message="Unable to connect to the server. Please check your internet connection and try again."
      type="error"
      showRetry={true}
      onRetry={onRetry}
      onDismiss={onDismiss}
    />
  );
}

export function ValidationError({ errors, onDismiss }: {
  errors: string[];
  onDismiss?: () => void;
}) {
  return (
    <ErrorDisplay
      message={errors.join(', ')}
      title="Validation Error"
      type="warning"
      onDismiss={onDismiss}
    />
  );
}

export function LoadingError({ error, onRetry, onDismiss }: {
  error?: Error | string;
  onRetry?: () => void;
  onDismiss?: () => void;
}) {
  return (
    <ErrorDisplay
      error={error}
      title="Loading Error"
      message="Failed to load content. Please try again."
      type="error"
      showRetry={true}
      onRetry={onRetry}
      onDismiss={onDismiss}
    />
  );
}

export function AuthError({ error, onRetry, onDismiss }: {
  error?: Error | string;
  onRetry?: () => void;
  onDismiss?: () => void;
}) {
  return (
    <ErrorDisplay
      error={error}
      title="Authentication Error"
      message="Please sign in again to continue."
      type="warning"
      showRetry={true}
      onRetry={onRetry}
      onDismiss={onDismiss}
    />
  );
}
