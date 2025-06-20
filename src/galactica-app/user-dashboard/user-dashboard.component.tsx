import React from 'react';
import { useSelector } from 'react-redux';
import { FaUser } from 'react-icons/fa';

import './user-dashboard.styles.scss';
import { selectAuthUser } from '../../store/auth-store/auth.selectors';
import { useNavigate } from 'react-router-dom';
import { selectAllProducts } from '../../store/product-store/product.selectors';
import ProductCard from '../../components/product-box/product-box.component';
import Button from '../../components/button/button.component';
import { BaseProduct } from '../../api/models/product/product';

const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector(selectAuthUser);
  const products = useSelector(selectAllProducts);
  const topThreeProducts: BaseProduct[] = [];

  // if (products) {
  //   topThreeProducts = products
  //     .sort((a, b) => b.customers - a.customers)
  //     .slice(0, 3);
  // }

  return (
    <div className="user-dashboard-container">
      {/* <FaUser className="user-avatar" /> */}
      <div className="user-banner">
        {React.createElement(FaUser as React.FC<{ className: string }>, {
          className: 'user-avatar',
        })}
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
          <Button
            onClick={() => navigate('my-page-preview')}
            text="Preview"
            type="secondary"
          />
        </div>
      </div>

      <div className="producs-section">
        <h2>Most successful products</h2>
        {topThreeProducts && topThreeProducts.length > 0 ? (
          topThreeProducts.map((item) => (
            <ProductCard key={item.id} product={item} />
          ))
        ) : (
          <div>
            <p>
              You don&apos;t have any products yet. Go ahead and create one
              right now!
            </p>
            <Button
              onClick={() => navigate('products/create')}
              text="Create Product"
              type="primary"
            />
            {/* <Button
              onClick={() => navigate('products/create-course')}
              text="(tmp) Create COURSE"
              type="primary"
            /> */}
          </div>
        )}
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

export default UserDashboard;
