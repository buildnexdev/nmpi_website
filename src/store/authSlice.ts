import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOKEN_KEY, USER_KEY } from '../services/apiClient';

export interface SessionUser {
  id: number;
  email: string;
  phone_number: string;
  roles: string[];
  role_names: string[];
  member: { id: number; member_id: string; full_name: string; profile_image: string | null; status: string; role_name: string } | null;
}

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: SessionUser | null;
}

function readUser(): SessionUser | null {
  try {
    return JSON.parse(localStorage.getItem(USER_KEY) || 'null');
  } catch {
    return null;
  }
}

const initialToken = localStorage.getItem(TOKEN_KEY);

const initialState: AuthState = {
  token: initialToken,
  isAuthenticated: Boolean(initialToken),
  user: initialToken ? readUser() : null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (state, action: PayloadAction<{ token: string; user: SessionUser }>) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      localStorage.setItem(TOKEN_KEY, action.payload.token);
      localStorage.setItem(USER_KEY, JSON.stringify(action.payload.user));
    },
    setUser: (state, action: PayloadAction<SessionUser>) => {
      state.user = action.payload;
      localStorage.setItem(USER_KEY, JSON.stringify(action.payload));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    },
  },
});

export const { setCredentials, setUser, logout } = authSlice.actions;
export default authSlice.reducer;
