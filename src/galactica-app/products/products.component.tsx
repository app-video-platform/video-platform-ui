import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch, RootState } from '../../store/store';
import { selectAuthUser } from '../../store/auth-store/auth.selectors';
import { getAllProductsByUserId } from '../../store/product-store/product.slice';

import './products.styles.scss';

const ProductsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { products, loading, error } = useSelector((state: RootState) => state.products);
  const user = useSelector(selectAuthUser);

  useEffect(() => {
    console.log('Get in here');

    if (user && user.id) {
      dispatch(getAllProductsByUserId(user.id));
    } else {
      console.log('Now mock');

      dispatch(getAllProductsByUserId('user-id-alex-bej'));
    }
  }, [dispatch, user]);

  return (
    <div>
      <div className='products-header'>
        <h1>Products</h1>
        <button className='add-product-btn'>+ Add product</button>
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
                  <td><button onClick={() => alert('Maaaaai, Tomi, ce credeai ca o sa se intample?')}>Edit</button></td>
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

export default ProductsPage;