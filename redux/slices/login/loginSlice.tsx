import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../../store/store';

type LoginState = {
  role: string;
  email: string;
};

const initialState: LoginState = {
  role: '',
  email: '',
};

const loginSlice = createSlice({
  name: 'role',
  initialState,
  reducers: {
    setUserLogged: (state, action) => {
      state.email = action.payload.email;
      state.role = action.payload.role;
    },
  },
});

export const {setUserLogged} = loginSlice.actions;

export const selectUserLogged = (state: RootState) => state.login;

export default loginSlice.reducer;
