import PropTypes from 'prop-types';
import { useContext, useEffect } from 'react';
import { UserContext } from '../contexts/userContext';
import { useNavigate, Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { socket } from '../utils/socket';

export default function AuthProvider({ condition = true }) {
  const { setUser } = useContext(UserContext);
  const nav = useNavigate();

  useEffect(() => {
    const username = localStorage.getItem("username");
    const id = localStorage.getItem("id");
    const imgUrl = localStorage.getItem("imgUrl");

    if (username && id && imgUrl) {
      setUser({
        id,
        username,
        imgUrl
      })
      socket.emit("user/new-user-username", { username });
      nav("/")
    } else {
      nav("/welcome")
    }

    socket.on("user/update-user-info", (user) => {
      setUser({
        id: user.id,
        username: user.username,
        imgUrl: `https://api.dicebear.com/9.x/personas/svg?backgroundColor=b6e3f4,c0aede,d1d4f9&&seed=${user.username}-${user.id}`
      });
      if (user.username) {
        localStorage.setItem("username", user.username);
        localStorage.setItem("id", user.id);
        localStorage.setItem("imgUrl", user.imgUrl);
        nav("/");
      }
    })
  }, [])

  return <>
    {condition && <Navbar />}
    <Outlet />
  </>
}

AuthProvider.propTypes = {
  condition: PropTypes.bool,
}