"use client";

import { useState } from "react";

interface CodeBlockProps {
  code: string;
  language: string;
  title?: string;
  showLineNumbers?: boolean;
}

export default function CodeBlock({
  code,
  language,
  title,
  showLineNumbers = true,
}: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false);
  
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch (error) {
      console.error("Failed to copy code:", error);
    }
  };
  
  // Split code into lines for line numbers
  const codeLines = code.split("\n");
  
  return (
    <div className="rounded-lg overflow-hidden bg-gray-900 my-4">
      {/* Header with title and copy button */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-800 text-gray-200">
        <div className="text-sm font-mono">
          {title || language}
        </div>
        <button
          onClick={handleCopy}
          className="text-xs px-2 py-1 rounded bg-gray-700 hover:bg-gray-600 transition-colors"
        >
          {isCopied ? "Copied!" : "Copy"}
        </button>
      </div>
      
      {/* Code content */}
      <div className="p-4 overflow-x-auto">
        <pre className="text-gray-300 font-mono text-sm">
          {showLineNumbers ? (
            <table className="border-collapse">
              <tbody>
                {codeLines.map((line, index) => (
                  <tr key={index} className="leading-relaxed">
                    <td className="text-right pr-4 select-none text-gray-500 border-r border-gray-700">
                      {index + 1}
                    </td>
                    <td className="pl-4 whitespace-pre">
                      {line || " "}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <code>{code}</code>
          )}
        </pre>
      </div>
    </div>
  );
} 