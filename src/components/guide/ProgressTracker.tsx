"use client";

import { useState, useEffect } from "react";

interface ProgressTrackerProps {
  steps: {
    id: string;
    title: string;
  }[];
  currentStepId: string;
}

export default function ProgressTracker({ steps, currentStepId }: ProgressTrackerProps) {
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  
  // Load completed steps from localStorage on component mount and when storage changes
  const loadProgress = () => {
    const savedProgress = localStorage.getItem("cursorGuideProgress");
    if (savedProgress) {
      try {
        setCompletedSteps(JSON.parse(savedProgress));
      } catch (error) {
        console.error("Failed to parse saved progress:", error);
      }
    }
  };
  
  // Load progress on mount
  useEffect(() => {
    loadProgress();
    
    // Listen for storage events (from other components)
    window.addEventListener('storage', loadProgress);
    
    // Custom event listener for direct updates within the same window
    const handleStorageChange = () => loadProgress();
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', loadProgress);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);
  
  // Save completed steps to localStorage when they change
  useEffect(() => {
    if (completedSteps.length > 0) {
      localStorage.setItem("cursorGuideProgress", JSON.stringify(completedSteps));
    }
  }, [completedSteps]);
  
  // Toggle step completion status
  const toggleStepCompletion = (stepId: string) => {
    setCompletedSteps(prev => 
      prev.includes(stepId)
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };
  
  // Calculate current step index
  const currentStepIndex = steps.findIndex(step => step.id === currentStepId);
  
  // Calculate progress percentage
  const progressPercentage = Math.round((completedSteps.length / steps.length) * 100);
  
  return (
    <div className="mb-8">
      {/* Progress bar */}
      <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
        <div 
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300 ease-in-out" 
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>
      
      {/* Progress stats */}
      <div className="flex justify-between text-sm text-gray-600 mb-6">
        <span>{completedSteps.length} of {steps.length} steps completed</span>
        <span>{progressPercentage}% complete</span>
      </div>
      
      {/* Steps list */}
      <div className="space-y-2">
        {steps.map((step, index) => (
          <div 
            key={step.id}
            className={`flex items-center p-3 rounded-lg border ${
              currentStepId === step.id 
                ? "border-indigo-300 bg-indigo-50" 
                : "border-gray-200 hover:bg-gray-50"
            }`}
          >
            <button
              onClick={() => toggleStepCompletion(step.id)}
              className={`w-5 h-5 rounded-full border flex items-center justify-center mr-3 flex-shrink-0 ${
                completedSteps.includes(step.id)
                  ? "bg-green-500 border-green-500 text-white"
                  : "border-gray-300"
              }`}
            >
              {completedSteps.includes(step.id) && (
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              )}
            </button>
            
            <div className="flex-grow">
              <div className="flex items-center">
                <span className="font-medium">{index + 1}. {step.title}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 