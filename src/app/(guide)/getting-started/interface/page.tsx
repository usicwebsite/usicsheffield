import GuideContent from "@/components/guide/GuideContent";
import ImageWithCaption from "@/components/guide/ImageWithCaption";
import TipBox from "@/components/guide/TipBox";
import { guideSections, externalLinks } from "@/lib/guide-data";
import { getStepsForSection, getNextStep, getPrevStep } from "@/lib/progress";

export default function InterfaceOverviewPage() {
  const sectionId = "getting-started";
  const currentStepId = "getting-started-interface";
  const steps = getStepsForSection(guideSections, sectionId);
  
  const nextStep = getNextStep(guideSections, currentStepId);
  const prevStep = getPrevStep(guideSections, currentStepId);
  
  const nextLink = nextStep
    ? {
        href: `/building-website`,
        title: "Building Your Website",
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
      <h2 className="text-2xl font-bold mb-4">Cursor Interface Overview</h2>
      
      <p className="mb-4">
        Cursor&apos;s interface is based on VS Code, so if you&apos;re familiar with VS Code, you&apos;ll feel right at home. Let&apos;s explore the key components of the Cursor interface and its AI-powered features.
      </p>
      
      <h3 className="text-xl font-bold mt-8 mb-3">Main Interface Components</h3>
      
      <p className="mb-4">
        The Cursor interface consists of several key areas:
      </p>
      
      {/* Note: In a real implementation, you would replace these with actual screenshots */}
      <ImageWithCaption
        src="/cursor-interface.png"
        alt="Cursor Interface Overview"
        caption="The main components of the Cursor interface"
        width={800}
        height={500}
      />
      
      <ol className="list-decimal pl-6 space-y-4 mb-6 mt-6">
        <li>
          <p><strong>Activity Bar</strong>: The vertical bar on the far left that lets you switch between different views like Explorer, Search, Source Control, and Extensions.</p>
        </li>
        <li>
          <p><strong>Side Bar</strong>: Displays the active view (e.g., Explorer for navigating files).</p>
        </li>
        <li>
          <p><strong>Editor Area</strong>: The main area where you edit your code.</p>
        </li>
        <li>
          <p><strong>Status Bar</strong>: Shows information about your project and editor at the bottom of the window.</p>
        </li>
        <li>
          <p><strong>AI Panel</strong>: Cursor&apos;s unique AI interface for interacting with the AI assistant.</p>
        </li>
      </ol>
      
      <h3 className="text-xl font-bold mt-8 mb-3">AI Features in Cursor</h3>
      
      <p className="mb-4">
        What sets Cursor apart from regular code editors is its AI-powered features. Here are the key AI features you should know about:
      </p>
      
      <h4 className="text-lg font-semibold mt-6 mb-2">1. AI Chat</h4>
      
      <p className="mb-4">
        The AI Chat allows you to have a conversation with the AI assistant about your code. You can ask questions, request explanations, or get help with coding tasks.
      </p>
      
      <ImageWithCaption
        src="/cursor-ai-chat.png"
        alt="Cursor AI Chat"
        caption="The AI Chat interface in Cursor"
        width={800}
        height={400}
      />
      
      <p className="mt-4 mb-4">
        To open the AI Chat:
      </p>
      
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li>Click on the AI icon in the Activity Bar</li>
        <li>Use the keyboard shortcut <code>Ctrl+Shift+A</code> (Windows/Linux) or <code>Cmd+Shift+A</code> (macOS)</li>
      </ul>
      
      <TipBox type="tip">
        <p>
          When asking the AI for help, be specific about what you&apos;re trying to achieve. For example, instead of asking &quot;How do I fix this?&quot;, try &quot;How do I fix this TypeError in my React component?&quot;
        </p>
      </TipBox>
      
      <h4 className="text-lg font-semibold mt-6 mb-2">2. Code Completion</h4>
      
      <p className="mb-4">
        Cursor provides AI-powered code completion that goes beyond traditional autocomplete. It can suggest entire functions, blocks of code, or even complete implementations based on context.
      </p>
      
      <ImageWithCaption
        src="/cursor-code-completion.png"
        alt="Cursor Code Completion"
        caption="AI-powered code completion in action"
        width={800}
        height={400}
      />
      
      <p className="mt-4 mb-4">
        Code completion appears automatically as you type. You can:
      </p>
      
      <ul className="list-disc pl-6 space-y-2 mb-6">
        <li>Press <code>Tab</code> to accept the suggestion</li>
        <li>Continue typing to refine the suggestion</li>
        <li>Press <code>Esc</code> to dismiss the suggestion</li>
      </ul>
      
      <h4 className="text-lg font-semibold mt-6 mb-2">3. Code Generation</h4>
      
      <p className="mb-4">
        You can ask Cursor to generate code for you based on a description of what you want to achieve.
      </p>
      
      <p className="mb-4">
        To generate code:
      </p>
      
      <ol className="list-decimal pl-6 space-y-2 mb-6">
        <li>Open the AI Chat</li>
        <li>Describe what you want to create (e.g., &quot;Create a React component that displays a list of items with pagination&quot;)</li>
        <li>The AI will generate the code and explain how it works</li>
        <li>You can then insert the code into your file or ask for modifications</li>
      </ol>
      
      <h4 className="text-lg font-semibold mt-6 mb-2">4. Code Explanation</h4>
      
      <p className="mb-4">
        Cursor can explain code that you don&apos;t understand. This is particularly useful when working with unfamiliar codebases or complex algorithms.
      </p>
      
      <p className="mb-4">
        To get an explanation:
      </p>
      
      <ol className="list-decimal pl-6 space-y-2 mb-6">
        <li>Select the code you want to understand</li>
        <li>Right-click and select &quot;Explain Code&quot; or use the keyboard shortcut</li>
        <li>The AI will provide an explanation of what the code does</li>
      </ol>
      
      <h4 className="text-lg font-semibold mt-6 mb-2">5. Code Refactoring</h4>
      
      <p className="mb-4">
        You can ask Cursor to refactor your code to make it more efficient, readable, or maintainable.
      </p>
      
      <p className="mb-4">
        To refactor code:
      </p>
      
      <ol className="list-decimal pl-6 space-y-2 mb-6">
        <li>Select the code you want to refactor</li>
        <li>Open the AI Chat and ask for refactoring (e.g., &quot;Refactor this code to be more efficient&quot;)</li>
        <li>The AI will suggest improvements and can apply them for you</li>
      </ol>
      
      <h3 className="text-xl font-bold mt-8 mb-3">Keyboard Shortcuts</h3>
      
      <p className="mb-4">
        Learning keyboard shortcuts will help you work more efficiently in Cursor. Here are some essential shortcuts:
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">General</h4>
          <ul className="space-y-1">
            <li><code>Ctrl+P</code> / <code>Cmd+P</code>: Quick Open, Go to File</li>
            <li><code>Ctrl+Shift+P</code> / <code>Cmd+Shift+P</code>: Command Palette</li>
            <li><code>Ctrl+,</code> / <code>Cmd+,</code>: User Settings</li>
            <li><code>Ctrl+B</code> / <code>Cmd+B</code>: Toggle Sidebar</li>
          </ul>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Editing</h4>
          <ul className="space-y-1">
            <li><code>Ctrl+X</code> / <code>Cmd+X</code>: Cut line</li>
            <li><code>Ctrl+C</code> / <code>Cmd+C</code>: Copy line</li>
            <li><code>Alt+↑/↓</code> / <code>Option+↑/↓</code>: Move line up/down</li>
            <li><code>Ctrl+/</code> / <code>Cmd+/</code>: Toggle comment</li>
          </ul>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Navigation</h4>
          <ul className="space-y-1">
            <li><code>Ctrl+G</code> / <code>Cmd+G</code>: Go to Line</li>
            <li><code>Ctrl+Tab</code> / <code>Cmd+Tab</code>: Switch between open files</li>
            <li><code>Ctrl+F</code> / <code>Cmd+F</code>: Find</li>
            <li><code>Ctrl+Shift+F</code> / <code>Cmd+Shift+F</code>: Find in Files</li>
          </ul>
        </div>
        
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">AI Features</h4>
          <ul className="space-y-1">
            <li><code>Ctrl+Shift+A</code> / <code>Cmd+Shift+A</code>: Open AI Chat</li>
            <li><code>Tab</code>: Accept code completion</li>
            <li><code>Esc</code>: Dismiss code completion</li>
            <li><code>Ctrl+Shift+E</code> / <code>Cmd+Shift+E</code>: Explain selected code</li>
          </ul>
        </div>
      </div>
      
      <TipBox type="note">
        <p>
          These shortcuts may vary slightly depending on your operating system and Cursor version. You can view and customize all keyboard shortcuts in Settings &gt; Keyboard Shortcuts.
        </p>
      </TipBox>
      
      <h3 className="text-xl font-bold mt-8 mb-3">Next Steps</h3>
      
      <p className="mb-4">
        Now that you&apos;re familiar with the Cursor interface and its AI features, you&apos;re ready to start building your first website! In the next section, we&apos;ll guide you through creating a new project and building a simple website using Cursor.
      </p>
    </>
  );
  
  return (
    <GuideContent
      title="Cursor Interface Overview"
      description="Get familiar with the Cursor interface and its AI-powered features."
      steps={steps}
      currentStepId={currentStepId}
      content={content}
      prevLink={prevLink}
      nextLink={nextLink}
    />
  );
} 