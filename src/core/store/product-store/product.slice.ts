/* eslint-disable indent */
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  AbstractProduct,
  AbstractProductBase,
  CourseLesson,
  CreateProductPayload,
  FileDownloadProductResponse,
  LessonCreate,
  ProductGalleryImage,
  ProductMinimised,
  ProductPromoVideo,
  ProductSection,
  ProductSectionCreateRequest,
  ProductSectionUpdateRequest,
  RemoveLessonPayload,
  RemoveSectionPayload,
  UploadDownloadSectionFileRequest,
} from 'core/api/models';
import {
  addImageToProductAPI,
  addProductGalleryImageAPI,
  addProductPromoVideoAPI,
  createLessonAPI,
  createProductAPI,
  createSectionAPI,
  deleteLessonAPI,
  deleteProductAPI,
  deleteSectionAPI,
  deleteSectionFileAPI,
  getAllProductsByUserIdAPI,
  getProductByIdAPI,
  getProductsByOwnerAPI,
  removeImageFromProductAPI,
  removeProductGalleryImageAPI,
  removeProductPromoVideoAPI,
  reorderProductGalleryImagesAPI,
  updateLessonDetailsAPI,
  updateProductDetailsAPI,
  updateSectionDetailsAPI,
  uploadDownloadSectionFileAPI,
} from 'core/api/services';
import { extractErrorMessage } from '@shared/utils';

interface ProductState {
  products: null | AbstractProduct[];
  productSummaries: null | ProductMinimised[];
  currentProduct: AbstractProduct | null;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: null,
  productSummaries: null,
  currentProduct: null,
  loading: false,
  error: null,
};

const replaceSection = (
  sections: ProductSection[] | undefined,
  nextSection: ProductSection,
) => {
  if (!sections || sections.length === 0) {
    return [nextSection];
  }

  const existingIndex = sections.findIndex(
    (section) => section.id === nextSection.id,
  );

  if (existingIndex === -1) {
    return [...sections, nextSection];
  }

  return sections.map((section, index) =>
    index === existingIndex ? nextSection : section,
  );
};

const removeSection = (
  sections: ProductSection[] | undefined,
  sectionId: string,
) => sections?.filter((section) => section.id !== sectionId) ?? [];

const replaceLesson = (
  lessons: CourseLesson[] | undefined,
  nextLesson: CourseLesson,
) => {
  if (!lessons || lessons.length === 0) {
    return [nextLesson];
  }

  const existingIndex = lessons.findIndex((lesson) => lesson.id === nextLesson.id);

  if (existingIndex === -1) {
    return [...lessons, nextLesson];
  }

  return lessons.map((lesson, index) =>
    index === existingIndex ? nextLesson : lesson,
  );
};

const removeLesson = (lessons: CourseLesson[] | undefined, lessonId: string) =>
  lessons?.filter((lesson) => lesson.id !== lessonId) ?? [];

const replaceFile = (
  files: FileDownloadProductResponse[] | undefined,
  nextFile: FileDownloadProductResponse,
) => {
  if (!files || files.length === 0) {
    return [nextFile];
  }

  const existingIndex = files.findIndex((file) => file.id === nextFile.id);

  if (existingIndex === -1) {
    return [...files, nextFile];
  }

  return files.map((file, index) => (index === existingIndex ? nextFile : file));
};

const removeFile = (
  files: FileDownloadProductResponse[] | undefined,
  fileId: string,
) => files?.filter((file) => file.id !== fileId) ?? [];

const updateProductImage = (
  product: AbstractProduct | ProductMinimised,
  productId: string,
  imageUrl?: string,
) => {
  if (product.id === productId) {
    product.imageUrl = imageUrl;
  }
};

const getOrderedGalleryImages = (images: ProductGalleryImage[]) =>
  images
    .slice()
    .sort((first, second) => first.position - second.position)
    .map((image, index) => ({ ...image, position: index + 1 }));

export const createProduct = createAsyncThunk<
  AbstractProduct,
  CreateProductPayload,
  { rejectValue: string }
>('products/createProduct', async (payload, thunkAPI) => {
  try {
    return await createProductAPI(payload);
  } catch (err: unknown) {
    return thunkAPI.rejectWithValue(extractErrorMessage(err));
  }
});

export const updateProductDetails = createAsyncThunk<
  AbstractProduct,
  AbstractProductBase,
  { rejectValue: string }
>('products/updateProductDetails', async (payload, thunkAPI) => {
  try {
    return await updateProductDetailsAPI(payload);
  } catch (err: unknown) {
    return thunkAPI.rejectWithValue(extractErrorMessage(err));
  }
});

