import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { HiArrowLeft } from 'react-icons/hi';

import {
  AbstractProduct,
  AppDispatch,
  ProductStatus,
} from 'core/api/models';
import {
  clearCurrentProduct,
  getProductById,
  selectCurrentProduct,
  selectProductsError,
  selectProductsLoading,
} from 'core/store/product-store';
import { PRODUCT_TYPE_REGISTRY } from 'core/constants';
import { Button, Icon, StatusBadge, StatusBadgeTone } from '@shared/ui';
import { getCssVar } from '@shared/utils';
import { appRoutes } from 'domains/app/routes/routes';

import {
  formatProductDate,
  formatProductPrice,
  getProductStatusLabel,
  getProductTypeLabel,
} from '../products-list/products-list.utils';

import './product-overview.styles.scss';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const placeholderImage = require('../../../../../../assets/image-placeholder.png');

const productStatusTone: Record<ProductStatus, StatusBadgeTone> = {
  PUBLISHED: 'success',
  DRAFT: 'neutral',
  HIDDEN: 'warning',
};

const meetingMethodLabel: Record<string, string> = {
  ZOOM: 'Zoom',
  GOOGLE_MEET: 'Google Meet',
  PHONE: 'Phone',
  OTHER: 'Other',
};

const getProductTitle = (product: AbstractProduct) =>
  product.name?.trim() || 'Untitled product';

const getLastUpdatedLabel = (product: AbstractProduct) => {
  const updated = formatProductDate(product.updatedAt ?? product.createdAt, 'Not updated');

  return updated.iso ? (
    <time dateTime={updated.iso} title={updated.fullLabel}>
      Updated {updated.shortLabel}
    </time>
  ) : (
    updated.shortLabel
  );
};

const countLessons = (product: AbstractProduct) => {
  if (product.type !== 'COURSE') {
    return 0;
  }

  return product.sections?.reduce(
    (total, section) => total + (section.lessons?.length ?? 0),
    0,
  ) ?? 0;
};

const countFiles = (product: AbstractProduct) => {
  if (product.type !== 'DOWNLOAD') {
    return 0;
  }

  return product.sections?.reduce(
    (total, section) => total + (section.files?.length ?? 0),
    0,
  ) ?? 0;
};

const DefinitionList: React.FC<{
  rows: Array<{ label: string; value?: React.ReactNode }>;
}> = ({ rows }) => {
  const visibleRows = rows.filter(
    (row) => row.value !== undefined && row.value !== null && row.value !== '',
  );

  if (visibleRows.length === 0) {
    return null;
  }

  return (
    <dl className="product-overview-definition-list">
      {visibleRows.map((row) => (
        <div key={row.label}>
          <dt>{row.label}</dt>
          <dd>{row.value}</dd>
        </div>
      ))}
    </dl>
  );
};

const SectionOutline: React.FC<{ product: Extract<AbstractProduct, { type: 'COURSE' | 'DOWNLOAD' }> }> = ({
  product,
}) => {
  const sections = product.sections ?? [];
  const isCourse = product.type === 'COURSE';

  if (sections.length === 0) {
    return (
      <p className="product-overview-empty-copy">
        {isCourse
          ? 'No course sections have been added yet.'
          : 'No download sections have been added yet.'}
      </p>
    );
  }

  return (
    <div className="product-overview-outline">
      {sections.map((section, index) => {
        const itemCount = isCourse
          ? section.lessons?.length ?? 0
          : section.files?.length ?? 0;
        const itemLabel = isCourse
          ? `${itemCount} ${itemCount === 1 ? 'lesson' : 'lessons'}`
          : `${itemCount} ${itemCount === 1 ? 'file' : 'files'}`;

        return (
          <article key={section.id ?? `${section.title}-${index}`}>
            <div>
              <h3>{section.title || `Section ${index + 1}`}</h3>
              {section.description && <p>{section.description}</p>}
            </div>
            <span>{itemLabel}</span>
          </article>
        );
      })}
    </div>
  );
};

