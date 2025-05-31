import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';

import Button from '../../../../components/button/button.component';
import PriceSelector from '../../../../components/price-selector/price-selector.component';
import UppyFileUploader from '../../../../components/uppy-file-uploader/uppy-file-uploader.component';
import { DownloadSection } from '../../../../models/product/download-section';
import {
  ICreateCourseProduct,
  ICreateProduct,
  INewProductPayload,
  IUpdateCourseProduct,
} from '../../../../models/product/product';
import { ProductType } from '../../../../models/product/product.types';
import { selectAuthUser } from '../../../../store/auth-store/auth.selectors';
import { AppDispatch } from '../../../../store/store';
import { ProductFormData } from '../../create-product/create-product.component';
import FormInput from '../../../../components/form-input/form-input.component';

import './create-course.styles.scss';
import {
  createCourseProduct,
  updateCourseProductDetails,
} from '../../../../store/product-store/product.slice';
import { set } from 'react-hook-form';

const CreateCourse: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  // const { id, type } = useParams<{ id: string; type: ProductType }>();

  const user = useSelector(selectAuthUser);

  const [formData, setFormData] = useState<ProductFormData>({
    id: '',
    name: '',
    description: '',
    type: '',
    price: 'free',
    sections: [{ localId: uuidv4(), title: '', description: '', position: 1 }],
  });

  const [productImage, setProductImage] = useState<File | null>(null);

  const [showRestOfForm, setRestOfForm] = useState(false);
  const [showLoadingRestOfForm, setShowLoadingRestOfForm] = useState(false);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const productTypes: ProductType[] = ['COURSE', 'DOWNLOAD', 'CONSULTATION'];

  useEffect(() => {
    formData.type = 'COURSE'; // Default type for course creation
    setFormData((prev) => ({ ...prev, type: 'COURSE' }));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSetPrice = (price: number | 'free') => {
    setFormData((prev) => ({ ...prev, price: price }));
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
    // Remove id fields from sections before sending

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
      productId: formData.id,
    };

    console.log('SAVE PRODUCT', productData);
    console.log('PRODUCT ID', formData.id);

    

    dispatch(
      updateCourseProductDetails(productData)
    )
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
        // 4) In either case (success or failure), turn OFF loading here:
        setShowLoadingRestOfForm(false);

        // TEMPORARY
        setRestOfForm(true);
      });
  };

  const onTypeButtonClick = (selectedType: ProductType) => {
    setFormData((prev) => ({ ...prev, type: selectedType }));
  };

  const handleContinue = () => {
    setShowLoadingRestOfForm(true);

    const { name, description, type } = formData;

    console.log(
      'handleContinue',
      name,
      description,
      type,
      showLoadingRestOfForm
    );

    const newProductPayload: INewProductPayload = {
      name,
      description,
      type: type as ProductType,
      userId: user?.id ?? '',
      status: 'draft',
    };

    setTimeout(() => {
      dispatch(createCourseProduct(newProductPayload))
        .unwrap()
        .then((data) => {
          console.log('response', data);
          if (data) {
            formData.id = data.id; // Set the product ID in formData
            setFormData((prev) => ({ ...prev, id: data.id }));
            setRestOfForm(true);
          }
        })
        .catch((error) => {
          console.error('Error creating course product:', error);
          setErrors({
            api: 'Failed to create course product. Please try again.',
          });
        })
        .finally(() => {
          // 4) In either case (success or failure), turn OFF loading here:
          setShowLoadingRestOfForm(false);

          // TEMPORARY
          setRestOfForm(true);
        });
    }, 500);
  };

  return (
    <div>
      <h2>Create new course product</h2>

      <form onSubmit={handleSubmit}>
        <FormInput
          label="Title"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
        />
        {errors.name && <p className="error-text-red">{errors.name}</p>}

        <FormInput
          label="Description"
          type="text"
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
        <h3>Choose a type</h3>

        <div className="type-selectors">
          <div className="type-selectors-container">
            {productTypes.map((type) => (
              <div
                className={`type-box ${
                  formData.type === type ? 'type-box__selected' : ''
                } ${
                  type === 'DOWNLOAD' || type === 'CONSULTATION'
                    ? 'type-box__disabled'
                    : ''
                }`}
                key={type}
                onClick={() => onTypeButtonClick(type)}
              >
                <span className="type">{type}</span>
              </div>
            ))}
          </div>
          {errors.type && <p className="error-text-red">{errors.type}</p>}
        </div>

        {!showRestOfForm && (
          <div className="course-continue-button-wrapper">
            <Button
              type="primary"
              htmlType="button"
              onClick={() => handleContinue()}
              text="Continue"
              customClassName="create-course-continue-button"
            />
          </div>
        )}

        {showLoadingRestOfForm && <p>Loading...</p>}

        {showRestOfForm && (
          <>
            <div className="price-selector-wrapper">
              <h3>Choose Your Price Option</h3>
              <PriceSelector price={formData.price} setPrice={handleSetPrice} />
            </div>

            <div className="image-uploader">
              <h3>Upload an image</h3>
              <UppyFileUploader
                onFilesChange={handleImageChange}
                allowedFileTypes={['image/*']}
              />
            </div>

            <div className="sections-container">
              <h3>Sections</h3>
            </div>

            <Button type="primary" text="Save" htmlType="submit" />
          </>
        )}
      </form>
    </div>
  );
};

export default CreateCourse;
