import React from 'react';

import { ProductType } from 'core/api/models';
import { GalBoxSelector } from 'domains/app/components';
import { Input, Textarea } from '@shared/ui';
import { ProductDraft } from '../models';

import './basic-info.styles.scss';

interface BasicInfoProps {
  formData: ProductDraft;
  showOnlyCurrentType?: boolean;
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
  showOnlyCurrentType = false,
}) => {
  const availableProductTypes: ProductType[] = showOnlyCurrentType
    ? [formData.type]
    : ['CONSULTATION', 'COURSE', 'DOWNLOAD'];

  return (
    <div className="basic-info">
      <Input
        type="text"
        name="name"
        label="Title"
        value={formData.name ?? ''}
        className="title-input"
        onChange={(e: { target: { value: string } }) =>
          setField('name', e.target.value)
        }
      />

      <div className="product-type-selectors">
        <span className="type-selectors-label">Product Type</span>
        <GalBoxSelector<ProductType>
          selectedOption={formData.type}
          selectFor="product"
          onSelect={(type) => setField('type', type)}
          availableOptions={availableProductTypes}
          disabledOptions={[]} // Add any disabled options if needed
        />
      </div>
      <Textarea
        label="Description"
        name="description"
        value={formData.description ?? ''}
        onChange={(e: { target: { value: string } }) =>
          setField('description', e.target.value)
        }
      />
    </div>
  );
};

export default BasicInfo;
