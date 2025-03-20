import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ProductType } from '../../../models/product/product.types';
import FormInput from '../../../components/form-input/form-input.component';

import './create-product.styles.scss';
import UppyFileUploader from '../../../components/uppy-file-uploader/uppy-file-uploader.component';
import DownloadSections from './download-sections/download-sections.component';
import { DownloadSection } from '../../../models/product/download-section';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuthUser } from '../../../store/auth-store/auth.selectors';
import { ICreateProduct, IUpdateProduct } from '../../../models/product/product';
import PriceSelector from '../../../components/price-selector/price-selector.component';
import { AppDispatch } from '../../../store/store';
import { createNewProduct, updateProductDetails } from '../../../store/product-store/product.slice';
import Button from '../../../components/button/button.component';
import { getProductByProductIdAPI } from '../../../api/products-api';
import { DownloadProduct } from '../../../models/product/download-product';
import { useNavigate, useParams } from 'react-router-dom';

export interface ProductFormData {
  name: string;
  description: string; // Limit 420 characters
  type: ProductType | '';
  price: 'free' | number;
  sections: DownloadSection[];
}

interface ProductFormProps {
  mode: 'create' | 'edit';
}

const ProductForm: React.FC<ProductFormProps> = ({ mode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id, type } = useParams<{ id: string, type: ProductType }>();

  const user = useSelector(selectAuthUser);
  const uniqueId = uuidv4();


  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    type: '',
    price: 'free',
    sections: [{ id: `tmp-${uniqueId}`, title: '', description: '', position: 1 }]
  });


  const [product, setProduct] = useState<DownloadProduct | null>(null);
  const [productImage, setProductImage] = useState<File | null>(null);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const productTypes: ProductType[] = ['COURSE', 'DOWNLOAD', 'CONSULTATION'];

  useEffect(() => {
    if (!product && id && type && user) {
      getProductByProductIdAPI(id, type).then(data => {
        console.log('product', data);

        const initialData: ProductFormData = {
          description: data.description,
          name: data.name,
          price: data.price,
          sections: data.sections,
          type: data.type
        };
        setProduct(data);
        setFormData(initialData);
        console.log(formData);
      });

    }
  }, [product, id, type, user]);

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

  const handleImageChange = (image: File[]) => {
    // Callback to update the form's state with files from UppyFileUploader
    setProductImage(image[0]);

    console.log('product image', image[0]);

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


      if (mode === 'create') {
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

        dispatch(createNewProduct(productData)).unwrap().then(data => {
          console.log('response', data);

          navigate('products');
        }
        );
      } else if (mode === 'edit') {
        console.log('edit form data', formData);

        const updatedSections = formData.sections.map(section => {
          if (section.id && section.id.startsWith('tmp')) {
            const { id, ...rest } = section;
            return rest;
          }
          return section;
        });

        const updateData: IUpdateProduct = {
          id: id as string,
          name: formData.name,
          description: formData.description,
          type: formData.type as ProductType,
          price: formData.price,
          sections: updatedSections,
          status: product?.status || 'draft',
          userId: product?.userId || '',
        };

        dispatch(updateProductDetails(updateData))
          .unwrap()
          .then((data) => {
            navigate('/');
            console.log('Update response', data);
          });
      }
    }
  };


  const onTypeButtonClick = (selectedType: ProductType) => {
    setFormData((prev) => ({ ...prev, type: selectedType }));
  };

  if (id && !product) {
    return <div>Loading...</div>;
  }

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

        <div className='price-selector-wrapper'>
          <h3>Choose Your Price Option</h3>
          <PriceSelector price={formData.price} setPrice={handleSetPrice} />
        </div>

        <div className='image-uploader'>
          <h3>Upload an image</h3>
          <UppyFileUploader onFilesChange={handleImageChange} allowedFileTypes={['image/*']} />
        </div>

        <div className='file-uploader'>
          <DownloadSections
            sections={formData.sections}
            onChangeSections={handleSectionsChange}
            handleFilesChange={handleFilesChange}
          />
        </div>


        <Button type="primary" text={mode === 'create' ? 'Save' : 'Update'} htmlType='submit' />
      </form>

    </div>
  );
};

export default ProductForm;