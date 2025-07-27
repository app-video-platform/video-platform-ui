import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import TopNavbar from '../app-layout/top-navbar/top-navbar.component';
import { IMinimalProduct } from '../../api/models/product/product';
import { getAllProductsMinimalAPI } from '../../api/services/products/products-api';
import GalButton from '../../components/gal-button/gal-button.component';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const placeholderImage = require('../../assets/image-placeholder.png');

import './explore-page.styles.scss';

const ExplorePage: React.FC = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<IMinimalProduct[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true; // ↪️ prevent state updates after unmount

    // call your service
    getAllProductsMinimalAPI()
      .then((data) => {
        if (isMounted) {
          setProducts(data);
        }
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) {
          setError('Failed to load products.');
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []); // empty deps → runs once on mount

  if (loading) {
    return <p>Loading products…</p>;
  }
  if (error) {
    return <p>{error}</p>;
  }
  return (
    <div className="explore-page">
      <TopNavbar />
      <main className="explore-page-content">
        <section className="intro">
          <h1>Check this out</h1>
          <p>
            Here we show products. This is where people search for products or
            instructors
          </p>
          <p>
            All types of users have access to this page, even visitors (people
            without an account)
          </p>
          <p>
            All types of registered users (User, Creator, Admin) have a quick
            access link to this page
          </p>
        </section>
        <section className="explore-products">
          <h1>These are our best products</h1>
          <div className="products-list">
            {products?.map((product, idx) => (
              <div key={idx} className="product-card">
                <img
                  src={placeholderImage}
                  alt={product.title}
                  className="product-card-image"
                />
                <div className="product-card-details">
                  <div className="last-updated-line">
                    <span>
                      {new Date(product.updatedAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <h3>{product.title}</h3>
                  <div className="type-and-price-line">
                    <span>{product.type?.toLowerCase()}</span>
                    <span>
                      {product.price !== 'free' && <span>&euro;</span>}
                      {product.price}
                    </span>
                  </div>
                  <span className="creator">
                    {product.createdByName}, {product.createdByTitle}
                  </span>
                </div>
                <GalButton
                  text="View Product"
                  type="secondary"
                  onClick={() =>
                    navigate(`/product/${product.id}/${product.type}`)
                  }
                />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default ExplorePage;
