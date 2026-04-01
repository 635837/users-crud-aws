import { createSlice } from "@reduxjs/toolkit";

const usersSlice = createSlice({
  name: "users",
  initialState: {
    data: [],
    loading: false,
    error: null,
  },
  reducers: {
    fetchUsers: (state) => {
      state.loading = true;
    },
    fetchUsersSuccess: (state, action) => {
      state.data = action.payload;
      state.loading = false;
    },
    fetchUsersFailure: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },

    createUser: (state) => {
      state.loading = true;
    },
    updateUser: (state) => {
      state.loading = true;
    },
    deleteUser: (state) => {
      state.loading = true;
    },
  },
});

export const {
  fetchUsers,
  fetchUsersSuccess,
  fetchUsersFailure,
  createUser,
  updateUser,
  deleteUser,
} = usersSlice.actions;

export default usersSlice.reducer;