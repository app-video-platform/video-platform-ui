import React from 'react';

import { PRODUCT_TYPE_REGISTRY } from 'core/constants';
import { Input, Textarea } from '@shared/ui';
import { FormErrors, ProductDraft } from '../models';

import './basic-info.styles.scss';

interface BasicInfoProps {
  formData: ProductDraft;
  isEditMode?: boolean;
  errors?: FormErrors;
  setField: <K extends keyof ProductDraft>(
    // eslint-disable-next-line no-unused-vars
    field: K,
    // eslint-disable-next-line no-unused-vars
    value: ProductDraft[K],
  ) => void;
}

const BasicInfo: React.FC<BasicInfoProps> = ({
  formData,
  setField,
  isEditMode = true,
  errors = {},
}) => {
  const typeConfig = PRODUCT_TYPE_REGISTRY[formData.type];
  const typeLabel = typeConfig?.label ?? 'Product';
  const nameLabel = `${typeLabel} name`;

  return (
    <div className="basic-info">
      <section className="product-config-section" aria-labelledby="identity-title">
        <div className="product-config-section__header">
          <h3 id="identity-title">Product identity</h3>
          <p>
            Name the {typeLabel.toLowerCase()} and write the customer-facing
            description used across Product surfaces.
          </p>
        </div>

        <div className="product-config-fields">
          <Input
            type="text"
            name="product-name"
            label={nameLabel}
            required
            aria-required="true"
            aria-describedby="product-name-help"
            value={formData.name ?? ''}
            className="basic-info__name"
            error={errors.name}
            onChange={(e: { target: { value: string } }) =>
              setField('name', e.target.value)
            }
          />
          <p id="product-name-help" className="product-config-help">
            Keep it clear and recognizable. You can refine marketing copy on
            the landing page later.
          </p>

          <Textarea
            label={`${typeLabel} description`}
            name="product-description"
            aria-describedby="product-description-help"
            value={formData.description ?? ''}
            onChange={(e: { target: { value: string } }) =>
              setField('description', e.target.value)
            }
          />
          <p id="product-description-help" className="product-config-help">
            Summarize the outcome, contents, or experience customers should
            expect.
          </p>
        </div>
      </section>

      <section className="product-config-section" aria-labelledby="type-title">
        <div className="product-config-section__header">
          <h3 id="type-title">Product type</h3>
          <p>
            Product type controls the workspace destinations and cannot be
            changed after the Draft Product is created.
          </p>
        </div>

        <div className="basic-info__type-summary">
          <span className="basic-info__type-icon" aria-hidden="true">
            {typeConfig?.displayIcon ?? '•'}
          </span>
          <div>
            <strong>{typeLabel}</strong>
            <span>{typeConfig?.description}</span>
          </div>
          {isEditMode && (
            <span className="basic-info__type-lock">Read-only</span>
          )}
        </div>
        {errors.type && <p className="product-config-error">{errors.type}</p>}
      </section>
    </div>
  );
};

export default BasicInfo;
