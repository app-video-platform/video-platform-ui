import productReducer, {
  createCourseLesson,
  createProductSection,
  deleteCourseLesson,
  deleteDownloadSectionFile,
  deleteProduct,
  deleteProductSection,
  getProductSummariesByOwner,
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
          { id: 'p1', name: 'Low', price: 10, type: 'COURSE' },
          { id: 'p2', name: 'High', price: 90, type: 'DOWNLOAD' },
          { id: 'p3', name: 'Free', price: 'free', type: 'COURSE' },
          { id: 'p4', name: 'Mid', price: 45, type: 'CONSULTATION' },
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
        { id: 'p1', name: 'Keep', price: 10 },
        { id: 'p2', name: 'Delete me', price: 20 },
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

  it('creates, updates, and deletes sections on the current non-consultation product', () => {
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
});
