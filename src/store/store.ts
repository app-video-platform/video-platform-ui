import { configureStore, createListenerMiddleware } from '@reduxjs/toolkit';
import authReducer, { addNotification } from './auth-store/auth.slice';
import productsReducer from './product-store/product.slice';

const listenerMiddleware = createListenerMiddleware();

// Start a listener that waits for a successful product creation
// listenerMiddleware.startListening({
//   actionCreator: createNewProduct.fulfilled, // Listen to the fulfilled action of the async thunk
//   effect: async (action, listenerApi) => {
//     const state = listenerApi.getState() as RootState;
//     const notifications = state.auth.notifications;

//     const { name } = action.payload;

//     const newId = notifications.length + 1;
//     // After a new product is successfully created, dispatch a notification
//     listenerApi.dispatch(addNotification({
//       id: newId,
//       message: `Your product ${name} has been created successfuly!`,
//       type: 'SUCCESS',
//       title: 'Product Created',
//       isRead: false,
//     }));

//     // If you want to perform additional asynchronous operations,
//     // you could do that here as well.
//   }
// });

export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().prepend(listenerMiddleware.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