export const deleteProduct = createAsyncThunk<
  string,
  { productId?: string; id?: string },
  { rejectValue: string }
>('products/deleteProduct', async (payload, thunkAPI) => {
  try {
    return await deleteProductAPI(payload);
  } catch (err: unknown) {
    return thunkAPI.rejectWithValue(extractErrorMessage(err));
  }
});

export const createProductSection = createAsyncThunk<
  ProductSection,
  ProductSectionCreateRequest,
  { rejectValue: string }
>('products/createProductSection', async (payload, thunkAPI) => {
  try {
    return await createSectionAPI(payload);
  } catch (err: unknown) {
    return thunkAPI.rejectWithValue(extractErrorMessage(err));
  }
});

export const updateProductSection = createAsyncThunk<
  ProductSection,
  ProductSectionUpdateRequest,
  { rejectValue: string }
>('products/updateProductSection', async (payload, thunkAPI) => {
  try {
    return await updateSectionDetailsAPI(payload);
  } catch (err: unknown) {
    return thunkAPI.rejectWithValue(extractErrorMessage(err));
  }
});

export const deleteProductSection = createAsyncThunk<
  { productId: string; sectionId: string },
  RemoveSectionPayload,
  { rejectValue: string }
>('products/deleteProductSection', async (payload, thunkAPI) => {
  try {
    const sectionId = await deleteSectionAPI(payload);
    return {
      productId: payload.productId,
      sectionId,
    };
  } catch (err: unknown) {
    return thunkAPI.rejectWithValue(extractErrorMessage(err));
  }
});

export const createCourseLesson = createAsyncThunk<
  CourseLesson,
  LessonCreate,
  { rejectValue: string }
>('products/createCourseLesson', async (payload, thunkAPI) => {
  try {
    return await createLessonAPI(payload);
  } catch (err: unknown) {
    return thunkAPI.rejectWithValue(extractErrorMessage(err));
  }
});

export const updateCourseLesson = createAsyncThunk<
  CourseLesson,
  CourseLesson,
  { rejectValue: string }
>('products/updateCourseLesson', async (payload, thunkAPI) => {
  try {
    return await updateLessonDetailsAPI(payload);
  } catch (err: unknown) {
    return thunkAPI.rejectWithValue(extractErrorMessage(err));
  }
});

export const deleteCourseLesson = createAsyncThunk<
  { productId: string; sectionId: string; lessonId: string },
  RemoveLessonPayload,
  { rejectValue: string }
>('products/deleteCourseLesson', async (payload, thunkAPI) => {
  try {
    const lessonId = await deleteLessonAPI(payload);
    return {
      productId: payload.productId,
      sectionId: payload.sectionId,
      lessonId,
    };
  } catch (err: unknown) {
    return thunkAPI.rejectWithValue(extractErrorMessage(err));
  }
});

export const uploadDownloadSectionFile = createAsyncThunk<
  { productId: string; sectionId: string; file: FileDownloadProductResponse },
  UploadDownloadSectionFileRequest,
  { rejectValue: string }
>('products/uploadDownloadSectionFile', async (payload, thunkAPI) => {
  try {
    const file = await uploadDownloadSectionFileAPI(payload);
    return {
      productId: payload.productId,
      sectionId: payload.sectionId,
      file,
    };
  } catch (err: unknown) {
    return thunkAPI.rejectWithValue(extractErrorMessage(err));
  }
});

export const deleteDownloadSectionFile = createAsyncThunk<
  { productId: string; sectionId: string; fileId: string },
  { productId: string; sectionId: string; fileId: string },
  { rejectValue: string }
>('products/deleteDownloadSectionFile', async (payload, thunkAPI) => {
  try {
    const fileId = await deleteSectionFileAPI(
      payload.productId,
      payload.sectionId,
      payload.fileId,
    );
    return {
      ...payload,
      fileId,
    };
  } catch (err: unknown) {
    return thunkAPI.rejectWithValue(extractErrorMessage(err));
  }
});

export const getAllProductsByUserId = createAsyncThunk<
  AbstractProduct[],
  string,
  { rejectValue: string }
