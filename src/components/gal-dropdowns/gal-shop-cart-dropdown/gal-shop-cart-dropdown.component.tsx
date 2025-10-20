import React from 'react';
import { useSelector } from 'react-redux';
import { FaShoppingCart } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import { selectAuthUser } from '../../../store/auth-store/auth.selectors';
import {
  selectAllShopCartProducts,
  selectCartCount,
} from '../../../store/shop-cart/shop-cart.selectors';
import GalDropdown from '../gal-dropdown.component';
import GalIcon from '../../gal-icon-component/gal-icon.component';
import GalButton from '../../gal-button/gal-button.component';

import './gal-shop-cart-dropdown.styles.scss';

const formatCount = (n: number) => (n > 99 ? '99+' : String(n));

const ShopCartDropdown: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector(selectAuthUser);
  const cartItems = useSelector(selectAllShopCartProducts);
  const countFromStore = useSelector(selectCartCount);

  if (!user) {
    return null;
  }

  return (
    <div className="gal-shop-cart-dropdown">
      <GalDropdown
        customClassName="galactica-shopping-cart"
        trigger={({ toggle }) => (
          <button onClick={toggle} className="cart-icon-button">
            <GalIcon icon={FaShoppingCart} size={18} />
            {countFromStore > 0 && (
              <span className="badge" aria-live="polite">
                {formatCount(countFromStore)}
              </span>
            )}
          </button>
        )}
        menu={() => (
          <>
            <div className="dropdown-menu">
              {cartItems && cartItems.length > 0 ? (
                cartItems &&
                cartItems.map((item) => (
                  <div key={item.id} className="cart-item-box">
                    <span className="item-title">{item.title}</span>
                    <span className="item-price">{item.price}</span>
                  </div>
                ))
              ) : (
                <p>You don&apos;t have anything in you shopping cart</p>
              )}
            </div>
            <div className="cart-checkout-btn">
              <GalButton
                text="Go to checkout"
                type="primary"
                onClick={() => navigate('/app/cart')}
              />
            </div>
          </>
        )}
      />
    </div>
  );
};

export default ShopCartDropdown;
