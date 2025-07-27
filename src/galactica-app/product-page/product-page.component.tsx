import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { useParams } from 'react-router-dom';

import { AppDispatch } from '../../store/store';

import './product-page.styles.scss';
import { getProductByProductId } from '../../store/product-store/product.slice';
import { ProductType } from '../../api/models/product/product.types';
import { IProductResponse } from '../../api/models/product/product';
import GalButton from '../../components/gal-button/gal-button.component';
import GalExpansionPanel from '../../components/gal-expansion-panel/gal-expansion-panel.component';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const placeholderImage = require('../../assets/image-placeholder.png');

const ProductPage: React.FC = () => {
  const { type, id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const [product, setProduct] = useState<IProductResponse | null>(null);
  const [numberOfSections, setNumberOfSections] = useState<number>(0);
  const [numberOfLessons, setNumberOfLessons] = useState<number>(0);

  useEffect(() => {
    if (id && type) {
      dispatch(
        getProductByProductId({
          productId: id,
          productType: type as ProductType,
        })
      )
        .unwrap()
        .then((product) => {
          getProductInformation(product);
          setProduct(product);
        });
    }
  }, [dispatch, id, type]);

  const getProductInformation = (product: IProductResponse) => {
    let numOfSections = 0;
    let numOfLessons = 0;

    product.sections?.forEach((section) => {
      numOfSections++;
      section.lessons?.forEach(() => {
        numOfLessons++;
      });
    });
    setNumberOfLessons(numOfLessons);
    setNumberOfSections(numOfSections);
  };

  return (
    <div className="product-page">
      {!product ? (
        <p>Product not found</p>
      ) : (
        <>
          <div className="product-banner">
            <div className="product-main-info">
              <h1>{product?.name}</h1>
              <p>{product?.type}</p>
              <p>
                Short description, with some kinda lorem ipsum dolor sit amet,
                consectetur adipiscing elit. Sed euismod, urna eu tincidunt
                consectetur, nisi nisl aliquam nunc, vitae dictum.
              </p>
              <p>Rating: 4.7/5 (196,043 customers)</p>
              <p>Created by: The One Handed Man</p>
              <p>{product?.price}</p>
              <div className="cta-buttons">
                <GalButton type="primary" text="Add to Cart" />
                <GalButton type="secondary" text="Buy Now" />
              </div>
              <p>Last updated: 2 days ago</p>
              <p>Language: Swahili</p>
            </div>
            <div className="product-image">
              <img
                src={placeholderImage}
                alt={product?.name}
                className="product-card-image"
                width={300}
              />
            </div>
          </div>
          <div className="product-details">
            <p>{product.description}</p>
            <p>This product includes:</p>
            <ul>
              <li>some few hours of video, if it&apos;s a course</li>
              <li>Maybe some assignments or quizzes, for the same reason</li>
              <li>Some reading material and documentation</li>
              <li>Some few hours of video, if it&apos;s a download as well</li>
              <li>
                Some minutes of alone time with the creator for a consultation
              </li>
            </ul>
            <p>The product&apos;s content</p>
            <p>
              {numberOfSections} sections, {numberOfLessons} lessons, 4733 hours
              of total length
            </p>
            {product.sections?.map((section) => (
              <GalExpansionPanel key={section.id} header={section.title || ''}>
                <p>Duration: 2 min</p>
                <p>{section.description}</p>
                {section.lessons?.map((lesson) => (
                  <div key={lesson.id} className="lesson-line">
                    <h3>{lesson.title}</h3>
                    <p>Type: {lesson.type}</p>
                    <p>Duration: {lesson.duration}</p>
                  </div>
                ))}
              </GalExpansionPanel>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductPage;
