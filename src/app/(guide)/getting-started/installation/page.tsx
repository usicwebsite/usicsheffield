import GuideContent from "@/components/guide/GuideContent";
import CodeBlock from "@/components/guide/CodeBlock";
import TipBox from "@/components/guide/TipBox";
import LinkCard from "@/components/guide/LinkCard";
import Collapsible from "@/components/guide/Collapsible";
import { guideSections, externalLinks } from "@/lib/guide-data";
import { getStepsForSection, getNextStep, getPrevStep } from "@/lib/progress";

export default function InstallationPage() {
  const sectionId = "getting-started";
  const currentStepId = "getting-started-installation";
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
      <h2 className="text-2xl font-bold mb-4">Installing Cursor</h2>
      
      <p className="mb-4">
        Cursor is available for macOS and Windows. Follow the steps below to install Cursor on your system.
      </p>
      
      <Collapsible title="macOS Installation" defaultOpen={true}>
        <ol className="list-decimal pl-6 space-y-4 mb-6">
          <li>
            <p>Download the macOS installer (.dmg) from the <a href={externalLinks.cursor.download} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Cursor website</a>.</p>
          </li>
          <li>
            <p>Open the downloaded .dmg file.</p>
          </li>
          <li>
            <p>Drag the Cursor icon to the Applications folder.</p>
          </li>
          <li>
            <p>Open Cursor from your Applications folder.</p>
          </li>
        </ol>
        
        <TipBox type="warning">
          <p>
            When opening Cursor for the first time on macOS, you might see a message that the app cannot be opened because it is from an unidentified developer. To resolve this:
          </p>
          <ol className="list-decimal pl-6 mt-2">
            <li>Go to System Preferences &gt; Security &amp; Privacy.</li>
            <li>Click the lock icon to make changes.</li>
            <li>Click &quot;Open Anyway&quot; next to the message about Cursor.</li>
          </ol>
        </TipBox>
      </Collapsible>
      
      <Collapsible title="Windows Installation">
        <ol className="list-decimal pl-6 space-y-4 mb-6">
          <li>
            <p>Download the Windows installer (.exe) from the <a href={externalLinks.cursor.download} target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">Cursor website</a>.</p>
          </li>
          <li>
            <p>Run the downloaded installer file.</p>
          </li>
          <li>
            <p>Follow the installation wizard instructions.</p>
          </li>
          <li>
            <p>Once installation is complete, Cursor will launch automatically.</p>
          </li>
        </ol>
        
        <TipBox type="tip">
          <p>
            If you&apos;re prompted about Windows Defender SmartScreen, click &quot;More info&quot; and then &quot;Run anyway&quot; to proceed with the installation.
          </p>
        </TipBox>
      </Collapsible>
      
      <Collapsible title="Verifying Your Installation">
        <p className="mb-4">
          After installing Cursor, you should see the welcome screen when you launch the application. If you encounter any issues during installation, check the <a href="/troubleshooting/installation" className="text-indigo-600 hover:underline">Installation Troubleshooting</a> section.
        </p>
        
        <TipBox type="important">
          <p>
            Cursor requires an internet connection for its AI features to work properly. Make sure you&apos;re connected to the internet when using Cursor.
          </p>
        </TipBox>
      </Collapsible>
      
      <Collapsible title="Next Steps">
        <p className="mb-4">
          Now that you have Cursor installed, the next step is to set up your development environment. Click the &quot;Next&quot; button below to continue to the next section.
        </p>
      </Collapsible>
    </>
  );
  
  return (
    <GuideContent
      title="Installing Cursor"
      description="Learn how to download and install Cursor on your operating system."
      steps={steps}
      currentStepId={currentStepId}
      content={content}
      prevLink={prevLink}
      nextLink={nextLink}
    />
  );
} 