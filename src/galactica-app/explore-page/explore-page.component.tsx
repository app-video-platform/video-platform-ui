import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { FaRegHeart } from 'react-icons/fa';
import { FaHeart } from 'react-icons/fa';

import { ProductMinimised } from '../../api/models/product/product';
import { getAllProductsMinimalAPI } from '../../api/services/products/products-api';
import GalButton from '../../components/gal-button/gal-button.component';
import GalIcon from '../../components/gal-icon-component/gal-icon.component';
import { selectAllShopCartProducts } from '../../store/shop-cart/shop-cart.selectors';
import { addProductToCart } from '../../store/shop-cart/shop-cart.slice';
import { AppDispatch } from '../../store/store';
import { selectWishlistIds } from '../../store/wishlist/wishlist.selectors';
import { toggleWishlist } from '../../store/wishlist/wishlist.slice';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const placeholderImage = require('../../assets/image-placeholder.png');

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
                    alt={product.title}
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
                    <h3>{product.title}</h3>
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
                    <GalButton
                      text="View Product"
                      type="secondary"
                      onClick={() =>
                        navigate(`/product/${product.id}/${product.type}`)
                      }
                    />
                    <GalButton
                      text={
                        isInCart(product.id) ? 'Already in cart' : 'Add to cart'
                      }
                      type="primary"
                      disabled={isInCart(product.id)}
                      onClick={() => {
                        if (!isInCart(product.id)) {
                          handleAddToCart(product);
                        }
                      }}
                    />
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
