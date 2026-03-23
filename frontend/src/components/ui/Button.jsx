import React from 'react';
import { Loader2 } from 'lucide-react';

const Button = React.forwardRef(({ variant = 'primary', size = 'md', isLoading = false, className = '', children, ...props }, ref) => {
  const baseStyles = 'inline-flex items-center justify-center font-body rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variants = {
    primary: 'bg-red text-white hover:bg-opacity-90',
    ghost: 'text-text-primary hover:bg-bg-elevated',
    danger: 'bg-red bg-opacity-10 text-red border border-red border-opacity-20 hover:bg-opacity-20',
    icon: 'rounded-full hover:bg-bg-elevated',
  };

  const sizes = {
    sm: 'text-xs h-8 px-3',
    md: 'text-sm h-10 px-4',
    lg: 'text-base h-12 px-6',
    icon: 'w-10 h-10', // override px for icon
  };

  const styleClass = `${baseStyles} ${variants[variant]} ${variant === 'icon' ? sizes.icon : sizes[size]} ${className}`;

  return (
    <button ref={ref} className={styleClass} disabled={isLoading || props.disabled} {...props}>
      {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
      {children}
    </button>
  );
});

Button.displayName = 'Button';
export default Button;
