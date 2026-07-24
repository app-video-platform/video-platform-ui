import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import DOMPurify from 'dompurify';

import {
  AbstractProduct,
  AppDispatch,
  hasRole,
  ProductMinimised,
  UserRole,
} from 'core/api/models';
import { Button, GalExpansionPanel } from '@shared/ui';
import { selectAuthUser } from 'core/store/auth-store';
import { getProductById } from 'core/store/product-store';
import {
  enrollInFreeProductAPI,
  getProductAccessAPI,
  getProductFileDownloadAPI,
} from 'core/api/services';
import {
  addProductToCart,
  selectCartIds,
} from 'core/store/shop-cart';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const placeholderImage = require('../../../../assets/image-placeholder.png');

import './product-page.styles.scss';

const ProductPage: React.FC = () => {
  const { type, id } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector(selectAuthUser);
  const cartIds = useSelector(selectCartIds);
  const [product, setProduct] = useState<AbstractProduct | null>(null);
  const [numberOfSections, setNumberOfSections] = useState<number>(0);
  const [numberOfLessons, setNumberOfLessons] = useState<number>(0);
  const [hasAccess, setHasAccess] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (id) {
      dispatch(getProductById({ productId: id }))
        .unwrap()
        .then((product) => {
          if (type && product.type !== type) {
            navigate(`/app/product/${product.id}`, { replace: true });
          }
          getProductInformation(product);
          setProduct(product);
        });
    }
  }, [dispatch, id, navigate, type]);

  useEffect(() => {
    if (!user || !id) {
      setHasAccess(false);
      return;
    }

    getProductAccessAPI(id)
      .then((access) => setHasAccess(access.hasAccess))
      .catch(() => setHasAccess(false));
  }, [id, user]);

  const getProductInformation = (product: AbstractProduct) => {
    let numOfSections = 0;
    let numOfLessons = 0;

    product.sections?.forEach((section) => {
      numOfSections++;
      if (product.type === 'COURSE') {
        section.lessons?.forEach(() => {
          numOfLessons++;
        });
      }
    });
    setNumberOfLessons(numOfLessons);
    setNumberOfSections(numOfSections);
  };

  const isOwner =
    Boolean(user && user.id === product?.userId) ||
    hasRole(user?.roles, UserRole.ADMIN);
  const numericPrice =
    product?.price === 'free' ? 0 : Number(product?.price ?? 0);
  const isFree = numericPrice === 0;
  const isInCart = Boolean(product?.id && cartIds.has(product.id));

  const toSummary = (value: AbstractProduct): ProductMinimised => ({
    id: value.id,
    title: value.name,
    description: value.description,
    type: value.type,
    price: value.price,
    status: value.status,
    imageUrl: value.imageUrl,
    createdById: value.userId,
    createdAt: value.createdAt,
    updatedAt: value.updatedAt,
  });

  const handleEnroll = async () => {
    if (!user) {
      navigate('/auth/login');
      return;
    }
    if (!product) {
      return;
    }

    setEnrolling(true);
    try {
      await enrollInFreeProductAPI(product.id);
      setHasAccess(true);
      const refreshed = await dispatch(
        getProductById({ productId: product.id }),
      ).unwrap();
      setProduct(refreshed);
      toast.success('Added to your library');
    } catch {
      toast.error('This product could not be added to your library.');
    } finally {
      setEnrolling(false);
    }
  };

  const handleAddToCart = () => {
    if (product && !isInCart) {
      dispatch(addProductToCart(toSummary(product)));
    }
  };

  const handleDownload = async (fileId?: string) => {
    if (!product || !fileId) {
      return;
    }
    try {
      const { url } = await getProductFileDownloadAPI(product.id, fileId);
      window.location.assign(url);
    } catch {
      toast.error('The download could not be started.');
    }
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
              <p>{product.description}</p>
              <p>{product?.price}</p>
              <div className="cta-buttons">
                {isOwner ? (
                  <Button
                    type="button"
                    variant="primary"
                    onClick={() =>
                      navigate(
                        `/app/products/edit/${product.id}`,
                      )
                    }
                  >
                    Edit
                  </Button>
                ) : hasAccess ? (
                  <Button type="button" variant="primary" disabled>
                    In your library
                  </Button>
                ) : isFree ? (
                  <Button
                    type="button"
                    variant="primary"
                    disabled={enrolling}
                    onClick={handleEnroll}
                  >
                    {enrolling ? 'Adding...' : 'Enroll for free'}
                  </Button>
                ) : (
                  <>
                    <Button
                      type="button"
                      variant="primary"
                      disabled={isInCart}
                      onClick={handleAddToCart}
                    >
                      {isInCart ? 'Already in cart' : 'Add to Cart'}
                    </Button>
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        handleAddToCart();
                        navigate('/app/cart');
                      }}
                    >
                      Buy Now
                    </Button>
                  </>
                )}
              </div>
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
            <h2>Product content</h2>
            <p>
              {numberOfSections} sections, {numberOfLessons} lessons
            </p>
            {product.type === 'COURSE' &&
              product.sections?.map((section) => (
                <GalExpansionPanel
                  key={section.id}
                  header={section.title || ''}
                >
                  <p>Duration: 2 min</p>
                  <p>{section.description}</p>
                  {section.lessons?.map((lesson) => (
                    <div key={lesson.id} className="lesson-line">
                      <h3>{lesson.title}</h3>
                      <p>Type: {lesson.type}</p>
                      {(hasAccess || isOwner) && lesson.content && (
                        <div
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(lesson.content),
                          }}
                        />
                      )}
                      {(hasAccess || isOwner) && lesson.videoUrl && (
                        <video controls src={lesson.videoUrl}>
                          <track kind="captions" />
                        </video>
                      )}
                    </div>
                  ))}
                </GalExpansionPanel>
              ))}
            {product.type === 'DOWNLOAD' &&
              product.sections?.map((section) => (
                <GalExpansionPanel
                  key={section.id}
                  header={section.title || ''}
                >
                  <p>{section.description}</p>
                  {section.files?.map((file) => (
                    <div key={file.id} className="download-line">
                      {hasAccess || isOwner ? (
                        <button
                          type="button"
                          onClick={() => handleDownload(file.id)}
                        >
                          {file.fileName}
                        </button>
                      ) : (
                        <span>{file.fileName}</span>
                      )}
                    </div>
                  ))}
                </GalExpansionPanel>
              ))}
            {!hasAccess && !isOwner && (
              <p className="content-locked">
                Enroll or purchase this product to open its content.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProductPage;
