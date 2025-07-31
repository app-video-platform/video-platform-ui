import React from 'react';
import { useSelector } from 'react-redux';

import { selectAllShopCartProducts } from '../../../store/shop-cart/shop-cart.selectors';
import { selectAuthUser } from '../../../store/auth-store/auth.selectors';

import './cart.styles.scss';

const Cart: React.FC = () => {
  const cartProducts = useSelector(selectAllShopCartProducts);
  const user = useSelector(selectAuthUser);

  return (
    <div className="cart-page">
      {!cartProducts && (
        <p>You don&apos;t have any products in your shopping cart</p>
      )}
    </div>
  );
};

export default Cart;
