import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {Role} from '../../data/roles';
import {users} from '../../data/users';
import {RootState} from '../store/store';

export type UserData = {
  id: number;
  name: string;
  email: string;
  password: string;
  role: Role;
  birthday: Date;
  avatar: string;
  project: string[];
};

type UserState = {
  users: UserData[];
};

const initialState: UserState = {
  users: users,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.users = [...state.users, action.payload];
    },
    removeUser: (state, action) => {
      const index = state.users.findIndex(
        item => item.id === action.payload.id,
      );

      let newUsers = [...state.users];

      if (index >= 0) {
        newUsers.splice(index, 1);
        state.users = newUsers;
      } else {
        console.warn(
          `Can't remove product (id: ${action.payload.id}) as its not in users list!`,
        );
      }
    },
  },
});

export const {addUser, removeUser} = usersSlice.actions;

export const selectUsers = (state: RootState) => state.users.users;
export const selectUserById = (state: RootState, id: number) =>
  state.users.users.filter(item => item.id === id);

export default usersSlice.reducer;
