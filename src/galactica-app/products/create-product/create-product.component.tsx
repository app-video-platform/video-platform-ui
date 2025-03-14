import React, { useState } from 'react';
import { ProductType } from '../../../models/product/product.types';
import FormInput from '../../../components/form-input/form-input.component';

import './create-product.styles.scss';
import UppyFileUploader from '../../../components/uppy-file-uploader/uppy-file-uploader.component';

export interface ProductFormData {
  name: string;
  description: string; // Limit 420 characters
  image: string;       // URL to image (jpeg, png, etc.)
  type: ProductType | '';
  price: 'free' | number;
}

const CreateProduct: React.FC = () => {
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    image: '',
    type: '',
    price: 'free',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const productTypes: ProductType[] = ['Course', 'Download', 'Consultation'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFilesChange = (files: File[]) => {
    // Callback to update the form's state with files from UppyFileUploader
    setUploadedFiles(files);

    console.log('files', files);

  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name) { newErrors.name = 'Mai mai mai, vezi ca asta o fi required candva!'; }
    if (!formData.type) { newErrors.type = 'Fara asta nu poti mere mai departe!'; }

    setErrors(newErrors);
    return true;
    // return Object.keys(newErrors).length === 0; 
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const productData: ProductFormData = {
        name: formData.name,
        description: formData.description,
        image: formData.image,
        type: formData.type,
        price: formData.price,
      };

      console.log('Product data', productData);
      console.log('files', uploadedFiles);

    }
  };

  const onTypeButtonClick = (selectedType: ProductType) => {
    setFormData((prev) => ({ ...prev, type: selectedType }));
  };

  return (
    <div>
      <h2>Create new product</h2>

      <form onSubmit={handleSubmit}>

        <FormInput label="Title"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange} />
        {errors.name && <p className="error-text-red">{errors.name}</p>}

        <h3>Choose a type</h3>

        <div className='type-selectors'>
          <div className='type-selectors-container'>
            {
              productTypes.map((type) => (
                <div className={`type-box ${formData.type === type ? 'type-box__selected' : ''}`} key={type} onClick={() => onTypeButtonClick(type)}>
                  <span className='type'>{type}</span>
                </div>
              ))
            }
          </div>
          {errors.type && <p className="error-text-red">{errors.type}</p>}
        </div>

        <div className='file-uploader'>
          <UppyFileUploader onFilesChange={handleFilesChange} />
        </div>

        {errors.type && <p className="error-text-red">{errors.type}</p>}
        <button className="save-product-btn" type="submit">
          Save
        </button>
      </form>

    </div>
  );
};

export default CreateProduct;