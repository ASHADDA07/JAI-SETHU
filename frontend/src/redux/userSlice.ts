import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit'; // <--- The Fix is here

interface User {
  id: string;
  fullName: string;
  email: string;
  role: 'LAWYER' | 'STUDENT' | 'PUBLIC' | 'ADMIN';
  avatar?: string;
}

interface UserState {
  currentUser: User | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  currentUser: null,
  loading: false,
  error: null,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    signInStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    signInSuccess: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.loading = false;
      state.isAuthenticated = true;
      state.error = null;
    },
    signInFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    signOut: (state) => {
      state.currentUser = null;
      state.loading = false;
      state.isAuthenticated = false;
      state.error = null;
    },
    updateAvatar: (state, action: PayloadAction<string>) => {
        if (state.currentUser) {
            state.currentUser.avatar = action.payload;
        }
    }
  },
});

export const { signInStart, signInSuccess, signInFailure, signOut, updateAvatar } = userSlice.actions;
export default userSlice.reducer;