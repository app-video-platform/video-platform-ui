export const appRoutes = {
  root: '/app',
  explore: '/app/explore',
  exploreSearch: '/app/explore/search',
  product: (id = ':id', type?: string) =>
    `/app/product/${id}${type ? `/${type}` : ''}`,
  store: (creatorId = ':creatorId') => `/app/store/${creatorId}`,

  products: '/app/products',
  productsCreate: '/app/products/create',
  productsEdit: (id = ':id') => `/app/products/edit/${id}`,
  customers: '/app/customers',
  customerDetail: (id = ':customerId') => `/app/customers/${id}`,

  sales: '/app/sales',
  marketing: '/app/marketing',
  analytics: '/app/analytics',
  library: '/app/library',
  settings: '/app/settings',
  cart: '/app/cart',

  onboarding: '/onboarding',
} as const;