>('products/getAllProductsByUserId', async (userId, { rejectWithValue }) => {
  try {
    return await getAllProductsByUserIdAPI(userId);
  } catch (error: unknown) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const getProductSummariesByOwner = createAsyncThunk<
  ProductMinimised[],
  string,
  { rejectValue: string }
>('products/getProductSummariesByOwner', async (ownerId, { rejectWithValue }) => {
  try {
    return await getProductsByOwnerAPI(ownerId);
  } catch (error: unknown) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const addImageToProduct = createAsyncThunk<
  { productId: string; imageUrl: string },
  { productId: string; image: File },
  { rejectValue: string }
>(
  'products/addImageToProduct',
  async ({ productId, image }, { rejectWithValue }) => {
    try {
      const imageUrl = await addImageToProductAPI(image, productId);
      return { productId, imageUrl };
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error));
    }
  },
);

export const removeImageFromProduct = createAsyncThunk<
  { productId: string },
  { productId: string },
  { rejectValue: string }
>('products/removeImageFromProduct', async ({ productId }, { rejectWithValue }) => {
  try {
    await removeImageFromProductAPI(productId);
    return { productId };
  } catch (error: unknown) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const addProductGalleryImage = createAsyncThunk<
  { productId: string; image: ProductGalleryImage },
  { productId: string; image: File },
  { rejectValue: string }
>(
  'products/addProductGalleryImage',
  async ({ productId, image }, { rejectWithValue }) => {
    try {
      const galleryImage = await addProductGalleryImageAPI(productId, image);
      return { productId, image: galleryImage };
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error));
    }
  },
);

export const removeProductGalleryImage = createAsyncThunk<
  { productId: string; imageId: string },
  { productId: string; imageId: string },
  { rejectValue: string }
>(
  'products/removeProductGalleryImage',
  async ({ productId, imageId }, { rejectWithValue }) => {
    try {
      return await removeProductGalleryImageAPI(productId, imageId);
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error));
    }
  },
);

export const reorderProductGalleryImages = createAsyncThunk<
  { productId: string; images: ProductGalleryImage[] },
  { productId: string; imageIds: string[] },
  { rejectValue: string }
>(
  'products/reorderProductGalleryImages',
  async ({ productId, imageIds }, { rejectWithValue }) => {
    try {
      const images = await reorderProductGalleryImagesAPI(productId, imageIds);
      return { productId, images };
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error));
    }
  },
);

export const addProductPromoVideo = createAsyncThunk<
  { productId: string; promoVideo: ProductPromoVideo },
  { productId: string; video: File },
  { rejectValue: string }
>(
  'products/addProductPromoVideo',
  async ({ productId, video }, { rejectWithValue }) => {
    try {
      const promoVideo = await addProductPromoVideoAPI(productId, video);
      return { productId, promoVideo };
    } catch (error: unknown) {
      return rejectWithValue(extractErrorMessage(error));
    }
  },
);

export const removeProductPromoVideo = createAsyncThunk<
  { productId: string },
  { productId: string },
  { rejectValue: string }
