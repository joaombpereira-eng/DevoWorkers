import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {roles} from '../../data/roles';
import {UserData} from '../../data/users';
import {RootState} from '../store/store';

const initialState: UserData = {
  id: 0,
  name: '',
  email: '',
  password: '',
  role: roles[0],
  birthday: new Date(),
  avatar: '',
  project: [],
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setUserLogged: (state, action: PayloadAction<UserData>) => {
      state.id = action.payload.id;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.birthday = action.payload.birthday;
      state.role = action.payload.role;
      state.avatar = action.payload.avatar;
      state.project = action.payload.project;
    },
  },
});

export const {setUserLogged} = loginSlice.actions;

export const selectUserLogged = (state: RootState) => state.login;

export default loginSlice.reducer;
