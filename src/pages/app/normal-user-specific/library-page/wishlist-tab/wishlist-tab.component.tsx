import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { ProductMinimised, AppDispatch } from '@api/models';
import { Button } from '@shared/ui';
import { selectCartIds } from '@store/shop-cart';
import {
  selectWishlistProducts,
  removeFromWishlist,
  moveWishlistItemToCart,
} from '@store/wishlist';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const placeholderImage = require('../../../../../assets/image-placeholder.png');

import './wishlist-tab.styles.scss';

const WishlistTab: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const wishlistProducts = useSelector(selectWishlistProducts);
  const cartIds = useSelector(selectCartIds);

  const handleRemoveFromWishlist = (prod: ProductMinimised) => {
    if (prod && prod.id) {
      dispatch(removeFromWishlist(prod.id));
    }
  };

  const handleMoveToCart = (prod: ProductMinimised) => {
    if (prod && prod.id) {
      dispatch(moveWishlistItemToCart(prod.id));
    }
  };

  return (
    <div className="wishlist-tab">
      {wishlistProducts && wishlistProducts.length > 0 ? (
        wishlistProducts.map((prod) => {
          const inCart = cartIds.has(prod.id);

          return (
            <div key={prod.id} className="wishlist-product-card">
              <img
                src={placeholderImage}
                alt={prod.name}
                className="product-card-image"
                height={'150'}
              />
              <div className="wishlist-product-details">
                <h3>{prod.name}</h3>
                <p>
                  By {prod.createdByName} <span>{prod.createdByTitle}</span>
                </p>
                <p className="wishlist-product-rating">
                  4.7 ⭐⭐⭐⭐⭐ (32,025 ratings)
                </p>
                <p className="wishlist-product-price">{prod.price}</p>
              </div>
              <div className="wishlist-product-actions">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => handleRemoveFromWishlist(prod)}
                >
                  Remove from wishlist
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  disabled={inCart}
                  onClick={() => handleMoveToCart(prod)}
                >
                  {inCart ? 'Already in cart' : 'Move to cart'}
                </Button>
              </div>
            </div>
          );
        })
      ) : (
        <p>You don&apos;t have any products in your wishlist</p>
      )}
    </div>
  );
};

export default WishlistTab;
