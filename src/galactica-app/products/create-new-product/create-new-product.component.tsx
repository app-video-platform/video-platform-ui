import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { AppDispatch } from '../../../store/store';
import { selectAuthUser } from '../../../store/auth-store/auth.selectors';
import { ProductType } from '../../../models/product/product.types';

import './create-new-product.styles.scss';
import { updateCourseProductDetails } from '../../../store/product-store/product.slice';
import { IUpdateCourseProduct } from '../../../models/product/product';
import Button from '../../../components/button/button.component';
import PriceSelector from '../../../components/price-selector/price-selector.component';
import UppyFileUploader from '../../../components/uppy-file-uploader/uppy-file-uploader.component';
import CreateProductStepOne from './create-product-step-one/create-product-step-one.component';
import CreateProductSections from './create-product-sections/create-product-sections.component';

export interface NewProductFormData {
  id: string; // Initially empty, will be set after product creation
  name: string;
  description: string;
  type: ProductType; // e.g., 'course', 'ebook', etc.
  price: 'free' | number; // e.g., 'free', 'paid'
  sections?: any[]; // Optional: sections for courses, etc.
}

export interface FormErrors {
  name?: string;
  type?: string;
  api?: string;
}

const CreateNewProduct: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector(selectAuthUser);

  const [formData, setFormData] = useState<NewProductFormData>({
    id: '', // Initially empty, will be set after product creation
    name: '',
    description: '',
    type: '' as ProductType, // e.g., 'course', 'ebook', etc.
    price: 'free',
    sections: [], // Optional: sections for courses, etc.
  });

  const [productImage, setProductImage] = useState<File | null>(null);

  const [showRestOfForm, setShowRestOfForm] = useState(false);
  const [showLoadingRestOfForm, setShowLoadingRestOfForm] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSetPrice = (price: number | 'free') => {
    setFormData((prev) => ({ ...prev, price: price }));
  };

  const handleImageChange = (image: File[]) => {
    // Callback to update the form's state with files from UppyFileUploader
    setProductImage(image[0]);

    console.log('product image', image[0]);
  };

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.name) {
      newErrors.name = 'Mai mai mai, vezi ca asta o fi required candva!';
    }
    if (!formData.type) {
      newErrors.type = 'Fara asta nu poti mere mai departe!';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    await handleUpdateProduct();
  };

  const handleUpdateProduct = async () => {
    if (!formData.id) {
      console.error('Product ID is not set. Cannot update product details.');
      setErrors({
        api: 'Product ID is not set. Cannot update product details.',
      });
      return;
    }

    const productData: IUpdateCourseProduct = {
      name: formData.name,
      description: formData.description,
      type: 'COURSE' as ProductType,
      price: formData.price,
      status: 'draft',
      userId: user?.id ?? '',
      id: formData.id,
    };

    console.log('SAVE PRODUCT', productData);
    console.log('PRODUCT ID', formData.id);

    dispatch(updateCourseProductDetails(productData))
      .unwrap()
      .then((data) => {
        console.log('response', data);
        if (data) {
          window.alert('Course product created successfully!');
        }
      })
      .catch((error) => {
        console.error('Error creating course product:', error);
        setErrors({
          api: 'Failed to create course product. Please try again.',
        });
      })
      .finally(() => {
        setShowLoadingRestOfForm(false);
      });
  };

  const setField = useCallback(
    <K extends keyof NewProductFormData>(
      field: K,
      value: NewProductFormData[K]
    ) => {
      setFormData((f) => ({ ...f, [field]: value }));
    },
    []
  );

  if (!user || !user.id) {
    return <p>You must be logged in to create a product.</p>;
  }

  return (
    <div>
      <h2>Create NEW PRODUCT</h2>

      <form onSubmit={handleSubmit}>
        <CreateProductStepOne
          formData={formData}
          setField={setField}
          errors={errors}
          showRestOfForm={showRestOfForm}
          setShowRestOfForm={setShowRestOfForm}
          setShowLoadingRestOfForm={setShowLoadingRestOfForm}
          userId={user?.id}
        />

        {showLoadingRestOfForm && <p>Loading...</p>}

        {showRestOfForm && (
          <>
            <div className="price-selector-wrapper">
              <h3>Choose Your Price Option</h3>
              <PriceSelector price={formData.price} setPrice={handleSetPrice} />
            </div>

            <div className="image-uploader">
              <div className="image-uploader-box">
                <h3>Upload an image</h3>
              </div>
              <div className="image-uploader-box">
                <UppyFileUploader
                  onFilesChange={handleImageChange}
                  allowedFileTypes={['image/*']}
                  disableImporters={true}
                />
              </div>
            </div>

            <div className="sections-container">
              <h3>Sections</h3>
              <CreateProductSections
                sections={formData.sections || []}
                productType={formData.type}
              />
            </div>

            <div className="action-btns-wrapper">
              <Button type="primary" text="Save Changes" htmlType="submit" />
            </div>
          </>
        )}
      </form>
    </div>
  );
};

export default CreateNewProduct;
