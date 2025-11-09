import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

import { GalProductCard } from '@components';
import { GalIcon, GalButton } from '@shared/ui';
import { selectAuthUser } from '@store/auth-store';
import {
  selectTopThreeProducts,
  getAllProductsByUserId,
} from '@store/product-store';
import { AppDispatch } from '@store/store';

import './creator-dashboard.styles.scss';

const CreatorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector(selectAuthUser);
  const topThreeProducts = useSelector(selectTopThreeProducts);

  useEffect(() => {
    if (user && user.id) {
      dispatch(getAllProductsByUserId(user?.id));
    }
  }, [user]);

  return (
    <div className="user-dashboard-container">
      {/* <FaUser className="user-avatar" /> */}
      <div className="user-banner">
        <GalIcon icon={FaUser} size={100} className="user-avatar" />
        <div className="user-profile">
          <div className="user-info-box">
            <h2>
              {user?.firstName} {user?.lastName}
            </h2>
            <span>{user?.email}</span>
            <span>Content Creator</span>
            <span>
              Member since: <strong>12 March 2025</strong>
            </span>
          </div>
        </div>

        <div className="action-buttons-container">
          <GalButton
            onClick={() => navigate('my-page-preview')}
            text="Preview"
            type="secondary"
          />
        </div>
      </div>

      <div className="producs-section">
        <h2>Most successful products</h2>
        <div className="product-cards">
          {topThreeProducts && topThreeProducts.length > 0 ? (
            topThreeProducts.map((item) => (
              <GalProductCard key={item.id} product={item} />
            ))
          ) : (
            <div>
              <p>
                You don&apos;t have any products yet. Go ahead and create one
                right now!
              </p>
              <GalButton
                onClick={() => navigate('products/create')}
                text="Create Product"
                type="primary"
              />
            </div>
          )}
        </div>
      </div>
      <div className="audience-section">
        <h2>Audience</h2>
        <p>No audience data yet</p>
      </div>
      <div className="sales-section">
        <h2>Sales</h2>
        <p>No sales data yet</p>
      </div>
    </div>
  );
};

export default CreatorDashboard;
