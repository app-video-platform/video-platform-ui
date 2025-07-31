import React from 'react';
import { useSelector } from 'react-redux';
import { selectAuthUser } from '../../../store/auth-store/auth.selectors';
import { selectAllShopCartProducts } from '../../../store/shop-cart/shop-cart.selectors';
import GalDropdown from '../gal-dropdown.component';
import GalIcon from '../../gal-icon-component/gal-icon.component';
import { FaShoppingCart } from 'react-icons/fa';

const ShopCartDropdown: React.FC = () => {
  const user = useSelector(selectAuthUser);
  const cartItems = useSelector(selectAllShopCartProducts);

  if (!user) {
    return null;
  }

  return (
    <div className="gal-shop-cart-dropdown">
      <GalDropdown
        customClassName="galactica-shopping-cart"
        trigger={({ toggle }) => (
          <button onClick={toggle} className="notifications-button">
            <GalIcon icon={FaShoppingCart} size={16} />
          </button>
        )}
        menu={() => (
          <>
            {/* <div className="dropdown-menu"> */}
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
            {/* </div> */}
          </>
        )}
      />
    </div>
  );
};

export default ShopCartDropdown;
