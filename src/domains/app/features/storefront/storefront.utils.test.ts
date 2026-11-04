import { getStorefrontViewModel, orderStorefrontProducts, DEFAULT_STOREFRONT_THEME } from './storefront.utils';
import { StorefrontProduct } from './storefront.types';

const product = (id: string, createdAt: string, status: 'PUBLISHED' | 'HIDDEN' = 'PUBLISHED'): StorefrontProduct => ({
  id, title: id, type: 'COURSE', status, createdAt: new Date(createdAt),
});

describe('Storefront ordering', () => {
  const old = product('00000000-0000-0000-0000-000000000001', '2026-01-01');
  const newer = product('00000000-0000-0000-0000-000000000002', '2026-02-01');
  const tied = product('80000000-0000-0000-0000-000000000003', '2026-02-01');

  it('orders unconfigured products by newest creation and Java UUID tie-break', () => {
    expect(orderStorefrontProducts([old, newer, tied], []).map((p) => p.id)).toEqual([
      tied.id, newer.id, old.id,
    ]);
  });

  it('preserves explicit order and chooses the first eligible fallback', () => {
    const hidden = { ...tied, status: 'HIDDEN' as const };
    const ordered = orderStorefrontProducts([old, newer, hidden], [old.id]);
    const view = getStorefrontViewModel({
      profile: { displayName: 'Creator' }, products: ordered,
      featuredProductId: hidden.id, theme: DEFAULT_STOREFRONT_THEME,
    });
    expect(view.products.map((p) => p.id)).toEqual([old.id, newer.id]);
    expect(view.featuredProductId).toBe(old.id);
  });

  it('retains input order when creation metadata is missing', () => {
    const unknown = { ...old, createdAt: undefined };
    expect(orderStorefrontProducts([unknown, newer], []).map((p) => p.id)).toEqual([
      unknown.id, newer.id,
    ]);
  });
});
