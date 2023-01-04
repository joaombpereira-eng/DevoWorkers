import {configureStore} from '@reduxjs/toolkit';
import userReducer from '../slices/userSlice';
import usersListReducer from '../slices/usersListSlice';
import projectReducer from '../slices/projectSlice';
import projectsListReducer from '../slices/projectsListSlice';
import loginReducer from '../slices/loginSlice';
import logger from 'redux-logger';

export const store = configureStore({
  reducer: {
    user: userReducer,
    usersList: usersListReducer,
    project: projectReducer,
    projectsList: projectsListReducer,
    login: loginReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
    }).concat(logger),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
