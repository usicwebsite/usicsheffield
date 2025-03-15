import { ReactNode } from 'react';

/**
 * Props for the FeatureCard component
 * @param icon - The icon to display
 * @param title - The title of the feature
 * @param description - The description of the feature
 * @param className - Additional CSS classes to apply
 */
interface FeatureCardProps {
  icon: ReactNode;
  title: string;
  description: string;
  className?: string;
}

/**
 * FeatureCard component for displaying features on the homepage
 */
export default function FeatureCard({ 
  icon, 
  title, 
  description, 
  className = '' 
}: FeatureCardProps) {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg p-6 shadow-md hover:shadow-lg transition-shadow ${className}`}>
      <div className="flex flex-col items-center text-center">
        {/* Icon */}
        <div className="mb-4 text-blue-600 dark:text-blue-400">
          {icon}
        </div>
        
        {/* Title */}
        <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
          {title}
        </h3>
        
        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400">
          {description}
        </p>
      </div>
    </div>
  );
} 