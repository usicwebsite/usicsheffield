import Link from "next/link";
import { guideSections } from "@/lib/guide-data";
import { getStepsForSection } from "@/lib/progress";
import StepCard from "@/components/guide/StepCard";
import LinkCard from "@/components/guide/LinkCard";
import TipBox from "@/components/guide/TipBox";

export default function GettingStartedPage() {
  // Get steps for this section
  const sectionId = "getting-started";
  const section = guideSections.find(s => s.id === sectionId);
  const steps = getStepsForSection(guideSections, sectionId);
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Getting Started with Cursor</h1>
        <p className="text-lg text-gray-600">
          Learn how to install and set up Cursor, the AI-powered code editor that will help you build websites faster.
        </p>
      </div>
      
      <div className="mb-8">
        <TipBox type="note">
          <p>
            Cursor is an AI-powered code editor built on top of VS Code. It offers powerful AI features like code completion, 
            explanation, and generation while maintaining the familiar VS Code experience.
          </p>
        </TipBox>
        
        <h2 className="text-2xl font-bold mt-8 mb-4">What You&apos;ll Learn</h2>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li>How to install Cursor on your operating system</li>
          <li>Setting everything up</li>
          <li>Navigating the Cursor interface</li>
          <li>Basic AI-powered features to help you code faster</li>
        </ul>
        
        <h2 className="text-2xl font-bold mt-8 mb-4">Prerequisites</h2>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li>A computer running Windows or macOS</li>
          <li>Internet connection for downloading Cursor and using its AI features</li>
        </ul>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Steps in this Section</h2>
        
        {steps.map((step, index) => (
          <Link key={step.id} href={`/getting-started/${step.id.split('-').pop()}`}>
            <StepCard number={index + 1} title={step.title}>
              <p className="text-gray-600">
                {index === 0 && "Learn how to download and install Cursor on your operating system."}
                {index === 1 && "Set up your development environment for web development with Cursor."}
                {index === 2 && "Get familiar with the Cursor interface and its AI-powered features."}
              </p>
            </StepCard>
          </Link>
        ))}
      </div>
      
      <div className="border-t border-gray-200 pt-6">
        <Link
          href={`/getting-started/${steps[0].id.split('-').pop()}`}
          className="flex items-center text-indigo-600 hover:text-indigo-800"
        >
          Start with Installing Cursor
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
      </div>
    </div>
  );
} 