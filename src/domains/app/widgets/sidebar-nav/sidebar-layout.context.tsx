import React, { createContext, useContext, useState, ReactNode } from 'react';

interface SidebarLayoutContextValue {
  isSidebarCollapsed: boolean;
  // eslint-disable-next-line no-unused-vars
  setIsSidebarCollapsed: (value: boolean) => void;
  toggleSidebar: () => void;
}

const SidebarLayoutContext = createContext<
  SidebarLayoutContextValue | undefined
>(undefined);

export const SidebarLayoutProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const toggleSidebar = () => setIsSidebarCollapsed((prev) => !prev);

  return (
    <SidebarLayoutContext.Provider
      value={{ isSidebarCollapsed, setIsSidebarCollapsed, toggleSidebar }}
    >
      {children}
    </SidebarLayoutContext.Provider>
  );
};

export const useSidebarLayout = () => {
  const ctx = useContext(SidebarLayoutContext);
  if (!ctx) {
    throw new Error(
      'useSidebarLayout must be used within SidebarLayoutProvider',
    );
  }
  return ctx;
};
