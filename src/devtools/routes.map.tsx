import type { IndexRouteObject, NonIndexRouteObject } from 'react-router-dom';
import { UserRole } from '@api/models';

// Optionally add a small meta type for docs:
type Meta = {
  access: 'public' | 'protected';
  roles?: UserRole[];
  notes?: string;
};

export type DocIndexRouteObject = Omit<IndexRouteObject, 'children'> & {
  meta?: Meta;
};

export type DocNonIndexRouteObject = Omit<NonIndexRouteObject, 'children'> & {
  meta?: Meta;
  children?: DocRoute[];
};

export type DocRoute = DocIndexRouteObject | DocNonIndexRouteObject;
// This is a DOCS-ONLY mirror of your App.tsx structure.
// Keep it roughly in sync when you add/change routes.
export const docRoutes: DocRoute[] = [
  {
    path: '/',
    // Navigation layout (not rendered here; for docs only)
    children: [
      { index: true, meta: { access: 'public' }, id: 'home' },
      { path: 'about', meta: { access: 'public' }, id: 'about' },
      { path: 'contact', meta: { access: 'public' }, id: 'contact' },
      { path: 'pricing', meta: { access: 'public' }, id: 'pricing' },
    ],
  },
  { path: 'signup', meta: { access: 'public' }, id: 'signup' },
  { path: 'login', meta: { access: 'public' }, id: 'login' },
  { path: 'verify-email', meta: { access: 'public' }, id: 'verify-email' },
  { path: 'email-sent', meta: { access: 'public' }, id: 'email-sent' },
  { path: 'unauthorized', meta: { access: 'public' }, id: 'unauthorized' },
  {
    path: 'forgot-password',
    meta: { access: 'public' },
    id: 'forgot-password',
  },
  { path: 'dev-dashboard', meta: { access: 'public' }, id: 'dev-dashboard' },

  // Onboarding (protected: Admin/Creator/User)
  {
    path: 'onboarding',
    meta: {
      access: 'protected',
      roles: [UserRole.ADMIN, UserRole.CREATOR, UserRole.USER],
    },
    id: 'onboarding',
  },

  // /app shell (AppLayout)
  {
    path: 'app',
    id: 'app',
    children: [
      // Public pages inside /app
      { path: 'explore', meta: { access: 'public' }, id: 'app-explore' },
      {
        path: 'explore/search',
        meta: { access: 'public' },
        id: 'app-explore-search',
      },
      {
        path: 'product/:id/:type',
        meta: { access: 'public' },
        id: 'app-product',
      },
      { path: 'store/:creatorId', meta: { access: 'public' }, id: 'app-store' },

      // Protected wrapper (Admin/Creator/User) — index is role-based
      {
        index: true,
        meta: {
          access: 'protected',
          roles: [UserRole.ADMIN, UserRole.CREATOR, UserRole.USER],
          notes:
            'Role-based landing: Creator→CreatorDashboard, Admin→AdminPage, else GalacticaHome',
        },
        id: 'app-index',
      },

      // Creator/Admin only
      {
        path: 'products',
        meta: {
          access: 'protected',
          roles: [UserRole.CREATOR, UserRole.ADMIN],
        },
        id: 'app-products',
        children: [
          {
            index: true,
            meta: {
              access: 'protected',
              roles: [UserRole.CREATOR, UserRole.ADMIN],
            },
            id: 'app-products-index',
          },
          {
            path: 'create',
            meta: {
              access: 'protected',
              roles: [UserRole.CREATOR, UserRole.ADMIN],
            },
            id: 'app-products-create',
          },
          {
            path: 'edit/:type/:id',
            meta: {
              access: 'protected',
              roles: [UserRole.CREATOR, UserRole.ADMIN],
            },
            id: 'app-products-edit',
          },
        ],
      },
      {
        path: 'sales',
        meta: {
          access: 'protected',
          roles: [UserRole.CREATOR, UserRole.ADMIN],
        },
        id: 'app-sales',
      },
      {
        path: 'marketing',
        meta: {
          access: 'protected',
          roles: [UserRole.CREATOR, UserRole.ADMIN],
        },
        id: 'app-marketing',
      },

      // User/Admin only
      {
        path: 'library',
        meta: { access: 'protected', roles: [UserRole.USER, UserRole.ADMIN] },
        id: 'app-library',
        children: [
          {
            path: 'all-products',
            meta: {
              access: 'protected',
              roles: [UserRole.USER, UserRole.ADMIN],
            },
            id: 'app-library-all-products',
          },
          {
            path: 'my-courses',
            meta: {
              access: 'protected',
              roles: [UserRole.USER, UserRole.ADMIN],
            },
            id: 'app-library-my-courses',
          },
          {
            path: 'my-download-packages',
            meta: {
              access: 'protected',
              roles: [UserRole.USER, UserRole.ADMIN],
            },
            id: 'app-library-my-downloads',
          },
          {
            path: 'my-consultation',
            meta: {
              access: 'protected',
              roles: [UserRole.USER, UserRole.ADMIN],
            },
            id: 'app-library-my-consultation',
          },
          {
            path: 'my-wishlist',
            meta: {
              access: 'protected',
              roles: [UserRole.USER, UserRole.ADMIN],
            },
            id: 'app-library-my-wishlist',
          },
        ],
      },

      // General protected
      {
        path: 'settings',
        meta: {
          access: 'protected',
          roles: [UserRole.ADMIN, UserRole.CREATOR, UserRole.USER],
        },
        id: 'app-settings',
      },
      {
        path: 'my-page-preview',
        meta: {
          access: 'protected',
          roles: [UserRole.ADMIN, UserRole.CREATOR, UserRole.USER],
        },
        id: 'app-my-page-preview',
      },
      {
        path: 'cart',
        meta: {
          access: 'protected',
          roles: [UserRole.ADMIN, UserRole.CREATOR, UserRole.USER],
        },
        id: 'app-cart',
      },

      // Fallback inside /app
      {
        path: '*',
        meta: { access: 'protected', notes: 'Redirects to /app' },
        id: 'app-fallback',
      },
    ],
  },

  // Top-level catch-all
  {
    path: '*',
    meta: { access: 'public', notes: 'NotFoundPage' },
    id: 'not-found',
  },
];
