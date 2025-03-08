import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth.slice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

// store.subscribe(() => {
//   const state = store.getState();
//   console.log('state', state.auth);

//   const user = state.auth.user;

//   if (user) {
//     localStorage.setItem('firstName', user.firstName);
//     localStorage.setItem('lastName', user.lastName);
//     localStorage.setItem('email', user.email);
//     const roles = Array.isArray(user.role) ? user.role : [user.role];
//     localStorage.setItem('roles', roles.join(', '));
//   } else {
//     localStorage.removeItem('firstName');
//     localStorage.removeItem('lastName');
//     localStorage.removeItem('email');
//     localStorage.removeItem('roles');
//   }
// });

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;