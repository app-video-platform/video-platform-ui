export const appRoutes = {
  root: '/app',
  explore: '/app/explore',
  exploreSearch: '/app/explore/search',
  product: (id = ':id') => `/app/product/${id}`,
  store: (creatorId = ':creatorId') => `/app/store/${creatorId}`,

  products: '/app/products',
  productsCreate: '/app/products/create',
  productsEdit: (id = ':id') => `/app/products/edit/${id}`,

  sales: '/app/sales',
  marketing: '/app/marketing',
  library: '/app/library',
  settings: '/app/settings',
  cart: '/app/cart',

  onboarding: '/onboarding',
} as const;
