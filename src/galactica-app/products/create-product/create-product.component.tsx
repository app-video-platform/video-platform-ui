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
import { addImageToProduct, createNewProduct, updateProductDetails } from '../../../store/product-store/product.slice';
import Button from '../../../components/button/button.component';
import { addFileToSectionAPI, getProductByProductIdAPI } from '../../../api/products-api';
import { DownloadProduct } from '../../../models/product/download-product';
import { useNavigate, useParams } from 'react-router-dom';
import { uploadFilesInBackground } from '../../../utils/files/background-uploader';

export interface ProductFormData {
  name: string;
  description: string; // Limit 420 characters
  type: ProductType | '';
  price: 'free' | number;
  sections: DownloadSection[];
}

export interface IFilesWithSection {
  sectionLocalId: string,
  files: File[]
}

interface ProductFormProps {
  mode: 'create' | 'edit';
}

const ProductForm: React.FC<ProductFormProps> = ({ mode }) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { id, type } = useParams<{ id: string, type: ProductType }>();

  const user = useSelector(selectAuthUser);

  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    type: '',
    price: 'free',
    sections: [{ localId: uuidv4(), title: '', description: '', position: 1 }]
  });


  const [product, setProduct] = useState<DownloadProduct | null>(null);
  const [productImage, setProductImage] = useState<File | null>(null);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [uploadedFilesWithSection, setUploadedFilesWithSection] = useState<IFilesWithSection[]>([]);

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

  const handleFilesChange = (filesWithSections: IFilesWithSection) => {
    setUploadedFilesWithSection((prevFiles = []) => {
      // Find if a file section with the same sectionId already exists
      const index = prevFiles.findIndex(
        (fileSection) => fileSection.sectionLocalId === filesWithSections.sectionLocalId
      );

      // If found, update its files; otherwise, add the new entry to the array
      if (index !== -1) {
        // Create a new array with an updated entry
        return prevFiles.map((fileSection, i) =>
          i === index ? { ...fileSection, files: filesWithSections.files } : fileSection
        );
      } else {
        return [...prevFiles, filesWithSections];
      }
    });

    console.log('files', filesWithSections);
    console.log('all files', uploadedFilesWithSection);
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
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    if (mode === 'create') {
      await handleCreateProduct();
    } else if (mode === 'edit') {
      await handleEditProduct();
    }
  };

  const handleCreateProduct = async () => {
    // Remove id fields from sections before sending
    const sectionsWithoutIds = formData.sections.map(({ localId, id, ...rest }) => rest);

    const productData: ICreateProduct = {
      name: formData.name,
      description: formData.description,
      type: formData.type as ProductType,
      price: formData.price,
      sections: sectionsWithoutIds,
      status: 'draft',
      userId: user?.id ?? ''
    };

    console.log('SAVE PRODUCT', productData);
    console.log('SAVE IMAGE', productImage);
    console.log('SAVE FILES', uploadedFilesWithSection);

    // Create the new product and wait for the response
    dispatch(createNewProduct(productData)).unwrap().then(async data => {
      console.log('response', data);
      if (data) {

        // Handle image upload if available
        if (data && productImage) {
          const imageData = await dispatch(
            addImageToProduct({ productId: data.id, image: productImage })
          ).unwrap();
          console.log('image upload data', imageData);
        }


        if (data && data.sections && uploadedFilesWithSection.length > 0) {
          uploadFilesInBackground(uploadedFilesWithSection, formData.sections, data.sections);
        }

        // Navigate away from the page after creation
        navigate('..');
      }
    });

  };

  const handleEditProduct = async () => {
    console.log('edit form data', formData);

    // Remove temporary IDs from new sections (those starting with 'tmp')
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

    const updateResponse = await dispatch(updateProductDetails(updateData)).unwrap();
    console.log('Update response', updateResponse);

    // Navigate after editing
    navigate('/');
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