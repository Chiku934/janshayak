import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';
import { cn } from '../../utils/cn';
import { motion, AnimatePresence } from 'framer-motion';
import { backdropVariants } from '../../design-system/tokens/motion';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  description?: React.ReactNode;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  position?: 'right' | 'left' | 'bottom';
}

export const Drawer: React.FC<DrawerProps> = ({
  isOpen,
  onClose,
  title,
  description,
  children,
  size = 'md',
  position = 'right',
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const sizeClasses = {
    sm: 'max-w-xs',
    md: 'max-w-md',
    lg: 'max-w-xl',
    xl: 'max-w-2xl',
  };

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className={cn(
            'fixed inset-0 z-50 flex overflow-hidden',
            position === 'bottom' ? 'items-end' : position === 'left' ? 'justify-start' : 'justify-end'
          )}
        >
          {/* Backdrop */}
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
          />

          {/* Slide-over / Bottom sheet panel */}
          <motion.div
            initial={
              position === 'bottom'
                ? { y: '100%' }
                : position === 'left'
                ? { x: '-100%' }
                : { x: '100%' }
            }
            animate={position === 'bottom' ? { y: 0 } : { x: 0 }}
            exit={
              position === 'bottom'
                ? { y: '100%' }
                : position === 'left'
                ? { x: '-100%' }
                : { x: '100%' }
            }
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className={cn(
              'relative w-full bg-white shadow-2xl z-10 flex flex-col',
              position === 'bottom'
                ? 'max-h-[85vh] rounded-t-3xl border-t border-slate-200'
                : 'h-full border-l border-slate-200',
              position !== 'bottom' && sizeClasses[size]
            )}
          >
            {/* Grab handle for bottom sheet */}
            {position === 'bottom' && (
              <div className="w-12 h-1 bg-slate-300 rounded-full mx-auto my-2 shrink-0" />
            )}

            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between shrink-0 bg-slate-50/70">
              <div>
                {title && <h3 className="text-base font-bold text-slate-900">{title}</h3>}
                {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
              </div>
              <button
                onClick={onClose}
                aria-label="Close drawer"
                className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1">{children}</div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body
  );
};
