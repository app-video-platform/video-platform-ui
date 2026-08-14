import React, { ReactNode, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import clsx from 'clsx';
import { HiX } from 'react-icons/hi';

import { Button } from '../button';
import { Icon } from '../icon';
import { getCssVar } from '@shared/utils';

import './drawer.styles.scss';

interface DrawerProps {
  open: boolean;
  title: ReactNode;
  children: ReactNode;
  onClose: () => void;
  footer?: ReactNode;
  className?: string;
  closeLabel?: string;
}

const focusableSelector = [
  'a[href]',
  'button:not([disabled])',
  'input:not([disabled])',
  'select:not([disabled])',
  'textarea:not([disabled])',
  '[tabindex]:not([tabindex="-1"])',
].join(',');

const Drawer: React.FC<DrawerProps> = ({
  open,
  title,
  children,
  onClose,
  footer,
  className,
  closeLabel = 'Close drawer',
}) => {
  const panelRef = useRef<HTMLElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    window.setTimeout(() => {
      const firstFocusable = panelRef.current?.querySelector<HTMLElement>(
        focusableSelector,
      );
      firstFocusable?.focus();
    }, 0);

    return () => {
      document.body.style.overflow = originalOverflow;
      previousFocusRef.current?.focus?.();
    };
  }, [open]);

  useEffect(() => {
    if (!open) {
      return undefined;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
        return;
      }

      if (event.key !== 'Tab' || !panelRef.current) {
        return;
      }

      const focusable = Array.from(
        panelRef.current.querySelectorAll<HTMLElement>(focusableSelector),
      );

      if (focusable.length === 0) {
        event.preventDefault();
        panelRef.current.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [onClose, open]);

  if (!open) {
    return null;
  }

  return createPortal(
    <div className="drawer-layer">
      <button
        type="button"
        className="drawer-overlay"
        aria-label={closeLabel}
        onClick={onClose}
      />
      <section
        ref={panelRef}
        className={clsx('drawer-panel', className)}
        role="dialog"
        aria-modal="true"
        aria-labelledby="drawer-title"
        tabIndex={-1}
      >
        <header className="drawer-header">
          <div id="drawer-title" className="drawer-title">
            {title}
          </div>
          <Button
            type="button"
            variant="tertiary"
            size="icon"
            aria-label={closeLabel}
            onClick={onClose}
          >
            <Icon icon={HiX} size={20} color={getCssVar('--text-primary')} />
          </Button>
        </header>
        <div className="drawer-body">{children}</div>
        {footer && <footer className="drawer-footer">{footer}</footer>}
      </section>
    </div>,
    document.body,
  );
};

export default Drawer;
