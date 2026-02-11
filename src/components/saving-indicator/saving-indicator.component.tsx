import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import clsx from 'clsx';

import './saving-indicator.styles.scss';

export type SavingStatus = 'idle' | 'saving' | 'saved' | 'error';

interface SavingIndicatorProps {
  status: SavingStatus;
  /** Optional small variant for tight spaces */
  size?: 'sm' | 'md';
}

const SavingIndicator: React.FC<SavingIndicatorProps> = ({
  status,
  size = 'md',
}) => {
  const isActive =
    status === 'saving' || status === 'saved' || status === 'error';

  if (!isActive) {
    return null;
  } // hide completely when idle, if you want

  const label =
    status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved' : 'Error';

  return (
    <motion.div
      className={clsx('saving-indicator', `saving-indicator--${size}`, {
        'saving-indicator--saving': status === 'saving',
        'saving-indicator--saved': status === 'saved',
        'saving-indicator--error': status === 'error',
      })}
      layout
      transition={{ type: 'spring', stiffness: 350, damping: 30 }}
    >
      <div className="saving-indicator__icon">
        <AnimatePresence mode="wait">
          {status === 'saving' && (
            <motion.div
              key="spinner"
              className="saving-indicator__spinner"
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.18 }}
            />
          )}

          {status === 'saved' && (
            <motion.svg
              key="check"
              className="saving-indicator__check"
              viewBox="0 0 20 20"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
            >
              <circle
                cx="10"
                cy="10"
                r="9"
                className="saving-indicator__check-circle"
              />
              <path
                d="M6 10.5L8.5 13 14 7.5"
                className="saving-indicator__check-path"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </motion.svg>
          )}

          {status === 'error' && (
            <motion.div
              key="error"
              className="saving-indicator__error-dot"
              initial={{ opacity: 0, scale: 0.6 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.6 }}
              transition={{ duration: 0.2 }}
            />
          )}
        </AnimatePresence>
      </div>

      <motion.span
        className="saving-indicator__label"
        key={label}
        initial={{ opacity: 0, x: 6 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -6 }}
        transition={{ duration: 0.18 }}
      >
        {label}
      </motion.span>
    </motion.div>
  );
};

export default SavingIndicator;
