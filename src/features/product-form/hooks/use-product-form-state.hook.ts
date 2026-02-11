import { useState, useCallback } from 'react';

import { ProductDraft, FormErrors } from '../models/product-form';

export const useProductFormState = () => {
  const [formData, setFormData] = useState<ProductDraft>({
    id: '',
    name: '',
    description: '',
    type: 'COURSE',
    price: 'free',
    sections: [],
  });

  const [productImage, setProductImage] = useState<File | null>(null);
  const [errors, setErrors] = useState<FormErrors>({});
  const [showRestOfForm, setShowRestOfForm] = useState(false);
  const [showLoadingRestOfForm, setShowLoadingRestOfForm] = useState(false);

  const setField = useCallback(
    <K extends keyof ProductDraft>(field: K, value: ProductDraft[K]) => {
      setFormData((f) => ({ ...f, [field]: value }));
    },
    [],
  );

  const handleSetPrice = (price: number | 'free') => {
    setFormData((prev) => ({ ...prev, price }));
  };

  const handleImageChange = (files: File[]) => {
    setProductImage(files[0] ?? null);
  };

  const validateForm = () => {
    const newErrors: FormErrors = {};

    if (!formData.name) {
      newErrors.name = 'Mai mai mai, vezi ca asta o fi required candva!';
    }
    if (!formData.type) {
      newErrors.type = 'Fara asta nu poti mere mai departe!';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return {
    formData,
    setFormData,
    setField,
    productImage,
    handleImageChange,
    handleSetPrice,
    errors,
    setErrors,
    validateForm,
    showRestOfForm,
    setShowRestOfForm,
    showLoadingRestOfForm,
    setShowLoadingRestOfForm,
  };
};
