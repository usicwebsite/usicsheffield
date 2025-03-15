import { ReactNode } from 'react';

/**
 * Props for the Card component
 * @param title - Optional title for the card
 * @param children - The content to display inside the card
 * @param className - Additional CSS classes to apply
 */
interface CardProps {
  title?: string;
  children: ReactNode;
  className?: string;
}

/**
 * Reusable Card component for displaying content in a box with consistent styling
 */
export default function Card({ title, children, className = '' }: CardProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden ${className}`}>
      {title && (
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{title}</h3>
        </div>
      )}
      <div className="p-6">{children}</div>
    </div>
  );
} 