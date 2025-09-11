interface ScrollArrowProps {
  onClick: () => void;
}

export default function ScrollArrow({ onClick }: ScrollArrowProps) {
  return (
    <button 
      onClick={onClick}
      className="absolute bottom-8 left-2/5 transform -translate-x-1/2 text-white cursor-pointer animate-bounce"
      aria-label="Scroll down"
    >
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-8 w-8"
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M19 14l-7 7m0 0l-7-7m7 7V3"
        />
      </svg>
    </button>
  );
}
