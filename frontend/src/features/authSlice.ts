import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: unknown | null;
  accessToken: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccessful: (state, action: PayloadAction<{ user: unknown; accessToken: string }>) => {
      state.user = action.payload.user;
      state.accessToken = action.payload?.accessToken || null;
    },
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
    },
    setAccessToken : (state,  action: PayloadAction<{ accessToken: string }>) => {
      state.accessToken = action.payload?.accessToken || null;
    }
  },
});

export const { loginSuccessful, logout, setAccessToken } = authSlice.actions;
export default authSlice.reducer; // ✅ important
