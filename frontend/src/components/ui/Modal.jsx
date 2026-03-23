import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

const Modal = ({ isOpen, onClose, title, children }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center">
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm" 
        onClick={onClose}
        aria-hidden="true"
      />
      <div 
        className="relative w-full max-w-lg bg-bg-elevated rounded-[14px] shadow-2xl overflow-hidden m-4 animate-in fade-in zoom-in-95 duration-200"
        role="dialog"
        aria-modal="true"
      >
        <div className="flex items-center justify-between p-4 border-b border-border-default">
          <h2 className="text-lg font-display font-bold text-text-primary">{title}</h2>
          <button
            onClick={onClose}
            className="p-2 -mr-2 rounded-full text-text-muted hover:text-red hover:bg-bg-overlay transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-red"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-4 overflow-y-auto max-h-[calc(100vh-120px)]">
          {children}
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;
