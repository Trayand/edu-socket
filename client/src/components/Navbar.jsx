import { UserContext } from '../contexts/userContext';
import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const { setUser, user } = useContext(UserContext);
  const nav = useNavigate();

  const logout = () => {
    setUser({
      username: '',
      imgUrl: '',
      id: null,
    });
    nav('/welcome');
  }

  return (
    <div className="navbar bg-neutral sticky top-0">
      <div className="navbar-start">
        <a className="btn btn-ghost text-xl text-white">MemeWar</a>
      </div>
      <div className="navbar-end">
        {
          user.username && (
            <div className="flex items-center mx-4 gap-2">
              <p className="text-white text-sm font-extralight">{user.username}</p>
              <img src={user.imgUrl} width={40} height={40} className='rounded'/>
            </div>
          )
        }
        <a className="btn btn-sm btn-error" onClick={logout}>Logout</a>
      </div>
    </div>
  )
}