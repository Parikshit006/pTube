import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleTheme } from '../../app/uiSlice';

const ThemeToggle = () => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.ui.theme);
  const isDark = theme === 'dark';

  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className="btn-icon w-8 h-8 relative overflow-hidden text-text-muted hover:text-text-primary hover:bg-bg-tertiary outline-none focus-visible:ring-2 focus-visible:ring-red focus-visible:ring-offset-2"
      aria-label="Toggle Theme"
    >
      <div 
        className={`absolute inset-0 flex items-center justify-center transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${isDark ? 'rotate-0 scale-100' : '-rotate-180 scale-50 opacity-0'}`}
      >
        <Sun className="w-4 h-4" />
      </div>
      <div 
        className={`absolute inset-0 flex items-center justify-center transition-transform duration-200 ease-[cubic-bezier(0.34,1.56,0.64,1)] ${!isDark ? 'rotate-0 scale-100' : 'rotate-180 scale-50 opacity-0'}`}
      >
        <Moon className="w-4 h-4" />
      </div>
    </button>
  );
};

export default ThemeToggle;
