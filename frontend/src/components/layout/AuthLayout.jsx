import React from 'react';
import { Link } from 'react-router-dom';

const AuthLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-bg-primary text-text-primary flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background glow */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 600px 600px at 50% 40%, rgba(255,59,59,0.06) 0%, transparent 70%)' }}
      />
      
      <div className="relative z-10 w-full flex flex-col items-center max-w-[440px] animate-in fade-in slide-in-from-bottom-2 duration-200">
        <Link to="/" className="flex flex-col items-center gap-2 mb-8 group outline-none focus-visible:ring-2 focus-visible:ring-red rounded-xl p-2">
          <div className="w-[40px] h-[40px] rounded-lg bg-red flex items-center justify-center shadow-lg shadow-red/20 -tracking-[0.02em]">
            <span className="font-display font-extrabold text-white text-[22px] leading-none">P</span>
          </div>
          <span className="font-display font-bold text-[22px] tracking-tight">PTUBE</span>
        </Link>
        
        {children}
        
        <footer className="mt-8">
          <p className="font-mono text-[11px] text-text-disabled">© 2025 PTUBE</p>
        </footer>
      </div>
    </div>
  );
};

export default AuthLayout;
