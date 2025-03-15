import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/store';
import { FaUser } from 'react-icons/fa';

import './user-dashboard.styles.scss';
import { selectAuthUser } from '../../store/auth-store/auth.selectors';
import { useNavigate } from 'react-router-dom';
import { selectAllProducts } from '../../store/product-store/product.selectors';
import { BaseProduct } from '../../models/product/product';
import ProductCard from '../../components/product-box/product-box.component';


const UserDashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = useSelector(selectAuthUser);
  const products = useSelector(selectAllProducts);
  let topThreeProducts: BaseProduct[] = [];

  if (products) {
    topThreeProducts = products
      .sort((a, b) => b.customers - a.customers)
      .slice(0, 3);
  }

  return (
    <div className='user-dashboard-container'>
      {/* <FaUser className="user-avatar" /> */}
      {React.createElement(FaUser as React.FC<{ className: string }>, { className: 'user-avatar' })}
      <div className="user-profile">
        <div className='user-info-box'>
          <h2>{user?.firstName} {user?.lastName}</h2>
          <span>{user?.email}</span>
          <span>Content Creator</span>
          <span>Member since: <strong>12 March 2025</strong></span>
        </div>
        <div className='action-buttons-container'>
          <button className='see-preview-btn' onClick={() => navigate('my-page-preview')}>Preview</button>
        </div>
      </div>

      <div className='producs-section'>
        <h2>Most successful products</h2>
        {
          topThreeProducts && topThreeProducts.length > 0 ? (
            topThreeProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))
          ) : (
            <div>
              <p>You don&apos;t have any products yet. Go ahead and create one right now!</p>
              <button onClick={() => navigate('products/create')}>Create product</button>
            </div>
          )
        }
      </div>
      <div className='audience-section'>
        <h2>Audience</h2>
        <p>No audience data yet</p>
      </div>
      <div className='sales-section'>
        <h2>Sales</h2>
        <p>No sales data yet</p>
      </div>
    </div>
  );
};

export default UserDashboard;