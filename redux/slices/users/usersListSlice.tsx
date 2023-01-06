import {createSlice} from '@reduxjs/toolkit';
import {RootState} from '../../store/store';

export type UserData = {
  userId: number;
  name: string;
  email: string;
  password: string;
  role: string;
  birthDate: Date;
  avatar: string;
  projects: string[];
};

type UserState = {
  users: UserData[];
  loading: boolean;
  error: boolean;
};

const initialState: UserState = {
  users: [],
  loading: false,
  error: false,
};

const usersListSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.users = [...state.users, action.payload];
    },
    removeUser: (state, action) => {
      const index = state.users.findIndex(
        item => item.userId === action.payload.userId,
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
    setLoading: (state, action) => {
      state.loading = true;
    },
    setUsers: (state, action) => {
      state.loading = false;
      state.error = false;
      state.users = action.payload;
    },
    setError: state => {
      state.error = true;
    },
  },
});

export const {addUser, removeUser, setError, setLoading, setUsers} =
  usersListSlice.actions;

export const selectUsers = (state: RootState) => state.usersList;
export const selectUserById = (state: RootState, id: number) =>
  state.usersList.users.filter(item => item.userId === id);

export default usersListSlice.reducer;
