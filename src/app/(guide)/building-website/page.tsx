import Link from "next/link";
import { guideSections } from "@/lib/guide-data";
import { getStepsForSection } from "@/lib/progress";
import StepCard from "@/components/guide/StepCard";
import TipBox from "@/components/guide/TipBox";

export default function BuildingWebsitePage() {
  // Get steps for this section
  const sectionId = "building-website";
  const section = guideSections.find(s => s.id === sectionId);
  const steps = getStepsForSection(guideSections, sectionId);
  
  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Building Your Website with Cursor</h1>
        <p className="text-lg text-gray-600">
          Learn how to create a website from scratch using Cursor&apos;s AI-powered features to speed up your development process.
        </p>
      </div>
      
      <div className="mb-8">
        <TipBox type="note">
          <p>
            In this section, we&apos;ll guide you through building a simple but functional website. You&apos;ll learn how to 
            structure your project, create HTML pages, style them with CSS, add interactivity with JavaScript, and make your 
            site responsive.
          </p>
        </TipBox>
        
        <h2 className="text-2xl font-bold mt-8 mb-4">What You&apos;ll Build</h2>
        <p className="mb-4">
          By the end of this section, you&apos;ll have built a personal portfolio website that includes:
        </p>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li>A responsive homepage with a hero section</li>
          <li>An about page with your bio and skills</li>
          <li>A projects showcase section</li>
          <li>A contact form</li>
          <li>Navigation and footer components</li>
        </ul>
        
        <h2 className="text-2xl font-bold mt-8 mb-4">Prerequisites</h2>
        <ul className="list-disc pl-6 space-y-2 mb-6">
          <li>Cursor installed and set up (covered in the Getting Started section)</li>
          <li>Basic understanding of HTML, CSS, and JavaScript</li>
          <li>Node.js and npm installed</li>
        </ul>
      </div>
      
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Steps in this Section</h2>
        
        {steps.map((step, index) => (
          <Link key={step.id} href={`/building-website/${step.id.split('-').pop()}`}>
            <StepCard number={index + 1} title={step.title}>
              <p className="text-gray-600">
                {index === 0 && "Learn how to create a new project and set up the basic structure for your website."}
                {index === 1 && "Create the HTML structure for your website and learn how to use Cursor to speed up HTML coding."}
                {index === 2 && "Add JavaScript to make your website interactive and dynamic."}
                {index === 3 && "Make your website look great on all devices with responsive design techniques."}
              </p>
            </StepCard>
          </Link>
        ))}
      </div>
      
      <div className="border-t border-gray-200 pt-6">
        <Link
          href={`/building-website/${steps[0].id.split('-').pop()}`}
          className="flex items-center text-indigo-600 hover:text-indigo-800"
        >
          Start with Creating a New Project
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