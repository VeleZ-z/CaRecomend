import { createSlice } from '@reduxjs/toolkit';

export const defaultPreferences = {
  esRural: false,
  esManual: false,
  cantidadPasajeros: 5,
  rangoRuido: 'equilibrado',
  precioMin: 25000,
  precioMax: 45000,
  propulsion: 0,
};

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
        const currentPreferences =
          state.currentUser.preferences && typeof state.currentUser.preferences === 'object'
            ? state.currentUser.preferences
            : {};
        state.currentUser.preferences = {
          ...defaultPreferences,
          ...currentPreferences,
          ...action.payload,
        };
      }
    },
  },
});

export const { login, logout, updatePreferences } = userSlice.actions;
export const selectCurrentUser = (state) => state.user.currentUser;

export default userSlice.reducer;
