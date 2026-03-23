import { useSelector, useDispatch } from 'react-redux';
import { useLoginMutation, useLogoutMutation } from '../api/userApi';
import { setUser, setAccessToken, logout as clearAuth } from '../app/authSlice';

export const useAuth = () => {
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [loginMutation] = useLoginMutation();
  const [logoutMutation] = useLogoutMutation();

  const login = async (credentials) => {
    try {
      const response = await loginMutation(credentials).unwrap();
      dispatch(setUser(response.data.user));
      dispatch(setAccessToken(response.data.accessToken));
      return response;
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      await logoutMutation().unwrap();
    } catch (error) {
      console.error('Logout error', error);
    } finally {
      dispatch(clearAuth());
    }
  };

  return {
    user,
    isAuthenticated,
    loading,
    login,
    logout,
  };
};
