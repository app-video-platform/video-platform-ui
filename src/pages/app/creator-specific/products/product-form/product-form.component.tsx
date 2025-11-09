/* eslint-disable indent */
/* eslint-disable no-console */
/* eslint-disable no-unused-vars */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { GalPriceSelector } from '@components';
import { GalButton, GalUppyFileUploader } from '@shared/ui';
import {
  IConsultationDetails,
  CreateProductStepOne,
  ConsultationDetails,
  CreateProductSections,
} from '@features/product-form';
import { MeetingMethods } from '@api/enums';
import { IRemoveProductPayload } from '@api/models';
import { ProductType, AbstractProduct } from '@api/types';
import { selectAuthUser } from '@store/auth-store';
import {
  getProductByProductId,
  updateCourseProductDetails,
  deleteProduct,
} from '@store/product-store';
import { AppDispatch } from '@store/store';

import './product-form.styles.scss';

export interface NewProductFormData {
  id: string; // Initially empty, will be set after product creation
  name: string;
  description: string;
  type: ProductType; // e.g., 'course', 'ebook', etc.
  price: 'free' | number; // e.g., 'free', 'paid'
  sections?: any[]; // Optional: sections for courses, etc.
  consultationDetails?: IConsultationDetails;
}

export interface FormErrors {
  name?: string;
  type?: string;
  api?: string;
}

const ProductForm: React.FC = () => {
  const { type, id } = useParams();
  const isEditMode = Boolean(id);
  const dispatch = useDispatch<AppDispatch>();

  const user = useSelector(selectAuthUser);

  const [formData, setFormData] = useState<NewProductFormData>({
    id: '', // Initially empty, will be set after product creation
    name: '',
    description: '',
    type: '' as ProductType, // e.g., 'course', 'ebook', etc.
    price: 'free',
    sections: [], // Optional: sections for courses, etc.
    consultationDetails: {
      duration: 0,
      meetingMethod: MeetingMethods.ZOOM,
    },
  });

  const [productImage, setProductImage] = useState<File | null>(null);

  const [showRestOfForm, setShowRestOfForm] = useState(false);
  const [showLoadingRestOfForm, setShowLoadingRestOfForm] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (isEditMode && id) {
      dispatch(
        getProductByProductId({
          productId: id,
          productType: type as ProductType,
        }),
      )
        .unwrap()
        .then((product) => {
          const baseData = {
            id: product.id ?? '',
            name: product.name ?? '',
            description: product.description ?? '',
            type: product.type ?? ('COURSE' as ProductType),
            price: product.price ?? 'free',
          };
          let newData: any = baseData;

          switch (product.type) {
            case 'COURSE':
              newData = {
                ...baseData,
                sections: product.sections || [],
              };
              break;

            case 'DOWNLOAD':
              newData = {
                ...baseData,
                sections: product.sections || [],
              };
              break;

            case 'CONSULTATION':
              newData = {
                ...baseData,
                durationMinutes: product.durationMinutes ?? 60,
                meetingMethod: product.meetingMethod ?? 'ZOOM',
                customLocation: product.customLocation ?? '',
                bufferBeforeMinutes: product.bufferBeforeMinutes ?? 0,
                bufferAfterMinutes: product.bufferAfterMinutes ?? 0,
                cancellationPolicy: product.cancellationPolicy ?? '',
                maxSessionsPerDay: product.maxSessionsPerDay ?? 1,
                confirmationMessage: product.confirmationMessage ?? '',
              };
              break;

            default:
              // fallback
              newData = baseData;
          }

          setFormData(newData);
          setShowRestOfForm(true);
        })
        .catch((error) => {
          console.error('Failed to load product data', error);
          setErrors({ api: 'Could not load product data' });
        });
    }
  }, [isEditMode, id]);

  const handleSetPrice = (price: number | 'free') => {
    setFormData((prev) => ({ ...prev, price: price }));
  };

  const handleImageChange = (image: File[]) => {
    // Callback to update the form's state with files from GalUppyFileUploader
    setProductImage(image[0]);
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

    const productData: AbstractProduct = {
      name: formData.name,
      description: formData.description,
      type: 'COURSE' as ProductType,
      price: formData.price,
      status: 'draft',
      userId: user?.id ?? '',
      id: formData.id,
    };

    console.log('form data', formData);

    dispatch(updateCourseProductDetails(productData))
      .unwrap()
      .then((data) => {
        if (data) {
          window.alert('Course product updated successfully!');
        }
      })
      .catch((error) => {
        console.error('Error updating course product:', error);
        setErrors({
          api: 'Failed to update course product. Please try again.',
        });
      })
      .finally(() => {
        setShowLoadingRestOfForm(false);
      });
  };

  const setField = useCallback(
    <K extends keyof NewProductFormData>(
      field: K,
      value: NewProductFormData[K],
    ) => {
      setFormData((f) => ({ ...f, [field]: value }));
    },
    [],
  );

  const handleProductRemove = async () => {
    if (!formData.id) {
      console.error('Product ID is not set. Cannot remove product.');
      return;
    }

    if (!user || !user.id) {
      console.error('User ID is not available for product removal');
      return;
    }

    const deleteProductPayload: IRemoveProductPayload = {
      id: formData.id,
      userId: user.id,
      productType: formData.type, // Assuming the product type is 'COURSE'
    };

    dispatch(deleteProduct(deleteProductPayload))
      .unwrap()
      .then(() => {
        window.alert('Product removed successfully');
        // Optionally redirect or reset form state here
      })
      .catch((error) => {
        console.error('Failed to remove product:', error);
        window.alert('Failed to remove product. Please try again.');
      });
  };

  if (!user || !user.id) {
    return <p>You must be logged in to create a product.</p>;
  }

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <div className="create-new-product-header">
          <h1>Create New Product</h1>

          {showRestOfForm && (
            <>
              <GalButton
                type="primary"
                text="Update product details"
                htmlType="submit"
              />

              <GalButton
                type="secondary"
                text="DELETE"
                htmlType="button"
                onClick={handleProductRemove}
              />
            </>
          )}
        </div>

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
              <GalPriceSelector
                price={formData.price}
                setPrice={handleSetPrice}
              />
            </div>

            <div className="image-uploader">
              <div className="image-uploader-box">
                <h3>Upload an image</h3>
              </div>
              <div className="image-uploader-box">
                <GalUppyFileUploader
                  onFilesChange={handleImageChange}
                  allowedFileTypes={['image/*']}
                  disableImporters={true}
                />
              </div>
            </div>

            <div className="sections-container">
              {formData.type === 'CONSULTATION' ? (
                <>
                  <h3>Consultation details</h3>
                  <ConsultationDetails
                    formData={formData}
                    errors={errors}
                    setFormData={setFormData}
                    userId={user.id}
                  />
                </>
              ) : (
                <>
                  <h3>Sections</h3>
                  <CreateProductSections
                    sections={formData.sections || []}
                    productType={formData.type}
                    productId={formData.id}
                  />
                </>
              )}
            </div>

            {/* <div className="action-btns-wrapper">
              <GalButton type="primary" text="Save Changes" htmlType="submit" />
            </div> */}
          </>
        )}
      </form>
    </div>
  );
};

export default ProductForm;
