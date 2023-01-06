import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {roles} from '../../../data/roles';
import {UserData} from '../../../data/users';
import {RootState} from '../../store/store';

const initialState: UserData = {
  userId: 0,
  name: '',
  email: '',
  password: '',
  role: '',
  birthDate: new Date(),
  avatar: '',
  projects: [],
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setUserLogged: (state, action: PayloadAction<UserData>) => {
      state.userId = action.payload.userId;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.birthDate = action.payload.birthDate;
      state.role = action.payload.role;
      state.avatar = action.payload.avatar;
      state.projects = action.payload.projects;
    },
  },
});

export const {setUserLogged} = loginSlice.actions;

export const selectUserLogged = (state: RootState) => state.login;

export default loginSlice.reducer;
