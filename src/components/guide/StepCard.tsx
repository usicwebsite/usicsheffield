"use client";

import { useState } from "react";

interface StepCardProps {
  number: number;
  title: string;
  children: React.ReactNode;
}

export default function StepCard({ number, title, children }: StepCardProps) {
  const [isCompleted, setIsCompleted] = useState(false);
  
  return (
    <div className={`border rounded-lg mb-6 overflow-hidden ${
      isCompleted ? "border-green-300 bg-green-50" : "border-gray-200"
    }`}>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gray-50 border-b border-gray-200">
        <div className="flex items-center">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 ${
            isCompleted ? "bg-green-500 text-white" : "bg-gray-200 text-gray-700"
          }`}>
            {isCompleted ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
            ) : (
              <span>{number}</span>
            )}
          </div>
          <h3 className="font-medium text-gray-900">{title}</h3>
        </div>
        
        <button
          onClick={() => setIsCompleted(!isCompleted)}
          className={`text-sm px-3 py-1 rounded ${
            isCompleted
              ? "bg-green-100 text-green-800 hover:bg-green-200"
              : "bg-gray-100 text-gray-800 hover:bg-gray-200"
          }`}
        >
          {isCompleted ? "Completed" : "Mark as Complete"}
        </button>
      </div>
      
      {/* Content */}
      <div className="p-4">
        {children}
      </div>
    </div>
  );
} 