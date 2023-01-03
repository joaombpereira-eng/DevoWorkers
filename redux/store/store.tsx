import {configureStore} from '@reduxjs/toolkit';
import userReducer from '../slices/userSlice';
import usersReducer from '../slices/usersSlice';
import projectReducer from '../slices/projectSlice';
import logger from 'redux-logger';

export const store = configureStore({
  reducer: {
    user: userReducer,
    project: projectReducer,
    users: usersReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(logger),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
