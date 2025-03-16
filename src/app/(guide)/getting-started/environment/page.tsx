import GuideContent from "@/components/guide/GuideContent";
import CodeBlock from "@/components/guide/CodeBlock";
import TipBox from "@/components/guide/TipBox";
import LinkCard from "@/components/guide/LinkCard";
import Collapsible from "@/components/guide/Collapsible";
import { guideSections, externalLinks } from "@/lib/guide-data";
import { getStepsForSection, getNextStep, getPrevStep } from "@/lib/progress";

export default function EnvironmentSetupPage() {
  const sectionId = "getting-started";
  const currentStepId = "getting-started-environment";
  const steps = getStepsForSection(guideSections, sectionId);
  
  const nextStep = getNextStep(guideSections, currentStepId);
  const prevStep = getPrevStep(guideSections, currentStepId);
  
  const nextLink = nextStep
    ? {
        href: `/getting-started/${nextStep.id.split("-").pop()}`,
        title: nextStep.title,
      }
    : undefined;
  
  const prevLink = prevStep
    ? {
        href: `/getting-started/${prevStep.id.split("-").pop()}`,
        title: prevStep.title,
      }
    : {
        href: "/getting-started",
        title: "Getting Started Overview",
      };
  
  const content = (
    <>
      <h2 className="text-2xl font-bold mb-4">Setting Up Your Development Environment</h2>
      
      <p className="mb-4">
        Now that you have Cursor installed, let&apos;s set up your development environment for web development. You can either open an existing project or clone our template repository to get started quickly.
      </p>
      
      <Collapsible title="Clone Repository" defaultOpen={true}>
        <p className="mb-4">
          Follow these steps to clone our template repository and get started with a pre-configured project:
        </p>
        
        <ol className="list-decimal pl-6 space-y-4 mb-6">
          <li>
            <p>Open Cursor and click on the &quot;Clone repo&quot; button on the welcome screen.</p>
            <p className="text-sm text-gray-600 mt-1">If you don&apos;t see the welcome screen, go to File &gt; Clone Repository.</p>
          </li>
          <li>
            <p>In the repository URL field, paste the following URL:</p>
            <CodeBlock
              language="text"
              code="https://github.com/mwijanarko1/template"
            />
          </li>
          <li>
            <p>Choose a local folder where you want to save the project.</p>
          </li>
          <li>
            <p>Wait for the cloning process to complete. Cursor will automatically open the project once it&apos;s done.</p>
          </li>
        </ol>
        
        <TipBox type="important">
          <p>
            After cloning the repository, follow any instructions that appear in the terminal. These instructions might include installing dependencies or setting up configuration files.
          </p>
        </TipBox>

        <h3 className="text-xl font-bold mt-8 mb-3">Using the Template Repository</h3>
      
      <p className="mb-4">
        After cloning the template repository, you&apos;ll find a special file called <code>PROMPT.txt</code> that contains instructions for Cursor&apos;s AI. Here&apos;s how to use it:
      </p>
      
      <ol className="list-decimal pl-6 space-y-4 mb-6">
        <li>
          <p>Open the Cursor AI Composer by clicking on the AI icon in the sidebar or using the keyboard shortcut <code>Cmd+I</code> (macOS) or <code>Ctrl+I</code> (Windows/Linux).</p>
        </li>
        <li>
          <p>Make sure to select &quot;Agent&quot; mode in the Composer panel.</p>
        </li>
        <li>
          <p>In the Cursor file explorer, locate the <code>PROMPT.txt</code> file.</p>
        </li>
        <li>
          <p>Open the file and copy its contents.</p>
        </li>
        <li>
          <p>Paste the contents into the Composer panel.</p>
        </li>
        <li>
          <p>Press the &quot;Send&quot; button or hit <code>Cmd+Enter</code> (macOS) or <code>Ctrl+Enter</code> (Windows/Linux) to submit the prompt to the AI.</p>
        </li>
        <li>
          <p>Wait for the Cursor Agent to generate the project based on the prompt.</p>
        </li>
        <li>
          <p>Follow any additional instructions provided by the Agent.</p>
        </li>
      </ol>
      
      <TipBox type="note">
        <p>
          If you encounter any errors during the process, you can copy/paste the error message or take a screenshot and share it with the Cursor Agent. Simply ask it to fix the error, and it will help you resolve the issue.
        </p>
      </TipBox>
      </Collapsible>
      
      <h3 className="text-xl font-bold mt-8 mb-3">Next Steps</h3>
      
      <p className="mb-4">
        Now that your development environment is set up and you&apos;ve learned how to use the template with Cursor&apos;s AI features, let&apos;s explore the Cursor interface in more detail. Click the &quot;Next&quot; button below to continue.
      </p>
    </>
  );
  
  return (
    <GuideContent
      title="Setting Up Your Environment"
      description="Configure your development environment for web development with Cursor."
      steps={steps}
      currentStepId={currentStepId}
      content={content}
      prevLink={prevLink}
      nextLink={nextLink}
    />
  );
} 