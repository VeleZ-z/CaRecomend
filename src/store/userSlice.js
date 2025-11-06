import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentUser: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login(state, action) {
      state.currentUser = action.payload;
    },
    logout(state) {
      state.currentUser = null;
    },
    updatePreferences(state, action) {
      if (state.currentUser) {
        state.currentUser.preferences = action.payload;
      }
    },
  },
});

export const { login, logout, updatePreferences } = userSlice.actions;
export const selectCurrentUser = (state) => state.user.currentUser;

export default userSlice.reducer;
