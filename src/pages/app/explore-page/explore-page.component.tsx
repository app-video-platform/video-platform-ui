import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaRegHeart } from 'react-icons/fa';
import { FaHeart } from 'react-icons/fa';

import { ProductMinimised } from '@api/models';
import { getAllProductsMinimalAPI } from '@api/services';
import { GalIcon, Button } from '@shared/ui';
import { selectAllShopCartProducts, addProductToCart } from '@store/shop-cart';
import { AppDispatch } from '@store/store';
import { selectWishlistIds, toggleWishlist } from '@store/wishlist';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const placeholderImage = require('../../../assets/image-placeholder.png');

import './explore-page.styles.scss';

const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const cartProducts = useSelector(selectAllShopCartProducts);
  const wishlistIds = useSelector(selectWishlistIds);
  const [products, setProducts] = useState<ProductMinimised[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true; // ↪️ prevent state updates after unmount

    // call your service
    getAllProductsMinimalAPI()
      .then((data) => {
        if (isMounted) {
          setProducts(data);
        }
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) {
          setError('Failed to load products.');
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []); // empty deps → runs once on mount

  const handleAddToCart = (prod: ProductMinimised) => {
    dispatch(addProductToCart(prod));
  };

  const handleToggleWishlist = (prod: ProductMinimised) => {
    dispatch(toggleWishlist(prod));
  };

  const isInCart = (productId: string | undefined) =>
    cartProducts?.some((p) => p.id === productId);

  if (loading) {
    return <p>Loading products…</p>;
  }
  if (error) {
    return <p>{error}</p>;
  }
  return (
    <div className="explore-page">
      <main className="explore-page-content">
        <section className="intro">
          <h1>Check this out</h1>
          <p>
            Here we show products. This is where people search for products or
            instructors
          </p>
          <p>
            All types of users have access to this page, even visitors (people
            without an account)
          </p>
          <p>
            All types of registered users (User, Creator, Admin) have a quick
            access link to this page
          </p>
        </section>
        <section className="explore-products">
          <h1>These are our best products</h1>
          <div className="products-list">
            {products?.map((product, idx) => {
              const wished = wishlistIds.has(product.id);

              return (
                <div key={idx} className="product-card">
                  <img
                    src={placeholderImage}
                    alt={product.name}
                    className="product-card-image"
                  />

                  <button
                    type="button"
                    className={`wish-btn ${wished ? 'is-active' : ''}`}
                    aria-pressed={wished}
                    aria-label={
                      wished ? 'Remove from wishlist' : 'Add to wishlist'
                    }
                    onClick={() => handleToggleWishlist(product)}
                    title={wished ? 'Remove from wishlist' : 'Add to wishlist'}
                  >
                    {wished ? (
                      <GalIcon icon={FaHeart} size={22} color="red" />
                    ) : (
                      <GalIcon icon={FaRegHeart} size={22} />
                    )}
                  </button>
                  <div className="product-card-details">
                    <div className="last-updated-line">
                      <span>
                        {product.updatedAt &&
                          new Date(product.updatedAt).toLocaleDateString(
                            'en-GB',
                            {
                              day: 'numeric',
                              month: 'long',
                              year: 'numeric',
                            },
                          )}
                      </span>
                    </div>
                    <h3>{product.name}</h3>
                    <div className="type-and-price-line">
                      <span>{product.type?.toLowerCase()}</span>
                      <span>
                        {product.price !== 'free' && <span>&euro;</span>}
                        {product.price}
                      </span>
                    </div>
                    <button
                      type="button"
                      className="creator-route-btn"
                      onClick={() => navigate(`/store/${product.createdById}`)}
                    >
                      <span className="creator">
                        {product.createdByName}, {product.createdByTitle}
                      </span>
                    </button>
                  </div>
                  <div className="explore-card-actions">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() =>
                        navigate(`/product/${product.id}/${product.type}`)
                      }
                    >
                      View Product
                    </Button>
                    <Button
                      type="button"
                      variant="primary"
                      disabled={isInCart(product.id)}
                      onClick={() => {
                        if (!isInCart(product.id)) {
                          handleAddToCart(product);
                        }
                      }}
                    >
                      {isInCart(product.id) ? 'Already in cart' : 'Add to cart'}
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ExplorePage;
