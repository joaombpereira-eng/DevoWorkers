import {configureStore} from '@reduxjs/toolkit';
import userReducer from '../slices/userSlice';
import usersReducer from '../slices/usersSlice';
import projectReducer from '../slices/projectSlice';
import projectsReducer from '../slices/projectsSlice';
import loginReducer from '../slices/loginSlice';
import logger from 'redux-logger';

export const store = configureStore({
  reducer: {
    user: userReducer,
    users: usersReducer,
    project: projectReducer,
    projects: projectsReducer,
    login: loginReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(logger),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
