import productReducer, {
  addImageToProduct,
  addProductGalleryImage,
  addProductPromoVideo,
  createCourseLesson,
  createProductSection,
  deleteCourseLesson,
  deleteDownloadSectionFile,
  deleteProduct,
  deleteProductSection,
  getProductSummariesByOwner,
  removeImageFromProduct,
  removeProductGalleryImage,
  removeProductPromoVideo,
  reorderProductGalleryImages,
  updateCourseLesson,
  updateProductSection,
  uploadDownloadSectionFile,
} from './product.slice';
import {
  selectProductSummaries,
  selectTopThreeProducts,
} from './product.selectors';

describe('product slice', () => {
  const makeState = () =>
    productReducer(undefined, {
      type: '@@INIT',
    });

  it('stores product summaries and top-three selector sorts by price descending', () => {
    const state = productReducer(
      makeState(),
      getProductSummariesByOwner.fulfilled(
        [
          { id: 'p1', title: 'Low', price: 10, type: 'COURSE' },
          { id: 'p2', title: 'High', price: 90, type: 'DOWNLOAD' },
          { id: 'p3', title: 'Free', price: 'free', type: 'COURSE' },
          { id: 'p4', title: 'Mid', price: 45, type: 'CONSULTATION' },
        ],
        'req-1',
        'owner-1',
      ),
    );

    const rootState = {
      products: state,
    } as any;

    expect(selectProductSummaries(rootState)).toEqual([
      expect.objectContaining({ id: 'p1' }),
      expect.objectContaining({ id: 'p2' }),
      expect.objectContaining({ id: 'p3' }),
      expect.objectContaining({ id: 'p4' }),
    ]);
    expect(selectTopThreeProducts(rootState).map((product) => product.id)).toEqual([
      'p2',
      'p4',
      'p1',
    ]);
  });

  it('removes a deleted product from products, summaries, and currentProduct', () => {
    const initialState = {
      ...makeState(),
      products: [
        { id: 'p1', name: 'Keep', type: 'COURSE' },
        { id: 'p2', name: 'Delete me', type: 'DOWNLOAD' },
      ],
      productSummaries: [
        { id: 'p1', title: 'Keep', price: 10 },
        { id: 'p2', title: 'Delete me', price: 20 },
      ],
      currentProduct: { id: 'p2', name: 'Delete me', type: 'DOWNLOAD' },
    } as any;

    const nextState = productReducer(
      initialState,
      deleteProduct.fulfilled('p2', 'req-2', { productId: 'p2' }),
    );

    expect(nextState.products).toEqual([
      expect.objectContaining({ id: 'p1' }),
    ]);
    expect(nextState.productSummaries).toEqual([
      expect.objectContaining({ id: 'p1' }),
    ]);
    expect(nextState.currentProduct).toBeNull();
  });

  it('creates, updates, and deletes sections on the current section-based product', () => {
    const initialState = {
      ...makeState(),
      currentProduct: {
        id: 'course-1',
        type: 'COURSE',
        name: 'Course',
        sections: [
          {
            id: 'section-1',
            title: 'Intro',
            position: 1,
            lessons: [],
          },
        ],
      },
    } as any;

    const afterCreate = productReducer(
      initialState,
      createProductSection.fulfilled(
        {
          id: 'section-2',
          title: 'Module 1',
          position: 2,
          lessons: [],
        },
        'req-3',
        {
          productId: 'course-1',
          title: 'Module 1',
        } as any,
      ),
    );

    expect(afterCreate.currentProduct?.sections).toHaveLength(2);

    const afterUpdate = productReducer(
      afterCreate,
      updateProductSection.fulfilled(
        {
          id: 'section-2',
          title: 'Module One',
          description: 'Updated',
          position: 2,
          lessons: [],
        },
        'req-4',
        {
          productId: 'course-1',
          sectionId: 'section-2',
        } as any,
      ),
    );

    expect(afterUpdate.currentProduct?.sections?.find((section) => section.id === 'section-2'))
      .toEqual(
        expect.objectContaining({
          title: 'Module One',
          description: 'Updated',
        }),
      );

    const afterDelete = productReducer(
      afterUpdate,
      deleteProductSection.fulfilled(
        {
          productId: 'course-1',
          sectionId: 'section-1',
        },
        'req-5',
        {
          productId: 'course-1',
          sectionId: 'section-1',
        },
      ),
    );

    expect(afterDelete.currentProduct?.sections).toEqual([
      expect.objectContaining({ id: 'section-2' }),
    ]);
  });

  it('does not create sections on a Membership product', () => {
    const initialState = {
      ...makeState(),
      currentProduct: {
        id: 'membership-1',
        type: 'MEMBERSHIP',
        name: 'Membership',
      },
    } as any;

    const nextState = productReducer(
      initialState,
      createProductSection.fulfilled(
        {
          id: 'section-1',
          title: 'Should not attach',
          position: 1,
        },
        'req-membership-section',
        {
          productId: 'membership-1',
          title: 'Should not attach',
        } as any,
      ),
    );

    expect(nextState.currentProduct).toEqual({
      id: 'membership-1',
      type: 'MEMBERSHIP',
      name: 'Membership',
    });
  });

  it('creates, updates, and deletes lessons inside the matching course section', () => {
    const initialState = {
      ...makeState(),
      currentProduct: {
        id: 'course-1',
        type: 'COURSE',
        name: 'Course',
        sections: [
          {
            id: 'section-1',
            title: 'Intro',
            position: 1,
            lessons: [
              {
                id: 'lesson-1',
                title: 'Welcome',
                description: '',
                sectionId: 'section-1',
                type: 'VIDEO',
              },
            ],
          },
        ],
      },
    } as any;

    const afterCreate = productReducer(
      initialState,
      createCourseLesson.fulfilled(
        {
          id: 'lesson-2',
          title: 'Setup',
          description: '',
          sectionId: 'section-1',
          type: 'ARTICLE',
        },
        'req-6',
        {
          productId: 'course-1',
          sectionId: 'section-1',
        } as any,
      ),
    );

    expect(
      afterCreate.currentProduct?.sections?.[0]?.lessons?.map(
        (lesson: any) => lesson.id,
      ),
    ).toEqual(['lesson-1', 'lesson-2']);

    const afterUpdate = productReducer(
      afterCreate,
      updateCourseLesson.fulfilled(
        {
          id: 'lesson-2',
          title: 'Setup Updated',
          description: 'Edited',
          sectionId: 'section-1',
          type: 'ARTICLE',
        },
        'req-7',
        {
          id: 'lesson-2',
          productId: 'course-1',
          sectionId: 'section-1',
        } as any,
      ),
    );

    expect(
      afterUpdate.currentProduct?.sections?.[0]?.lessons?.find(
        (lesson: any) => lesson.id === 'lesson-2',
      ),
    ).toEqual(
      expect.objectContaining({
        title: 'Setup Updated',
        description: 'Edited',
      }),
    );

    const afterDelete = productReducer(
      afterUpdate,
      deleteCourseLesson.fulfilled(
        {
          productId: 'course-1',
          sectionId: 'section-1',
          lessonId: 'lesson-1',
        },
        'req-8',
        {
          productId: 'course-1',
          sectionId: 'section-1',
          lessonId: 'lesson-1',
        } as any,
      ),
    );

    expect(afterDelete.currentProduct?.sections?.[0]?.lessons).toEqual([
      expect.objectContaining({ id: 'lesson-2' }),
    ]);
  });

  it('adds, replaces, and deletes files inside the matching download section', () => {
    const initialState = {
      ...makeState(),
      currentProduct: {
        id: 'download-1',
        type: 'DOWNLOAD',
        name: 'Download',
        sections: [
          {
            id: 'section-1',
            title: 'Assets',
            position: 1,
            files: [
              {
                id: 'file-1',
                fileName: 'starter.zip',
                fileType: 'application/zip',
              },
            ],
          },
        ],
      },
    } as any;

    const afterCreate = productReducer(
      initialState,
      uploadDownloadSectionFile.fulfilled(
        {
          productId: 'download-1',
          sectionId: 'section-1',
          file: {
            id: 'file-2',
            fileName: 'bonus.zip',
            fileType: 'application/zip',
          },
        },
        'req-9',
        {
          productId: 'download-1',
          sectionId: 'section-1',
        } as any,
      ),
    );

    expect(afterCreate.currentProduct?.sections?.[0]?.files).toEqual([
      expect.objectContaining({ id: 'file-1' }),
      expect.objectContaining({ id: 'file-2' }),
    ]);

    const afterReplace = productReducer(
      afterCreate,
      uploadDownloadSectionFile.fulfilled(
        {
          productId: 'download-1',
          sectionId: 'section-1',
          file: {
            id: 'file-2',
            fileName: 'bonus-v2.zip',
            fileType: 'application/zip',
          },
        },
        'req-10',
        {
          productId: 'download-1',
          sectionId: 'section-1',
        } as any,
      ),
    );

    expect(
      afterReplace.currentProduct?.sections?.[0]?.files?.find(
        (file: any) => file.id === 'file-2',
      ),
    ).toEqual(
      expect.objectContaining({
        fileName: 'bonus-v2.zip',
      }),
    );

    const afterDelete = productReducer(
      afterReplace,
      deleteDownloadSectionFile.fulfilled(
        {
          productId: 'download-1',
          sectionId: 'section-1',
          fileId: 'file-1',
        },
        'req-11',
        {
          productId: 'download-1',
          sectionId: 'section-1',
          fileId: 'file-1',
        },
      ),
    );

    expect(afterDelete.currentProduct?.sections?.[0]?.files).toEqual([
      expect.objectContaining({ id: 'file-2' }),
    ]);
  });

  it('updates Product thumbnail state across current product, products, and summaries', () => {
    const initialState = {
      ...makeState(),
      currentProduct: { id: 'p1', name: 'Product', type: 'COURSE' },
      products: [
        { id: 'p1', name: 'Product', type: 'COURSE' },
        { id: 'p2', name: 'Other', type: 'DOWNLOAD', imageUrl: 'keep.jpg' },
      ],
      productSummaries: [
        { id: 'p1', title: 'Product' },
        { id: 'p2', title: 'Other', imageUrl: 'keep.jpg' },
      ],
    } as any;

    const afterUpload = productReducer(
      initialState,
      addImageToProduct.fulfilled(
        {
          productId: 'p1',
          imageUrl: 'https://cdn.example.com/thumb.jpg',
        },
        'req-thumb',
        {
          productId: 'p1',
          image: new File(['thumb'], 'thumb.jpg', { type: 'image/jpeg' }),
        },
      ),
    );

    expect(afterUpload.currentProduct?.imageUrl).toBe(
      'https://cdn.example.com/thumb.jpg',
    );
    expect(afterUpload.products?.find((product: any) => product.id === 'p1'))
      .toEqual(expect.objectContaining({
        imageUrl: 'https://cdn.example.com/thumb.jpg',
      }));
    expect(
      afterUpload.productSummaries?.find((product: any) => product.id === 'p1'),
    ).toEqual(expect.objectContaining({
      imageUrl: 'https://cdn.example.com/thumb.jpg',
    }));

    const afterRemove = productReducer(
      afterUpload,
      removeImageFromProduct.fulfilled(
        { productId: 'p1' },
        'req-remove-thumb',
        { productId: 'p1' },
      ),
    );

    expect(afterRemove.currentProduct?.imageUrl).toBeUndefined();
    expect(afterRemove.products?.find((product: any) => product.id === 'p1'))
      .toEqual(expect.objectContaining({
        imageUrl: undefined,
      }));
    expect(
      afterRemove.productSummaries?.find((product: any) => product.id === 'p1'),
    ).toEqual(expect.objectContaining({
      imageUrl: undefined,
    }));
  });

  it('updates Product gallery and promo video state on media thunks', () => {
    const initialState = {
      ...makeState(),
      currentProduct: {
        id: 'p1',
        name: 'Product',
        type: 'COURSE',
        galleryImages: [
          {
            id: 'gallery-1',
            url: 'https://cdn.example.com/one.jpg',
            position: 1,
          },
        ],
      },
    } as any;
    const secondImage = {
      id: 'gallery-2',
      url: 'https://cdn.example.com/two.jpg',
      position: 2,
      status: 'READY' as const,
    };

    const afterGalleryAdd = productReducer(
      initialState,
      addProductGalleryImage.fulfilled(
        { productId: 'p1', image: secondImage },
        'req-gallery',
        {
          productId: 'p1',
          image: new File(['two'], 'two.jpg', { type: 'image/jpeg' }),
        },
      ),
    );

    expect(afterGalleryAdd.currentProduct?.galleryImages).toEqual([
      expect.objectContaining({ id: 'gallery-1', position: 1 }),
      expect.objectContaining({ id: 'gallery-2', position: 2 }),
    ]);

    const afterGalleryReorder = productReducer(
      afterGalleryAdd,
      reorderProductGalleryImages.fulfilled(
        {
          productId: 'p1',
          images: [
            { ...secondImage, position: 1 },
            {
              id: 'gallery-1',
              url: 'https://cdn.example.com/one.jpg',
              position: 2,
            },
          ],
        },
        'req-reorder-gallery',
        {
          productId: 'p1',
          imageIds: ['gallery-2', 'gallery-1'],
        },
      ),
    );

    expect(
      afterGalleryReorder.currentProduct?.galleryImages?.map(
        (image: any) => image.id,
      ),
    ).toEqual(['gallery-2', 'gallery-1']);

    const afterGalleryRemove = productReducer(
      afterGalleryReorder,
      removeProductGalleryImage.fulfilled(
        {
          productId: 'p1',
          imageId: 'gallery-2',
        },
        'req-remove-gallery',
        {
          productId: 'p1',
          imageId: 'gallery-2',
        },
      ),
    );

    expect(afterGalleryRemove.currentProduct?.galleryImages).toEqual([
      expect.objectContaining({ id: 'gallery-1', position: 1 }),
    ]);

    const promoVideo = {
      id: 'promo-1',
      url: 'https://cdn.example.com/promo.mp4',
      fileName: 'promo.mp4',
      status: 'READY' as const,
    };
    const afterPromoUpload = productReducer(
      afterGalleryRemove,
      addProductPromoVideo.fulfilled(
        {
          productId: 'p1',
          promoVideo,
        },
        'req-promo',
        {
          productId: 'p1',
          video: new File(['promo'], 'promo.mp4', { type: 'video/mp4' }),
        },
      ),
    );

    expect(afterPromoUpload.currentProduct?.promoVideo).toEqual(promoVideo);

    const afterPromoRemove = productReducer(
      afterPromoUpload,
      removeProductPromoVideo.fulfilled(
        { productId: 'p1' },
        'req-remove-promo',
        { productId: 'p1' },
      ),
    );

    expect(afterPromoRemove.currentProduct?.promoVideo).toBeNull();
  });
});
