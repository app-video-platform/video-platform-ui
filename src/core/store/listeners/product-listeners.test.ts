import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';

import notificationsReducer from '../notifications/notifications.slice';
import { setupProductListeners } from './product-listeners';
import {
  addImageToProduct,
  createCourseLesson,
  createProduct,
  createProductSection,
  updateCourseLesson,
  updateProductDetails,
  updateProductSection,
} from '../product-store';

describe('product listeners', () => {
  const makeStore = () => {
    const listenerMiddleware = createListenerMiddleware();
    setupProductListeners(listenerMiddleware);

    return configureStore({
      reducer: {
        notifications: notificationsReducer,
      },
      middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().prepend(listenerMiddleware.middleware),
    });
  };

  it('dispatches success notifications for create and update product flows', async () => {
    const store = makeStore();

    store.dispatch(
      createProduct.fulfilled(
        {
          id: 'product-1',
          name: 'Masterclass',
          type: 'COURSE',
        } as any,
        'req-1',
        {} as any,
      ),
    );
    store.dispatch(
      updateProductDetails.fulfilled(
        {
          id: 'product-1',
          name: 'Masterclass',
          type: 'COURSE',
        } as any,
        'req-2',
        {} as any,
      ),
    );
    store.dispatch(addImageToProduct.fulfilled('Image updated', 'req-3', {} as any));

    await Promise.resolve();

    expect(store.getState().notifications.notifications).toEqual([
      expect.objectContaining({
        title: 'Product Created',
        message: 'Your product Masterclass has been created successfully!',
        type: 'SUCCESS',
      }),
      expect.objectContaining({
        title: 'Product Updated',
        message: 'Product Masterclass updated successfully!',
        type: 'SUCCESS',
      }),
      expect.objectContaining({
        title: 'Image Upload',
        message: 'Image updated',
        type: 'SUCCESS',
      }),
    ]);
  });

  it('dispatches section notifications with the section title in both messages', async () => {
    const store = makeStore();

    store.dispatch(
      createProductSection.fulfilled(
        {
          id: 'section-1',
          title: 'Chapter 1',
          position: 1,
        } as any,
        'req-4',
        {} as any,
      ),
    );
    store.dispatch(
      updateProductSection.fulfilled(
        {
          id: 'section-1',
          title: 'Chapter 1 Revised',
          position: 1,
        } as any,
        'req-5',
        {} as any,
      ),
    );

    await Promise.resolve();

    expect(store.getState().notifications.notifications).toEqual([
      expect.objectContaining({
        title: 'Section Created',
        message: 'Section Chapter 1 created successfully!',
      }),
      expect.objectContaining({
        title: 'Section Updated',
        message: 'Section Chapter 1 Revised updated successfully!',
      }),
    ]);
  });

  it('dispatches lesson notifications with the lesson title in both messages', async () => {
    const store = makeStore();

    store.dispatch(
      createCourseLesson.fulfilled(
        {
          id: 'lesson-1',
          title: 'Lesson A',
          description: '',
          sectionId: 'section-1',
          type: 'VIDEO',
        } as any,
        'req-6',
        {} as any,
      ),
    );
    store.dispatch(
      updateCourseLesson.fulfilled(
        {
          id: 'lesson-1',
          title: 'Lesson A Updated',
          description: '',
          sectionId: 'section-1',
          type: 'VIDEO',
        } as any,
        'req-7',
        {} as any,
      ),
    );

    await Promise.resolve();

    expect(store.getState().notifications.notifications).toEqual([
      expect.objectContaining({
        title: 'Lesson Created',
        message: 'Lesson Lesson A created successfully!',
      }),
      expect.objectContaining({
        title: 'Lesson Updated',
        message: 'Lesson Lesson A Updated updated successfully!',
      }),
    ]);
  });
});
