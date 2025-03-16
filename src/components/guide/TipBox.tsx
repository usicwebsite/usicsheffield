"use client";

interface TipBoxProps {
  type: "tip" | "warning" | "note" | "important";
  title?: string;
  children: React.ReactNode;
}

export default function TipBox({ type, title, children }: TipBoxProps) {
  const styles = {
    tip: {
      bg: "bg-green-50",
      border: "border-green-200",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-500">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="16" x2="12" y2="12"></line>
          <line x1="12" y1="8" x2="12.01" y2="8"></line>
        </svg>
      ),
      title: title || "Tip",
      titleColor: "text-green-800",
    },
    warning: {
      bg: "bg-amber-50",
      border: "border-amber-200",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-amber-500">
          <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
          <line x1="12" y1="9" x2="12" y2="13"></line>
          <line x1="12" y1="17" x2="12.01" y2="17"></line>
        </svg>
      ),
      title: title || "Warning",
      titleColor: "text-amber-800",
    },
    note: {
      bg: "bg-blue-50",
      border: "border-blue-200",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <polyline points="10 9 9 9 8 9"></polyline>
        </svg>
      ),
      title: title || "Note",
      titleColor: "text-blue-800",
    },
    important: {
      bg: "bg-purple-50",
      border: "border-purple-200",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-purple-500">
          <circle cx="12" cy="12" r="10"></circle>
          <line x1="12" y1="8" x2="12" y2="16"></line>
          <line x1="8" y1="12" x2="16" y2="12"></line>
        </svg>
      ),
      title: title || "Important",
      titleColor: "text-purple-800",
    },
  };
  
  const style = styles[type];
  
  return (
    <div className={`${style.bg} border ${style.border} rounded-lg p-4 my-4`}>
      <div className="flex items-start">
        <div className="flex-shrink-0 mr-3">
          {style.icon}
        </div>
        <div>
          <h4 className={`font-medium ${style.titleColor} mb-1`}>{style.title}</h4>
          <div className="text-gray-700 text-sm">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
} 