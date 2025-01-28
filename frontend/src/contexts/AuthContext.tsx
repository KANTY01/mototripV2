import React, { createContext, useReducer, useCallback, useEffect } from 'react';
import { authApi } from '../services/api/auth';
import { User, LoginCredentials, RegisterData, ApiError } from '../types/auth';

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  isAuthenticated: boolean;
}

type AuthAction =
  | { type: 'INITIALIZE' }
  | { type: 'LOGIN_REQUEST' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'REGISTER_REQUEST' }
  | { type: 'REGISTER_SUCCESS'; payload: User }
  | { type: 'REGISTER_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: User };

const initialState: AuthState = {
  user: null,
  isLoading: true,
  isInitialized: false,
  error: null,
  isAuthenticated: false,
};

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'INITIALIZE':
      return {
        ...state,
        isInitialized: true,
        isLoading: false,
      };
    case 'LOGIN_REQUEST':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      };
    case 'REGISTER_REQUEST':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'REGISTER_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
        user: action.payload,
        error: null,
      };
    case 'REGISTER_FAILURE':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: false,
        user: null,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        isAuthenticated: false,
        user: null,
        error: null,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
};

export interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextValue>({
  ...initialState,
  login: async () => {},
  register: async () => {},
  logout: async () => {},
  updateUser: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  const initialize = useCallback(async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (token) {
        const user = await authApi.getCurrentUser();
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      }
    } catch (error) {
      localStorage.removeItem('accessToken');
    } finally {
      dispatch({ type: 'INITIALIZE' });
    }
  }, []);

  useEffect(() => {
    initialize();
  }, [initialize]);

  const login = useCallback(async (credentials: LoginCredentials) => {
    try {
      dispatch({ type: 'LOGIN_REQUEST' });
      const response = await authApi.login(credentials);
      localStorage.setItem('accessToken', response.accessToken);
      dispatch({ type: 'LOGIN_SUCCESS', payload: response.user });
    } catch (error) {
      const apiError = error as ApiError;
      dispatch({
        type: 'LOGIN_FAILURE',
        payload: apiError.response?.data.message || apiError.message || 'Login failed',
      });
      throw error;
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    try {
      dispatch({ type: 'REGISTER_REQUEST' });
      const response = await authApi.register(data);
      localStorage.setItem('accessToken', response.accessToken);
      dispatch({ type: 'REGISTER_SUCCESS', payload: response.user });
    } catch (error) {
      const apiError = error as ApiError;
      dispatch({
        type: 'REGISTER_FAILURE',
        payload: apiError.response?.data.message || apiError.message || 'Registration failed',
      });
      throw error;
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      localStorage.removeItem('accessToken');
      dispatch({ type: 'LOGOUT' });
    }
  }, []);

  const updateUser = useCallback((user: User) => {
    dispatch({ type: 'UPDATE_USER', payload: user });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext };
export default AuthProvider;
