import React, { ReactNode, useId, useLayoutEffect, useRef } from 'react';
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

interface DrawerEntry {
  panel: HTMLElement;
  layer: HTMLElement;
  restoreFocus: HTMLElement | null;
}

const drawerStack: DrawerEntry[] = [];
let originalOverflow = '';
let nextLayer = 1000;

const refreshLayers = () => {
  drawerStack.forEach((entry, index) => {
    const inactive = index !== drawerStack.length - 1;
    if (inactive) {
      entry.layer.setAttribute('aria-hidden', 'true');
      entry.layer.setAttribute('inert', '');
    } else {
      entry.layer.removeAttribute('aria-hidden');
      entry.layer.removeAttribute('inert');
    }
  });
};

const focusPanel = (entry: DrawerEntry) => {
  const first = entry.panel.querySelector<HTMLElement>(focusableSelector);
  (first ?? entry.panel).focus();
};

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
  const layerRef = useRef<HTMLDivElement>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;
  const titleId = useId();

  useLayoutEffect(() => {
    if (!open || !panelRef.current || !layerRef.current) {
      return undefined;
    }
    const entry: DrawerEntry = {
      panel: panelRef.current,
      layer: layerRef.current,
      restoreFocus: document.activeElement instanceof HTMLElement ? document.activeElement : null,
    };
    if (drawerStack.length === 0) {
      originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
    }
    entry.layer.style.zIndex = String(++nextLayer);
    drawerStack.push(entry);
    refreshLayers();
    const isTop = () => drawerStack[drawerStack.length - 1] === entry;
    const timer = window.setTimeout(() => {
      if (isTop()) {
        focusPanel(entry);
      }
    }, 0);

    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isTop()) {
        return;
      }
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopImmediatePropagation();
        closeRef.current();
        return;
      }

      if (event.key !== 'Tab') {
        return;
      }

      const focusable = Array.from(
        entry.panel.querySelectorAll<HTMLElement>(focusableSelector),
      );

      if (focusable.length === 0) {
        event.preventDefault();
        entry.panel.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (!entry.panel.contains(document.activeElement)) {
        event.preventDefault();
        (event.shiftKey ? last : first).focus();
      } else if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    const handleFocusIn = (event: FocusEvent) => {
      if (isTop() && event.target instanceof Node && !entry.panel.contains(event.target)) {
        focusPanel(entry);
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('focusin', handleFocusIn);
    return () => {
      window.clearTimeout(timer);
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('focusin', handleFocusIn);
      const index = drawerStack.indexOf(entry);
      const wasTop = isTop();
      if (index < 0) {
        return;
      }
      drawerStack.slice(index + 1).forEach((child) => {
        if (child.restoreFocus && entry.panel.contains(child.restoreFocus)) {
          child.restoreFocus = entry.restoreFocus;
        }
      });
      drawerStack.splice(index, 1);
      refreshLayers();
      const active = drawerStack[drawerStack.length - 1];
      if (!active) {
        document.body.style.overflow = originalOverflow;
        nextLayer = 1000;
      }
      if (wasTop) {
        const target = entry.restoreFocus;
        if (target?.isConnected && (!active || active.panel.contains(target))) {
          target.focus();
        } else if (active) {
          focusPanel(active);
        }
      }
    };
  }, [open]);

  if (!open) {
    return null;
  }

  return createPortal(
    <div ref={layerRef} className="drawer-layer">
      <button
        type="button"
        className="drawer-overlay"
        aria-label={closeLabel}
        tabIndex={-1}
        onClick={onClose}
      />
      <section
        ref={panelRef}
        className={clsx('drawer-panel', className)}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
      >
        <header className="drawer-header">
          <div id={titleId} className="drawer-title">
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
