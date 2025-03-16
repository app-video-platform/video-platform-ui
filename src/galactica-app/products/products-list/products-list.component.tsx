import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch } from './../../../store/store';
import { selectAuthUser } from './../../../store/auth-store/auth.selectors';
import { getAllProductsByUserId } from './../../../store/product-store/product.slice';

import './products-list.styles.scss';
import { useNavigate } from 'react-router-dom';
import { selectAllProducts } from '../../../store/product-store/product.selectors';

const ProductsList: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const products = useSelector(selectAllProducts);
  const user = useSelector(selectAuthUser);

  useEffect(() => {
    if (user && user.id) {
      dispatch(getAllProductsByUserId(user.id));
    } else {
      dispatch(getAllProductsByUserId('user-id-alex-bej')).unwrap().then(data => console.log('data from call in useeffect', data));
    }
  }, [dispatch, user]);

  return (
    <div>
      <div className='products-header'>
        <h1>Products</h1>
        <button className='add-product-btn' onClick={() => navigate('create')}>+ Add product</button>
      </div>
      {
        products && products.length > 0 ? (

          <table className='products-table'>
            <thead>
              <tr>
                <th>Name</th>
                <th>Type</th>
                <th>Price</th>
                <th>Status</th>
                <th>Customers</th>
                <th>Actions</th>


              </tr>
            </thead>
            <tbody>
              {products?.map((product) => (

                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>{product.type}</td>
                  <td>{product.price}</td>
                  <td>{product.status}</td>
                  <td>{product.customers}</td>
                  <td><button onClick={() => navigate(`edit/${product.id}`)}>Edit</button></td>
                </tr>
              ))}

            </tbody>
          </table>


        ) : (
          <p>There are no products to show</p>
        )

      }

    </div>
  );
};

export default ProductsList;