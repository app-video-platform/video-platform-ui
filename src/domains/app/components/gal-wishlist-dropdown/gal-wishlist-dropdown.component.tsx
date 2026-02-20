import React from 'react';
import { useSelector } from 'react-redux';
import { CiHeart } from 'react-icons/ci';
import { useNavigate } from 'react-router-dom';

import {
  selectWishlistCount,
  selectWishlistProducts,
} from 'core/store/wishlist';
import { GalDropdown, GalIcon, Button } from '@shared/ui';
import { getCssVar } from '@shared/utils';

import './gal-wishlist-dropdown.styles.scss';

const formatCount = (n: number) => (n > 99 ? '99+' : String(n));

const GalWishlistDropdown: React.FC = () => {
  const navigate = useNavigate();
  const wishlistProducts = useSelector(selectWishlistProducts);
  const wishlistProdCount = useSelector(selectWishlistCount);

  return (
    <div className="gal-wishlist-dropdown">
      <GalDropdown
        customClassName="galactica-wishlist"
        trigger={({ toggle }) => (
          <button onClick={toggle} className="wishlist-icon-button">
            <GalIcon
              icon={CiHeart}
              size={18}
              color={getCssVar('--text-primary')}
            />
            {wishlistProdCount > 0 && (
              <span className="badge" aria-live="polite">
                {formatCount(wishlistProdCount)}
              </span>
            )}
          </button>
        )}
        menu={() => (
          <>
            <div className="dropdown-menu">
              {wishlistProducts && wishlistProducts.length > 0 ? (
                wishlistProducts &&
                wishlistProducts.map((item) => (
                  <div key={item.id} className="cart-item-box">
                    <span className="item-title">{item.name}</span>{' '}
                    <span className="item-price">{item.price}</span>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => navigate('/app/cart')}
                    >
                      Add to cart
                    </Button>
                  </div>
                ))
              ) : (
                <p>You don&apos;t have anything in your wishlist</p>
              )}
            </div>
            <div className="wishlist-cart-btn">
              <Button
                type="button"
                variant="primary"
                onClick={() => navigate('/app/library/my-wishlist')}
              >
                Go to wishlist
              </Button>
            </div>
          </>
        )}
      />
    </div>
  );
};

export default GalWishlistDropdown;
