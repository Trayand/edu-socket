import PropTypes from 'prop-types';
import { useContext, useEffect } from 'react';
import { UserContext } from '../contexts/userContext';
import { useNavigate, Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

export default function AuthProvider({ condition = true }) {
  const { user } = useContext(UserContext);
  const nav = useNavigate();

  useEffect(() => {
    if (condition) {
      if (!user.username) {
        nav("/welcome");
      }
    } else {
      if (user.username) {
        nav("/");
      }
    }
  }, [user])

  return <>
    {condition && <Navbar />}
    <Outlet />
  </>
}

AuthProvider.propTypes = {
  condition: PropTypes.bool,
}