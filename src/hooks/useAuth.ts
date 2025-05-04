import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../store';
import { loginUser, registerUser, logoutUser } from '../store/authSlice';
import { LoginRequest, RegisterRequest } from '../types';

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useSelector(
    (state: RootState) => state.auth
  );

  const login = (credentials: LoginRequest) => {
    return dispatch(loginUser(credentials));
  };

  const register = (userData: RegisterRequest) => {
    return dispatch(registerUser(userData));
  };

  const logout = () => {
    dispatch(logoutUser());
  };

  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
  };
};

export default useAuth;