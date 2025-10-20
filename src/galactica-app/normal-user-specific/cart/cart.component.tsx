import React from 'react';
import { useSelector } from 'react-redux';

import {
  selectAllShopCartProducts,
  selectShopCartTotal,
} from '../../../store/shop-cart/shop-cart.selectors';
import { selectAuthUser } from '../../../store/auth-store/auth.selectors';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const placeholderImage = require('../../../assets/image-placeholder.png');

import './cart.styles.scss';
import GalButton from '../../../components/gal-button/gal-button.component';

const Cart: React.FC = () => {
  const cartProducts = useSelector(selectAllShopCartProducts);
  const cartTotal = useSelector(selectShopCartTotal);
  const user = useSelector(selectAuthUser);

  return (
    <div className="cart-page">
      <h1 className="cart-page-title">Shopping Cart</h1>
      {cartProducts ? (
        <>
          <section className="cart-container">
            <div className="cart-container-line">
              <p>{cartProducts.length} products in your cart</p>
              <hr className="cart-underline"></hr>
            </div>
            <article className="cart-products-container">
              <div className="cart-products-list">
                {cartProducts.map((prod) => (
                  <div key={prod.id} className="cart-product">
                    <img
                      src={placeholderImage}
                      alt={prod.title}
                      className="product-card-image"
                    />
                    <div className="cart-product-details">
                      <h3>{prod.title}</h3>
                      <p>By {prod.createdByName}</p>
                      <p>4.7 ⭐⭐⭐⭐⭐ (32,025 ratings)</p>
                    </div>
                    <div className="cart-product-actions">
                      <button type="button">Remove</button>
                      <button type="button">Move to wishlist</button>
                    </div>
                    <div className="cart-product-price-tag">€{prod.price}</div>
                  </div>
                ))}
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
              <GalButton text="Procees to checkout ->" type="primary" />
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
