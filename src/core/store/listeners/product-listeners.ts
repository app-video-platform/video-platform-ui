import { createListenerMiddleware } from '@reduxjs/toolkit';
import {
  createCourseProduct,
  addImageToProduct,
  updateCourseProductDetails,
  createSection,
  updateSectionDetails,
  createLesson,
  updateLessonDetails,
} from '../product-store/product.slice';
import { addNotification } from '../notifications/notifications.slice';

export const setupProductListeners = (
  listenerMiddleware: ReturnType<typeof createListenerMiddleware>
) => {
  listenerMiddleware.startListening({
    actionCreator: createCourseProduct.fulfilled,
    effect: async (action, listenerApi) => {
      const { name } = action.payload;
      listenerApi.dispatch(
        addNotification({
          message: `Your product ${name} has been created successfully!`,
          type: 'SUCCESS',
          title: 'Product Created',
        })
      );
    },
  });

  listenerMiddleware.startListening({
    actionCreator: addImageToProduct.fulfilled,
    effect: async (action, listenerApi) => {
      listenerApi.dispatch(
        addNotification({
          message: action.payload,
          type: 'SUCCESS',
          title: 'Image Upload',
        })
      );
    },
  });

  listenerMiddleware.startListening({
    actionCreator: updateCourseProductDetails.fulfilled,
    effect: async (action, listenerApi) => {
      const { name } = action.payload;
      listenerApi.dispatch(
        addNotification({
          message: `Product ${name} updated successfully!`,
          type: 'SUCCESS',
          title: 'Product Updated',
        })
      );
    },
  });

  listenerMiddleware.startListening({
    actionCreator: createSection.fulfilled,
    effect: async (action, listenerApi) => {
      const { title } = action.payload;
      listenerApi.dispatch(
        addNotification({
          message: `Section ${title} created successfully!`,
          type: 'SUCCESS',
          title: 'Section Created',
        })
      );
    },
  });

  listenerMiddleware.startListening({
    actionCreator: updateSectionDetails.fulfilled,
    effect: async (action, listenerApi) => {
      listenerApi.dispatch(
        addNotification({
          message: action.payload,
          type: 'SUCCESS',
          title: 'Section Updated',
        })
      );
    },
  });

  listenerMiddleware.startListening({
    actionCreator: createLesson.fulfilled,
    effect: async (action, listenerApi) => {
      const { title } = action.payload;
      listenerApi.dispatch(
        addNotification({
          message: `Lesson ${title} created successfully!`,
          type: 'SUCCESS',
          title: 'Lesson Created',
        })
      );
    },
  });

  listenerMiddleware.startListening({
    actionCreator: updateLessonDetails.fulfilled,
    effect: async (action, listenerApi) => {
      listenerApi.dispatch(
        addNotification({
          message: action.payload,
          type: 'SUCCESS',
          title: 'Lesson Updated',
        })
      );
    },
  });
};
