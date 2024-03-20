// useAuth.js

import { useSelector } from 'react-redux';

const useAuth = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  return isAuthenticated;
};

export default useAuth;
