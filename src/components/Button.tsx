import { ButtonHTMLAttributes, ReactNode, AnchorHTMLAttributes } from 'react';
import Link from 'next/link';

/**
 * Props for the Button component
 * @param variant - The visual style of the button (primary, secondary, outline)
 * @param size - The size of the button (sm, md, lg)
 * @param href - Optional URL to navigate to when clicked (turns button into a link)
 * @param children - The content to display inside the button
 * @param className - Additional CSS classes to apply
 * @param target - Optional target attribute for links (e.g., '_blank')
 * @param rel - Optional rel attribute for links (e.g., 'noopener noreferrer')
 * @param ...props - Any other button HTML attributes
 */
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'white';
  size?: 'sm' | 'md' | 'lg';
  href?: string;
  children: ReactNode;
  className?: string;
  target?: string;
  rel?: string;
}

/**
 * Reusable Button component with different variants and sizes
 * Can be rendered as a button or a link based on the presence of the href prop
 */
export default function Button({
  variant = 'primary',
  size = 'md',
  href,
  children,
  className = '',
  target,
  rel,
  ...props
}: ButtonProps) {
  // Base classes for all button variants
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2';
  
  // Classes based on variant
  const variantClasses = {
    primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500',
    secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600',
    outline: 'bg-transparent border border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-500 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800',
    white: 'bg-white text-blue-600 hover:bg-gray-100 focus:ring-blue-500 border border-transparent',
  };
  
  // Classes based on size
  const sizeClasses = {
    sm: 'text-sm px-3 py-1.5',
    md: 'text-base px-4 py-2',
    lg: 'text-lg px-6 py-3',
  };
  
  // Combine all classes
  const buttonClasses = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`;
  
  // Render as a link if href is provided, otherwise as a button
  if (href) {
    return (
      <Link href={href} className={buttonClasses} target={target} rel={rel}>
        {children}
      </Link>
    );
  }
  
  return (
    <button className={buttonClasses} {...props}>
      {children}
    </button>
  );
} 