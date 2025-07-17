import { createSlice } from '@reduxjs/toolkit';

// Safely retrieve user from localStorage
let userFromStorage = null;
try {
  const stored = localStorage.getItem('user');
  userFromStorage = stored && stored !== 'undefined' ? JSON.parse(stored) : null;
} catch (error) {
  userFromStorage = null;
}

const initialState = {
  userInfo: userFromStorage,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.userInfo = action.payload;
    },
    logout: (state) => {
      state.userInfo = null;
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
