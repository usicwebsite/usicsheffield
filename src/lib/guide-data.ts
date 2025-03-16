import { Section, Step } from "./progress";

// Define the sections and steps for the guide
export const guideSections: Section[] = [
  {
    id: "getting-started",
    title: "Getting Started",
    steps: [
      {
        id: "getting-started-installation",
        title: "Installing Cursor",
        sectionId: "getting-started",
      },
      {
        id: "getting-started-environment",
        title: "Setting Up Your Environment",
        sectionId: "getting-started",
      },
      {
        id: "getting-started-interface",
        title: "Cursor Interface Overview",
        sectionId: "getting-started",
      },
    ],
  },
  {
    id: "building-website",
    title: "Building Your Website",
    steps: [
      {
        id: "building-website-new-project",
        title: "Creating a New Project",
        sectionId: "building-website",
      },
      {
        id: "building-website-html-css",
        title: "HTML & CSS Basics",
        sectionId: "building-website",
      },
      {
        id: "building-website-javascript",
        title: "Adding JavaScript",
        sectionId: "building-website",
      },
      {
        id: "building-website-responsive",
        title: "Responsive Design",
        sectionId: "building-website",
      },
    ],
  },
  {
    id: "integrations",
    title: "Integrations",
    steps: [
      {
        id: "integrations-firebase",
        title: "Firebase Setup",
        sectionId: "integrations",
      },
      {
        id: "integrations-vercel",
        title: "Vercel Deployment",
        sectionId: "integrations",
      },
      {
        id: "integrations-authentication",
        title: "Authentication",
        sectionId: "integrations",
      },
      {
        id: "integrations-databases",
        title: "Databases",
        sectionId: "integrations",
      },
    ],
  },
  {
    id: "advanced-features",
    title: "Advanced Features",
    steps: [
      {
        id: "advanced-features-ai-completion",
        title: "AI Code Completion",
        sectionId: "advanced-features",
      },
      {
        id: "advanced-features-debugging",
        title: "Debugging Tools",
        sectionId: "advanced-features",
      },
      {
        id: "advanced-features-version-control",
        title: "Version Control",
        sectionId: "advanced-features",
      },
      {
        id: "advanced-features-extensions",
        title: "Extensions",
        sectionId: "advanced-features",
      },
    ],
  },
  {
    id: "troubleshooting",
    title: "Troubleshooting",
    steps: [
      {
        id: "troubleshooting-common-errors",
        title: "Common Errors",
        sectionId: "troubleshooting",
      },
      {
        id: "troubleshooting-performance",
        title: "Performance Issues",
        sectionId: "troubleshooting",
      },
      {
        id: "troubleshooting-installation",
        title: "Installation Problems",
        sectionId: "troubleshooting",
      },
    ],
  },
];

// External resource links
export const externalLinks = {
  cursor: {
    download: "https://cursor.sh",
    documentation: "https://cursor.sh/docs",
    github: "https://github.com/getcursor/cursor",
  },
  firebase: {
    homepage: "https://firebase.google.com",
    documentation: "https://firebase.google.com/docs",
    console: "https://console.firebase.google.com",
  },
  vercel: {
    homepage: "https://vercel.com",
    documentation: "https://vercel.com/docs",
    dashboard: "https://vercel.com/dashboard",
  },
  supabase: {
    homepage: "https://supabase.com",
    documentation: "https://supabase.com/docs",
    dashboard: "https://app.supabase.com",
  },
}; 