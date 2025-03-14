import React, { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ProductType } from '../../../models/product/product.types';
import FormInput from '../../../components/form-input/form-input.component';

import './create-product.styles.scss';
import UppyFileUploader from '../../../components/uppy-file-uploader/uppy-file-uploader.component';
import DownloadSections from './download-sections/download-sections.component';
import { DownloadSection } from '../../../models/product/download-section';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuthUser } from '../../../store/auth-store/auth.selectors';
import { ICreateProduct } from '../../../models/product/product';
import PriceSelector from '../../../components/price-selector/price-selector.component';
import { AppDispatch } from '../../../store/store';
import { createNewProduct } from '../../../store/product-store/product.slice';

export interface ProductFormData {
  name: string;
  description: string; // Limit 420 characters
  type: ProductType | '';
  price: 'free' | number;
  sections: DownloadSection[];
}

const CreateProduct: React.FC = () => {
  const user = useSelector(selectAuthUser);
  const uniqueId = uuidv4();
  const dispatch = useDispatch<AppDispatch>();


  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    type: '',
    price: 'free',
    sections: [{ id: uniqueId, title: '', description: '', position: 1 }]
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const productTypes: ProductType[] = ['COURSE', 'DOWNLOAD', 'CONSULTATION'];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSetPrice = (price: number | 'free') => {
    setFormData((prev) => ({ ...prev, price: price }));
  };

  const handleFilesChange = (files: File[]) => {
    // Callback to update the form's state with files from UppyFileUploader
    setUploadedFiles(files);

    console.log('files', files);

  };

  const handleSectionsChange = (updatedSections: DownloadSection[]) => {
    setFormData((prev) => ({ ...prev, sections: updatedSections }));
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

      const sectionsWithoutIds = formData.sections.map(({ id, ...rest }) => rest);


      const productData: ICreateProduct = {
        name: formData.name,
        description: formData.description,
        type: formData.type as ProductType,
        price: formData.price,
        sections: sectionsWithoutIds,
        status: 'draft',
        userId: user?.id ?? ''
      };

      console.log('form', formData);


      console.log('Product data', productData);
      console.log('files', uploadedFiles);

      dispatch(createNewProduct(productData)).unwrap().then(data => {
        console.log('response', data);

      });

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


        <FormInput label="Description"
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange} />
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

        <PriceSelector price={formData.price} setPrice={handleSetPrice} />

        <div className='file-uploader'>
          <DownloadSections
            sections={formData.sections}
            onChangeSections={handleSectionsChange}
            handleFilesChange={handleFilesChange}
          />
        </div>

        <button className="save-product-btn" type="submit">
          Save
        </button>
      </form>

    </div>
  );
};

export default CreateProduct;