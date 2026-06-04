import { createListenerMiddleware } from '@reduxjs/toolkit';
import {
  createProduct,
  addImageToProduct,
  updateProductDetails,
  createProductSection,
  updateProductSection,
  createCourseLesson,
  updateCourseLesson,
} from '../product-store/product.slice';
import { addNotification } from '../notifications/notifications.slice';

export const setupProductListeners = (
  listenerMiddleware: ReturnType<typeof createListenerMiddleware>
) => {
  listenerMiddleware.startListening({
    actionCreator: createProduct.fulfilled,
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
    actionCreator: updateProductDetails.fulfilled,
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
    actionCreator: createProductSection.fulfilled,
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
    actionCreator: updateProductSection.fulfilled,
    effect: async (action, listenerApi) => {
      listenerApi.dispatch(
        addNotification({
          message: `Section ${action.payload.title} updated successfully!`,
          type: 'SUCCESS',
          title: 'Section Updated',
        })
      );
    },
  });

  listenerMiddleware.startListening({
    actionCreator: createCourseLesson.fulfilled,
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
    actionCreator: updateCourseLesson.fulfilled,
    effect: async (action, listenerApi) => {
      listenerApi.dispatch(
        addNotification({
          message: `Lesson ${action.payload.title} updated successfully!`,
          type: 'SUCCESS',
          title: 'Lesson Updated',
        })
      );
    },
  });
};