>('products/removeProductPromoVideo', async ({ productId }, { rejectWithValue }) => {
  try {
    await removeProductPromoVideoAPI(productId);
    return { productId };
  } catch (error: unknown) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const getProductById = createAsyncThunk<
  AbstractProduct,
  { productId: string },
  { rejectValue: string }
>('products/getProductById', async ({ productId }, { rejectWithValue }) => {
  try {
    return await getProductByIdAPI(productId);
  } catch (error: unknown) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    clearCurrentProduct(state) {
      state.currentProduct = null;
      state.error = null;
    },

    deleteProductFromStore(state, action: PayloadAction<string>) {
      if (state.products) {
        state.products = state.products.filter(
          (product) => product.id !== action.payload,
        );
      }
      if (state.productSummaries) {
        state.productSummaries = state.productSummaries.filter(
          (product) => product.id !== action.payload,
        );
      }
      if (state.currentProduct?.id === action.payload) {
        state.currentProduct = null;
      }
    },

    deleteSectionFromStore(state, action: PayloadAction<string>) {
      if (
        state.currentProduct?.type === 'COURSE' ||
        state.currentProduct?.type === 'DOWNLOAD'
      ) {
        state.currentProduct.sections = removeSection(
          state.currentProduct.sections,
          action.payload,
        );
      }
    },

    deleteLessonFromStore(
      state,
      action: PayloadAction<{ sectionId: string; lessonId: string }>,
    ) {
      if (state.currentProduct?.type !== 'COURSE') {
        return;
      }

      const section = state.currentProduct.sections?.find(
        (sec) => sec.id === action.payload.sectionId,
      );

      if (section) {
        section.lessons = removeLesson(section.lessons, action.payload.lessonId);
      }
    },
  },

  extraReducers: (builder) => {
    builder
      .addCase(getAllProductsByUserId.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getAllProductsByUserId.fulfilled,
        (state, action: PayloadAction<AbstractProduct[]>) => {
          state.loading = false;
          state.products = action.payload;
        },
      )
      .addCase(getAllProductsByUserId.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error retrieving products';
      })

      .addCase(getProductSummariesByOwner.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getProductSummariesByOwner.fulfilled,
        (state, action: PayloadAction<ProductMinimised[]>) => {
          state.loading = false;
          state.productSummaries = action.payload;
        },
      )
      .addCase(getProductSummariesByOwner.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error retrieving product summaries';
      })

      .addCase(addImageToProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addImageToProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (state.currentProduct?.id === action.payload.productId) {
          state.currentProduct.imageUrl = action.payload.imageUrl;
        }
        state.products?.forEach((product) =>
          updateProductImage(
            product,
            action.payload.productId,
            action.payload.imageUrl,
          ),
        );
        state.productSummaries?.forEach((product) =>
          updateProductImage(
            product,
            action.payload.productId,
            action.payload.imageUrl,
          ),
        );
      })
      .addCase(addImageToProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error uploading image';
      })

      .addCase(removeImageFromProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeImageFromProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        if (state.currentProduct?.id === action.payload.productId) {
          state.currentProduct.imageUrl = undefined;
        }
        state.products?.forEach((product) =>
          updateProductImage(product, action.payload.productId, undefined),
        );
        state.productSummaries?.forEach((product) =>
          updateProductImage(product, action.payload.productId, undefined),
        );
      })
      .addCase(removeImageFromProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error removing image';
      })

      .addCase(addProductGalleryImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProductGalleryImage.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        if (state.currentProduct?.id === action.payload.productId) {
          const galleryImages = state.currentProduct.galleryImages ?? [];
          state.currentProduct.galleryImages = getOrderedGalleryImages([
            ...galleryImages,
            action.payload.image,
          ]);
        }
      })
      .addCase(addProductGalleryImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error adding gallery image';
      })

      .addCase(removeProductGalleryImage.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeProductGalleryImage.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        if (state.currentProduct?.id === action.payload.productId) {
          state.currentProduct.galleryImages = getOrderedGalleryImages(
            (state.currentProduct.galleryImages ?? []).filter(
              (image) => image.id !== action.payload.imageId,
            ),
          );
        }
      })
      .addCase(removeProductGalleryImage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error removing gallery image';
      })

      .addCase(reorderProductGalleryImages.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(reorderProductGalleryImages.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        if (state.currentProduct?.id === action.payload.productId) {
          state.currentProduct.galleryImages = getOrderedGalleryImages(
            action.payload.images,
          );
        }
      })
      .addCase(reorderProductGalleryImages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error reordering gallery images';
      })

      .addCase(addProductPromoVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProductPromoVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        if (state.currentProduct?.id === action.payload.productId) {
          state.currentProduct.promoVideo = action.payload.promoVideo;
        }
      })
      .addCase(addProductPromoVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error adding promo video';
      })

      .addCase(removeProductPromoVideo.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeProductPromoVideo.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;

        if (state.currentProduct?.id === action.payload.productId) {
          state.currentProduct.promoVideo = null;
        }
      })
      .addCase(removeProductPromoVideo.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Error removing promo video';
      })

      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createProduct.fulfilled,
        (state, action: PayloadAction<AbstractProduct>) => {
          state.loading = false;
          state.error = null;
          state.currentProduct = action.payload;
        },
      )
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateProductDetails.fulfilled,
        (state, action: PayloadAction<AbstractProduct>) => {
          state.loading = false;
          state.error = null;
          state.currentProduct = action.payload;
        },
      )
      .addCase(updateProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = null;
        state.products = state.products?.filter(
          (product) => product.id !== action.payload,
        ) ?? null;
        state.productSummaries = state.productSummaries?.filter(
          (product) => product.id !== action.payload,
        ) ?? null;
        if (state.currentProduct?.id === action.payload) {
          state.currentProduct = null;
        }
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createProductSection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createProductSection.fulfilled,
        (state, action: PayloadAction<ProductSection>) => {
          state.loading = false;
          state.error = null;

          if (
            state.currentProduct?.type === 'COURSE' ||
            state.currentProduct?.type === 'DOWNLOAD'
          ) {
            state.currentProduct.sections = replaceSection(
              state.currentProduct.sections,
              action.payload,
            );
          }
        },
      )
      .addCase(createProductSection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateProductSection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateProductSection.fulfilled,
        (state, action: PayloadAction<ProductSection>) => {
          state.loading = false;
          state.error = null;

          if (
            state.currentProduct?.type === 'COURSE' ||
            state.currentProduct?.type === 'DOWNLOAD'
          ) {
            state.currentProduct.sections = replaceSection(
              state.currentProduct.sections,
              action.payload,
            );
          }
        },
      )
      .addCase(updateProductSection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteProductSection.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteProductSection.fulfilled,
        (
          state,
          action: PayloadAction<{ productId: string; sectionId: string }>,
        ) => {
          state.loading = false;
          state.error = null;

          if (
            state.currentProduct?.type === 'COURSE' ||
            state.currentProduct?.type === 'DOWNLOAD'
          ) {
            state.currentProduct.sections = removeSection(
              state.currentProduct.sections,
              action.payload.sectionId,
            );
          }
        },
      )
      .addCase(deleteProductSection.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(createCourseLesson.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createCourseLesson.fulfilled,
        (state, action: PayloadAction<CourseLesson>) => {
          state.loading = false;
          state.error = null;

          if (state.currentProduct?.type !== 'COURSE') {
            return;
          }

          const section = state.currentProduct.sections?.find(
            (sec) => sec.id === action.payload.sectionId,
          );

          if (section) {
            section.lessons = replaceLesson(section.lessons, action.payload);
          }
        },
      )
      .addCase(createCourseLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(updateCourseLesson.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateCourseLesson.fulfilled,
        (state, action: PayloadAction<CourseLesson>) => {
          state.loading = false;
          state.error = null;

          if (state.currentProduct?.type !== 'COURSE') {
            return;
          }

          const section = state.currentProduct.sections?.find(
            (sec) => sec.id === action.payload.sectionId,
          );

          if (section) {
            section.lessons = replaceLesson(section.lessons, action.payload);
          }
        },
      )
      .addCase(updateCourseLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteCourseLesson.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteCourseLesson.fulfilled,
        (
          state,
          action: PayloadAction<{
            productId: string;
            sectionId: string;
            lessonId: string;
          }>,
        ) => {
          state.loading = false;
          state.error = null;

          if (state.currentProduct?.type !== 'COURSE') {
            return;
          }

          const section = state.currentProduct.sections?.find(
            (sec) => sec.id === action.payload.sectionId,
          );

          if (section) {
            section.lessons = removeLesson(section.lessons, action.payload.lessonId);
          }
        },
      )
      .addCase(deleteCourseLesson.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(uploadDownloadSectionFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        uploadDownloadSectionFile.fulfilled,
        (
          state,
          action: PayloadAction<{
            productId: string;
            sectionId: string;
            file: FileDownloadProductResponse;
          }>,
        ) => {
          state.loading = false;
          state.error = null;

          if (state.currentProduct?.type !== 'DOWNLOAD') {
            return;
          }

          const section = state.currentProduct.sections?.find(
            (sec) => sec.id === action.payload.sectionId,
          );

          if (section) {
            section.files = replaceFile(section.files, action.payload.file);
          }
        },
      )
      .addCase(uploadDownloadSectionFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(deleteDownloadSectionFile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteDownloadSectionFile.fulfilled,
        (
          state,
          action: PayloadAction<{
            productId: string;
            sectionId: string;
            fileId: string;
          }>,
        ) => {
          state.loading = false;
          state.error = null;

          if (state.currentProduct?.type !== 'DOWNLOAD') {
            return;
          }

          const section = state.currentProduct.sections?.find(
            (sec) => sec.id === action.payload.sectionId,
          );

          if (section) {
            section.files = removeFile(section.files, action.payload.fileId);
          }
        },
      )
      .addCase(deleteDownloadSectionFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      .addCase(getProductById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getProductById.fulfilled,
        (state, action: PayloadAction<AbstractProduct>) => {
          state.loading = false;
          state.error = null;
          state.currentProduct = action.payload;
        },
      )
      .addCase(getProductById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const createCourseProduct = createProduct;
export const updateCourseProductDetails = updateProductDetails;
export const createSection = createProductSection;
export const updateSectionDetails = updateProductSection;
export const deleteSection = deleteProductSection;
export const createLesson = createCourseLesson;
export const updateLessonDetails = updateCourseLesson;
export const deleteLesson = deleteCourseLesson;
export const getProductByProductId = getProductById;

export const {
  clearCurrentProduct,
  deleteProductFromStore,
  deleteSectionFromStore,
  deleteLessonFromStore,
} = productsSlice.actions;

export default productsSlice.reducer;