const ProductContentSummary: React.FC<{
  product: AbstractProduct;
  onEditProduct: () => void;
}> = ({
  product,
  onEditProduct,
}) => {
  if (product.type === 'COURSE') {
    const sectionCount = product.sections?.length ?? 0;
    const lessonCount = countLessons(product);

    return (
      <section className="product-overview-panel product-overview-panel--wide">
        <div className="product-overview-section-heading">
          <div>
            <h2>Course content</h2>
            <p>Read-only outline from the current product sections.</p>
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={onEditProduct}
          >
            Edit curriculum
          </Button>
        </div>
        <div className="product-overview-summary-strip" aria-label="Course summary">
          <article>
            <span>Sections</span>
            <strong>{sectionCount}</strong>
          </article>
          <article>
            <span>Lessons</span>
            <strong>{lessonCount}</strong>
          </article>
        </div>
        <SectionOutline product={product} />
      </section>
    );
  }

  if (product.type === 'DOWNLOAD') {
    const sectionCount = product.sections?.length ?? 0;
    const fileCount = countFiles(product);

    return (
      <section className="product-overview-panel product-overview-panel--wide">
        <div className="product-overview-section-heading">
          <div>
            <h2>Download contents</h2>
            <p>Read-only package summary from the loaded download sections.</p>
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={onEditProduct}
          >
            Edit files
          </Button>
        </div>
        <div className="product-overview-summary-strip" aria-label="Download summary">
          <article>
            <span>Sections</span>
            <strong>{sectionCount}</strong>
          </article>
          <article>
            <span>Files</span>
            <strong>{fileCount}</strong>
          </article>
        </div>
        <SectionOutline product={product} />
      </section>
    );
  }

  if (product.type === 'CONSULTATION') {
    const details = product.consultationDetails;

    return (
      <section className="product-overview-panel product-overview-panel--wide">
        <div className="product-overview-section-heading">
          <div>
            <h2>Consultation setup</h2>
            <p>Configured appointment details for this product.</p>
          </div>
          <Button
            type="button"
            variant="secondary"
            onClick={onEditProduct}
          >
            Edit availability
          </Button>
        </div>
        {details ? (
          <DefinitionList
            rows={[
              {
                label: 'Duration',
                value: details.durationMinutes
                  ? `${details.durationMinutes} minutes`
                  : undefined,
              },
              {
                label: 'Meeting method',
                value: details.meetingMethod
                  ? meetingMethodLabel[details.meetingMethod] ?? details.meetingMethod
                  : undefined,
              },
              { label: 'Location', value: details.customLocation },
              {
                label: 'Buffer before',
                value:
                  details.bufferBeforeMinutes !== undefined
                    ? `${details.bufferBeforeMinutes} minutes`
                    : undefined,
              },
              {
                label: 'Buffer after',
                value:
                  details.bufferAfterMinutes !== undefined
                    ? `${details.bufferAfterMinutes} minutes`
                    : undefined,
              },
              {
                label: 'Max sessions per day',
                value: details.maxSessionsPerDay,
              },
              {
                label: 'Connected calendars',
                value:
                  details.connectedCalendars && details.connectedCalendars.length > 0
                    ? `${details.connectedCalendars.length} connected`
                    : undefined,
              },
              { label: 'Confirmation message', value: details.confirmationMessage },
              { label: 'Cancellation policy', value: details.cancellationPolicy },
            ]}
          />
        ) : (
          <p className="product-overview-empty-copy">
            Consultation details have not been configured yet.
          </p>
        )}
      </section>
    );
  }

  return (
    <section className="product-overview-panel product-overview-panel--wide">
      <div className="product-overview-section-heading">
        <div>
          <h2>Membership setup</h2>
          <p>
            Membership Overview V1 shows only Product-owned information and
            configured recurring pricing.
          </p>
        </div>
        <Button
          type="button"
          variant="secondary"
          onClick={onEditProduct}
        >
          Edit membership
        </Button>
      </div>
      <p className="product-overview-empty-copy">
        Member counts, subscriber access, revenue, and Membership content summaries
        need dedicated backend-backed contracts before they appear here.
      </p>
    </section>
  );
};

