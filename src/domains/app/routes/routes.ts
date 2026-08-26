export const appRoutes = {
  root: '/app',
  explore: '/app/explore',
  exploreSearch: '/app/explore/search',
  product: (id = ':id', type?: string) =>
    `/app/product/${id}${type ? `/${type}` : ''}`,
  store: (creatorId = ':creatorId') => `/app/store/${creatorId}`,

  products: '/app/products',
  productsOverview: (productId = ':productId') => `/app/products/${productId}`,
  productsLandingPage: (productId = ':productId') =>
    `/app/products/${productId}/landing-page`,
  productsPreview: (productId = ':productId') =>
    `/app/products/${productId}/preview`,
  productsCreate: '/app/products/create',
  productsEdit: (id = ':id') => `/app/products/edit/${id}`,
  customers: '/app/customers',
  customerDetail: (id = ':customerId') => `/app/customers/${id}`,

  sales: '/app/sales',
  analytics: '/app/analytics',
  storefront: '/app/storefront',
  legacyStorefrontPreview: '/app/my-page-preview',
  library: '/app/library',
  settings: '/app/settings',
  cart: '/app/cart',

  onboarding: '/onboarding',
} as const;
