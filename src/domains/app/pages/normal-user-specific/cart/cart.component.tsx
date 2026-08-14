import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import { ProductMinimised, AppDispatch } from 'core/api/models';
import { Button } from '@shared/ui';
import {
  selectAllShopCartProducts,
  selectShopCartTotal,
  removeProductFromCart,
  moveCartItemToWishlist,
  clearShoppingCart,
} from 'core/store/shop-cart';
import { selectWishlistIds } from 'core/store/wishlist';
import { enrollInFreeProductAPI } from 'core/api/services';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const placeholderImage = require('../../../../../assets/image-placeholder.png');

import './cart.styles.scss';

const Cart: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const cartProducts = useSelector(selectAllShopCartProducts);
  const cartTotal = useSelector(selectShopCartTotal);
  const wishlistIds = useSelector(selectWishlistIds);
  const [checkingOut, setCheckingOut] = useState(false);
  const containsPaidProducts = cartProducts.some(
    (product) =>
      product.price !== 'free' && Number(product.price ?? 0) > 0,
  );

  const handleRemoveFromCart = (prod: ProductMinimised) => {
    if (prod && prod.id) {
      dispatch(removeProductFromCart(prod.id));
    }
  };

  const handleMoveToWishlist = (prod: ProductMinimised) => {
    if (prod && prod.id) {
      dispatch(moveCartItemToWishlist(prod.id));
    }
  };

  const handleFreeCheckout = async () => {
    const productIds = cartProducts
      .map((product) => product.id)
      .filter((id): id is string => Boolean(id));
    if (productIds.length === 0 || containsPaidProducts) {
      return;
    }

    setCheckingOut(true);
    try {
      await Promise.all(productIds.map(enrollInFreeProductAPI));
      dispatch(clearShoppingCart());
      toast.success('Products added to your library');
      navigate('/app/library/all-products');
    } catch {
      toast.error('The free products could not be added to your library.');
    } finally {
      setCheckingOut(false);
    }
  };

  return (
    <div className="cart-page">
      <h1 className="cart-page-title">Shopping Cart</h1>
      {cartProducts.length > 0 ? (
        <>
          <section className="cart-container">
            <div className="cart-container-line">
              <p>{cartProducts.length} products in your cart</p>
              <hr className="cart-underline"></hr>
            </div>
            <article className="cart-products-container">
              <div className="cart-products-list">
                {cartProducts.map((prod) => {
                  const isInWishlist = wishlistIds.has(prod.id);
                  const productTitle = prod.title ?? 'Untitled product';

                  return (
                    <div key={prod.id} className="cart-product">
                      <img
                        src={placeholderImage}
                        alt={productTitle}
                        className="product-card-image"
                      />
                      <div className="cart-product-details">
                        <h3>{productTitle}</h3>
                        <p>By {prod.createdByName}</p>
                        <p>4.7 ⭐⭐⭐⭐⭐ (32,025 ratings)</p>
                      </div>
                      <div className="cart-product-actions">
                        <button
                          type="button"
                          onClick={() => handleRemoveFromCart(prod)}
                        >
                          Remove
                        </button>
                        <button
                          type="button"
                          disabled={isInWishlist}
                          onClick={() => handleMoveToWishlist(prod)}
                        >
                          Move to wishlist
                        </button>
                      </div>
                      <div className="cart-product-price-tag">
                        €{prod.price}
                      </div>
                    </div>
                  );
                })}
              </div>
            </article>
            <aside className="cart-products-aside">
              <h4>Total:</h4>
              <h2>
                {cartTotal && cartTotal > 0 ? (
                  <span>€{cartTotal}</span>
                ) : (
                  <span>free</span>
                )}
              </h2>

              <Button
                type="button"
                variant="primary"
                disabled={containsPaidProducts || checkingOut}
                onClick={handleFreeCheckout}
              >
                {checkingOut ? 'Adding...' : 'Proceed to checkout'}
              </Button>
              {containsPaidProducts && (
                <p role="status">
                  Payment checkout is not available yet. Your cart has been
                  saved.
                </p>
              )}
            </aside>
          </section>
        </>
      ) : (
        <p>You don&apos;t have any products in your shopping cart</p>
      )}
      <div className="cart-page-bottom">
        <h2>You might also like</h2>
      </div>
    </div>
  );
};

export default Cart;
