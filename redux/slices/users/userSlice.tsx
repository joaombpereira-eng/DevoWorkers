import {createSlice} from '@reduxjs/toolkit';
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

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userId = action.payload.userId;
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.birthDate = action.payload.birthday;
      state.role = action.payload.role;
      state.avatar = action.payload.avatar;
      state.projects = action.payload.project;
    },
  },
});

export const {setUser} = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
