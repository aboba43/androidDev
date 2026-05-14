import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  name: '',
  email: '',
  userTag: null,
  avatarUri: null,
  isRegistered: false,
  records: {
    bench: 0,
    squat: 0,
    deadlift: 0,
    bodyWeight: 0,
  },
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    registerUser: (state, action) => {
      state.name = action.payload.name;
      state.email = action.payload.email;
      state.userTag = action.payload.userTag;
      state.avatarUri = action.payload.avatarUri;
      state.isRegistered = true;
      if (action.payload.records) {
        state.records = action.payload.records;
      }
    },
    logoutUser: (state) => {
      state.name = '';
      state.email = '';
      state.userTag = null;
      state.avatarUri = null;
      state.isRegistered = false;
      state.records = { bench: 0, squat: 0, deadlift: 0, bodyWeight: 0 };
    },
    updateUserProfile: (state, action) => {
      state.name = action.payload.name;
      state.avatarUri = action.payload.avatarUri;
    },
    updateRecord: (state, action) => {
      const { exercise, value } = action.payload;
      if (state.records && exercise in state.records) {
        state.records[exercise] = value;
      }
    },
  },
});

export const { registerUser, logoutUser, updateUserProfile, updateRecord } = userSlice.actions;

export default userSlice.reducer;
