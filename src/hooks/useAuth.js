import { useSelector } from 'react-redux';
import { selectCurrentUser } from '../store/userSlice';

const useAuth = () => {
  const currentUser = useSelector(selectCurrentUser);
  return {
    isAuthenticated: Boolean(currentUser),
    currentUser,
  };
};

export default useAuth;
