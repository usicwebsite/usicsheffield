"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import ProgressTracker from "./ProgressTracker";

interface Step {
  id: string;
  title: string;
}

interface GuideContentProps {
  title: string;
  description: string;
  steps: Step[];
  currentStepId: string;
  content: React.ReactNode;
  prevLink?: {
    href: string;
    title: string;
  };
  nextLink?: {
    href: string;
    title: string;
  };
}

export default function GuideContent({
  title,
  description,
  steps,
  currentStepId,
  content,
  prevLink,
  nextLink,
}: GuideContentProps) {
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackType, setFeedbackType] = useState<"helpful" | "notHelpful" | null>(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [completedSteps, setCompletedSteps] = useState<string[]>([]);
  const [isCurrentStepCompleted, setIsCurrentStepCompleted] = useState(false);
  
  // Load completed steps from localStorage on component mount
  useEffect(() => {
    const savedProgress = localStorage.getItem("cursorGuideProgress");
    if (savedProgress) {
      try {
        const savedSteps = JSON.parse(savedProgress);
        setCompletedSteps(savedSteps);
        setIsCurrentStepCompleted(savedSteps.includes(currentStepId));
      } catch (error) {
        console.error("Failed to parse saved progress:", error);
      }
    }
  }, [currentStepId]);
  
  // Handle marking the current step as complete
  const handleMarkComplete = () => {
    const updatedSteps = isCurrentStepCompleted
      ? completedSteps.filter(id => id !== currentStepId)
      : [...completedSteps, currentStepId];
    
    setCompletedSteps(updatedSteps);
    setIsCurrentStepCompleted(!isCurrentStepCompleted);
    localStorage.setItem("cursorGuideProgress", JSON.stringify(updatedSteps));
    
    // Force update the ProgressTracker
    window.dispatchEvent(new Event('storage'));
  };
  
  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this feedback to your backend
    console.log("Feedback submitted:", { feedbackType, feedbackText });
    setShowFeedback(false);
    setFeedbackType(null);
    setFeedbackText("");
    alert("Thank you for your feedback!");
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
        <p className="text-lg text-gray-600">{description}</p>
      </div>
      
      {/* Progress tracker */}
      <ProgressTracker steps={steps} currentStepId={currentStepId} />
      
      {/* Main content */}
      <div className="prose prose-indigo max-w-none mb-12">
        {content}
      </div>
      
      {/* Mark as Complete button */}
      <div className="mb-8 flex justify-center">
        <button
          onClick={handleMarkComplete}
          className={`flex items-center px-6 py-3 rounded-lg font-medium transition-colors ${
            isCurrentStepCompleted
              ? "bg-green-100 text-green-800 hover:bg-green-200 border border-green-300"
              : "bg-indigo-600 text-white hover:bg-indigo-700"
          }`}
        >
          {isCurrentStepCompleted ? (
            <>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="mr-2"
              >
                <path d="M20 6L9 17l-5-5"></path>
              </svg>
              Marked as Complete
            </>
          ) : (
            <>
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                width="20" 
                height="20" 
                viewBox="0 0 24 24" 
                fill="none" 
                stroke="currentColor" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                className="mr-2"
              >
                <circle cx="12" cy="12" r="10"></circle>
                <path d="M12 8v4"></path>
                <path d="M12 16h.01"></path>
              </svg>
              Mark as Complete
            </>
          )}
        </button>
      </div>
      
      {/* Feedback section */}
      <div className="bg-gray-50 rounded-lg p-6 mb-8">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Was this guide helpful?</h3>
        
        {!showFeedback ? (
          <div className="flex space-x-4">
            <button
              onClick={() => {
                setFeedbackType("helpful");
                setShowFeedback(true);
              }}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              👍 Yes
            </button>
            <button
              onClick={() => {
                setFeedbackType("notHelpful");
                setShowFeedback(true);
              }}
              className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
            >
              👎 No
            </button>
          </div>
        ) : (
          <form onSubmit={handleFeedbackSubmit} className="space-y-4">
            <div>
              <label htmlFor="feedback" className="block text-sm font-medium text-gray-700 mb-1">
                {feedbackType === "helpful"
                  ? "What did you find most helpful?"
                  : "How can we improve this guide?"}
              </label>
              <textarea
                id="feedback"
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
              ></textarea>
            </div>
            <div className="flex space-x-3">
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
              >
                Submit Feedback
              </button>
              <button
                type="button"
                onClick={() => setShowFeedback(false)}
                className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
      
      {/* Navigation buttons */}
      <div className="flex justify-between border-t border-gray-200 pt-6">
        {prevLink ? (
          <Link
            href={prevLink.href}
            className="flex items-center text-indigo-600 hover:text-indigo-800"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2"
            >
              <line x1="19" y1="12" x2="5" y2="12"></line>
              <polyline points="12 19 5 12 12 5"></polyline>
            </svg>
            {prevLink.title}
          </Link>
        ) : (
          <div></div>
        )}
        
        {nextLink && (
          <Link
            href={nextLink.href}
            className="flex items-center text-indigo-600 hover:text-indigo-800"
          >
            {nextLink.title}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="ml-2"
            >
              <line x1="5" y1="12" x2="19" y2="12"></line>
              <polyline points="12 5 19 12 12 19"></polyline>
            </svg>
          </Link>
        )}
      </div>
    </div>
  );
} 