import React from 'react';

import { ProductType } from '@api/models';
import { GalBoxSelector } from '@components';
import { Input, Textarea } from '@shared/ui';
import { ProductDraft } from '../models';

import './basic-info.styles.scss';

interface BasicInfoProps {
  formData: ProductDraft;
  setField: <K extends keyof ProductDraft>(
    // eslint-disable-next-line no-unused-vars
    field: K,
    // eslint-disable-next-line no-unused-vars
    value: ProductDraft[K],
  ) => void;
}

const BasicInfo: React.FC<BasicInfoProps> = ({ formData, setField }) => (
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
        availableOptions={['CONSULTATION', 'COURSE', 'DOWNLOAD']} // Example lesson types
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

export default BasicInfo;
