import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  email: '',
  avatarUri: null,
  isRegistered: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    registerUser: (state, action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.avatarUri = action.payload.avatarUri;
      state.isRegistered = true;
    },
    logoutUser: (state) => {
      state.name = '';
      state.email = '';
      state.avatarUri = null;
      state.isRegistered = false;
    },
    updateUserProfile: (state, action) => {
      state.name = action.payload.name;
      state.avatarUri = action.payload.avatarUri;
    },
  },
});

export const { registerUser, logoutUser, updateUserProfile } = userSlice.actions;

export default userSlice.reducer;
