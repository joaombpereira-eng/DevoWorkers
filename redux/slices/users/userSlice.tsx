import {createSlice} from '@reduxjs/toolkit';
import {roles} from '../../../data/roles';
import {UserData} from '../../../data/users';
import {RootState} from '../../store/store';

const initialState: UserData = {
  id: 0,
  name: '',
  email: '',
  password: '',
  role: '',
  birthday: new Date(),
  avatar: '',
  project: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
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

export const {setUser} = userSlice.actions;

export const selectUser = (state: RootState) => state.user;

export default userSlice.reducer;
