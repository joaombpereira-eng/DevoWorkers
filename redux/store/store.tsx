import {configureStore} from '@reduxjs/toolkit';
import userReducer from '../slices/users/userSlice';
import usersListReducer from '../slices/users/usersListSlice';
import projectReducer from '../slices/projects/projectSlice';
import projectsListReducer from '../slices/projects/projectsListSlice';
import loginReducer from '../slices/login/loginSlice';
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
