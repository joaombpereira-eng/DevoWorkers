import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {UserData} from '../../../data/users';
import {RootState} from '../../store/store';

type LoginState = {
  role: string;
};

const initialState: LoginState = {
  role: '',
};

const loginSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    setUserLogged: (state, action) => {
      state.role = action.payload;
    },
  },
});

export const {setUserLogged} = loginSlice.actions;

export const selectUserLogged = (state: RootState) => state.login;

export default loginSlice.reducer;
