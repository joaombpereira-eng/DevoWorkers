import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {UserData} from '../../../data/users';
import {RootState} from '../../store/store';

type LoginState = {
  email: string;
};

const initialState: LoginState = {
  email: '',
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setUserLogged: (state, action) => {
      state.email = action.payload.email;
    },
  },
});

export const {setUserLogged} = loginSlice.actions;

export const selectUserLogged = (state: RootState) => state.login;

export default loginSlice.reducer;
