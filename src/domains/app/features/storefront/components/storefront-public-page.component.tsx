import React from 'react';
import { Link } from 'react-router-dom';
import { FiExternalLink } from 'react-icons/fi';
import clsx from 'clsx';

import { Button, GalIcon } from '@shared/ui';

import { StorefrontViewModel } from '../storefront.types';
import {
  formatStorefrontPrice,
  storefrontProductTypeLabels,
} from '../storefront.utils';

import './storefront-public-page.styles.scss';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const placeholderImage = require('../../../../../assets/image-placeholder.png');

interface StorefrontPublicPageProps {
  storefront: StorefrontViewModel;
  preview?: boolean;
}

const StorefrontPublicPage: React.FC<StorefrontPublicPageProps> = ({
  storefront,
  preview = false,
}) => {
  const { profile, products, featuredProductId } = storefront;
  const featuredProduct = products.find(
    (product) => product.id === featuredProductId,
  );
  const hasProducts = products.length > 0;
  const profileInitials = profile.displayName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <article
      className={clsx('storefront-public', {
        'storefront-public--preview': preview,
      })}
    >
      <header className="storefront-public__nav">
        <a href="#storefront-products" className="storefront-public__brand">
          {profile.imageUrl ? (
            <img src={profile.imageUrl} alt="" />
          ) : (
            <span aria-hidden="true">{profileInitials || 'VP'}</span>
          )}
          <strong>{profile.displayName}</strong>
        </a>
        <nav aria-label="Storefront sections">
          <a href="#storefront-products">Products</a>
          {profile.website && (
            <a href={profile.website} target="_blank" rel="noreferrer">
              Website
            </a>
          )}
        </nav>
      </header>

      <section className="storefront-public__hero">
        <div className="storefront-public__hero-copy">
          <span className="storefront-public__eyebrow">Creator Storefront</span>
          <h1>{profile.displayName}</h1>
          <p className="storefront-public__tagline">
            {profile.tagline || profile.title || 'Digital products from this creator.'}
          </p>
          {profile.bio && <p className="storefront-public__bio">{profile.bio}</p>}
          <div className="storefront-public__hero-actions">
            <a className="storefront-public__cta" href="#storefront-products">
              Browse products
            </a>
            {profile.website && (
              <a
                className="storefront-public__secondary-link"
                href={profile.website}
                target="_blank"
                rel="noreferrer"
              >
                Creator website <GalIcon icon={FiExternalLink} color="currentColor" size={15} />
              </a>
            )}
          </div>
        </div>
        <div className="storefront-public__portrait" aria-hidden="true">
          {profile.imageUrl ? (
            <img src={profile.imageUrl} alt="" />
          ) : (
            <span>{profileInitials || 'VP'}</span>
          )}
        </div>
      </section>

      {featuredProduct && (
        <section className="storefront-public__featured" aria-labelledby="featured-product-heading">
          <div className="storefront-public__featured-image">
            <img
              src={featuredProduct.imageUrl || placeholderImage}
              alt=""
            />
          </div>
          <div>
            <span className="storefront-public__eyebrow">Featured product</span>
            <h2 id="featured-product-heading">{featuredProduct.title}</h2>
            <p>{featuredProduct.description || 'A featured offer from this creator.'}</p>
            <div className="storefront-public__product-meta">
              <span>{storefrontProductTypeLabels[featuredProduct.type]}</span>
              <strong>{formatStorefrontPrice(featuredProduct.price)}</strong>
            </div>
            <Link
              className="storefront-public__product-link"
              to={`/app/product/${featuredProduct.id}`}
            >
              View product
            </Link>
          </div>
        </section>
      )}

      <section
        id="storefront-products"
        className="storefront-public__products"
        aria-labelledby="storefront-products-heading"
      >
        <div className="storefront-public__section-heading">
          <span className="storefront-public__eyebrow">Products</span>
          <h2 id="storefront-products-heading">Browse current offers</h2>
          <p>
            {hasProducts
              ? 'Published products available from this creator.'
              : 'This creator does not have published products available yet.'}
          </p>
        </div>

        {hasProducts ? (
          <div className="storefront-public__product-grid">
            {products.map((product) => (
              <article className="storefront-public__product-card" key={product.id}>
                <img src={product.imageUrl || placeholderImage} alt="" />
                <div>
                  <span>{storefrontProductTypeLabels[product.type]}</span>
                  <h3>{product.title}</h3>
                  <p>{product.description || 'Product details are available on the product page.'}</p>
                </div>
                <div className="storefront-public__product-footer">
                  <strong>{formatStorefrontPrice(product.price)}</strong>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      window.location.assign(`/app/product/${product.id}`);
                    }}
                  >
                    View product
                  </Button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="storefront-public__empty" role="status">
            <h3>No products are public right now</h3>
            <p>Draft and hidden products are not shown on public Storefronts.</p>
          </div>
        )}
      </section>
    </article>
  );
};

export default StorefrontPublicPage;