const ProductOverview: React.FC = () => {
  const { productId } = useParams();
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const product = useSelector(selectCurrentProduct);
  const loading = useSelector(selectProductsLoading);
  const error = useSelector(selectProductsError);

  useEffect(() => {
    dispatch(clearCurrentProduct());

    if (productId) {
      dispatch(getProductById({ productId }));
    }
  }, [dispatch, productId]);

  const loadedProduct = product?.id === productId ? product : null;
  const productTitle = loadedProduct ? getProductTitle(loadedProduct) : '';
  const productTypeLabel = loadedProduct
    ? getProductTypeLabel(loadedProduct.type)
    : 'Product';
  const productIcon = loadedProduct
    ? PRODUCT_TYPE_REGISTRY[loadedProduct.type].displayIcon
    : undefined;
  const productStatus = loadedProduct?.status ?? 'DRAFT';
  const created = useMemo(
    () => formatProductDate(loadedProduct?.createdAt, 'Not created'),
    [loadedProduct?.createdAt],
  );
  const updated = useMemo(
    () => formatProductDate(loadedProduct?.updatedAt, 'Not updated'),
    [loadedProduct?.updatedAt],
  );

  if (!productId) {
    return (
      <div className="product-overview-page">
        <Button
          type="button"
          variant="tertiary"
          className="product-overview-back"
          onClick={() => navigate(appRoutes.products)}
        >
          <Icon icon={HiArrowLeft} size={18} color={getCssVar('--brand-primary')} />
          <span>Products</span>
        </Button>
        <div className="product-overview-state">
          <h2>Product not found</h2>
          <p>This product route is missing a product ID.</p>
        </div>
      </div>
    );
  }

  if (loading && !loadedProduct) {
    return (
      <div className="product-overview-page">
        <Button
          type="button"
          variant="tertiary"
          className="product-overview-back"
          onClick={() => navigate(appRoutes.products)}
        >
          <Icon icon={HiArrowLeft} size={18} color={getCssVar('--brand-primary')} />
          <span>Products</span>
        </Button>
        <div className="product-overview-state product-overview-state--loading" role="status">
          <div className="product-overview-skeleton product-overview-skeleton--hero" />
          <div className="product-overview-skeleton" />
          <div className="product-overview-skeleton" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="product-overview-page">
        <Button
          type="button"
          variant="tertiary"
          className="product-overview-back"
          onClick={() => navigate(appRoutes.products)}
        >
          <Icon icon={HiArrowLeft} size={18} color={getCssVar('--brand-primary')} />
          <span>Products</span>
        </Button>
        <div className="product-overview-state" role="alert">
          <h2>Product data is not available yet</h2>
          <p>{error}</p>
          <Button
            type="button"
            variant="secondary"
            onClick={() => dispatch(getProductById({ productId }))}
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  if (!loadedProduct) {
    return (
      <div className="product-overview-page">
        <Button
          type="button"
          variant="tertiary"
          className="product-overview-back"
          onClick={() => navigate(appRoutes.products)}
        >
          <Icon icon={HiArrowLeft} size={18} color={getCssVar('--brand-primary')} />
          <span>Products</span>
        </Button>
        <div className="product-overview-state">
          <h2>Product not found</h2>
          <p>This product is not available.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-overview-page">
      <Button
        type="button"
        variant="tertiary"
        className="product-overview-back"
        onClick={() => navigate(appRoutes.products)}
      >
        <Icon icon={HiArrowLeft} size={18} color={getCssVar('--brand-primary')} />
        <span>Products</span>
      </Button>

      <header className="product-overview-hero">
        <img
          className="product-overview-hero__thumbnail"
          src={loadedProduct.imageUrl || placeholderImage}
          alt=""
          aria-hidden="true"
        />
        <div className="product-overview-hero__identity">
          <div className="product-overview-hero__eyebrow">
            <span aria-hidden="true">{productIcon}</span>
            <span>{productTypeLabel}</span>
            <StatusBadge
              label={getProductStatusLabel(productStatus)}
              tone={productStatusTone[productStatus] ?? 'neutral'}
              size="sm"
            />
          </div>
          <h1>{productTitle}</h1>
          {loadedProduct.description ? (
            <p>{loadedProduct.description}</p>
          ) : (
            <p className="product-overview-muted">No description has been added yet.</p>
          )}
          <div className="product-overview-hero__updated">
            {getLastUpdatedLabel(loadedProduct)}
          </div>
        </div>
        <div className="product-overview-hero__actions">
          <Button
            type="button"
            variant="primary"
            onClick={() => navigate(appRoutes.productsEdit(loadedProduct.id))}
          >
            Edit product
          </Button>
          {loadedProduct.status === 'PUBLISHED' && (
            <Button
              type="button"
              variant="secondary"
              onClick={() =>
                navigate(appRoutes.product(loadedProduct.id, loadedProduct.type))
              }
            >
              View public page
            </Button>
          )}
        </div>
      </header>

      <div className="product-overview-grid">
        <section className="product-overview-panel">
          <h2>Product details</h2>
          <DefinitionList
            rows={[
              { label: 'Status', value: getProductStatusLabel(productStatus) },
              { label: 'Product type', value: productTypeLabel },
              { label: 'Price', value: formatProductPrice(loadedProduct) },
              {
                label: 'Created',
                value: created.iso ? (
                  <time dateTime={created.iso} title={created.fullLabel}>
                    {created.shortLabel}
                  </time>
                ) : (
                  created.shortLabel
                ),
              },
              {
                label: 'Updated',
                value: updated.iso ? (
                  <time dateTime={updated.iso} title={updated.fullLabel}>
                    {updated.shortLabel}
                  </time>
                ) : (
                  updated.shortLabel
                ),
              },
            ]}
          />
        </section>

        <ProductContentSummary
          product={loadedProduct}
          onEditProduct={() => navigate(appRoutes.productsEdit(loadedProduct.id))}
        />
      </div>
    </div>
  );
};

export default ProductOverview;
