declare global {
  interface Window {
    google?: typeof google;
  }
}

declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.svg';

declare module '*.md' {
  const content: string;
  export default content;
}

declare module '*.mdx' {
  import { ComponentType } from 'react';
  const MDXComponent: ComponentType<Record<string, unknown>>;
  export default MDXComponent;
}

export {};
