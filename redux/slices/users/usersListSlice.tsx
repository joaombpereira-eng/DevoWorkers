import {createSlice} from '@reduxjs/toolkit';
import {UserData} from '../../../data/users';
import {RootState} from '../../store/store';

type UserState = {
  users: UserData[];
};

const initialState: UserState = {
  users: [],
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
    setUsers: (state, action) => {
      state.users = action.payload;
    },
  },
});

export const {addUser, removeUser, setUsers} = usersListSlice.actions;

export const selectUsers = (state: RootState) => state.usersList;
export const selectUserById = (state: RootState, id: number | undefined) =>
  state.usersList.users.filter(item => item.userId === id);

export default usersListSlice.reducer;
