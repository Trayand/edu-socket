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
    localStorage.removeItem('username');
    nav('/welcome');
  }

  return (
    <div className="navbar bg-neutral sticky top-0 px-20 z-10">
      <div className="navbar-start">
        <a className="btn btn-ghost text-xl text-white">MemeWar</a>
      </div>
      <div className="navbar-end">
        {
          user.username && (
            <div className="flex items-center mx-4 gap-2">
              <p className="text-white text-sm font-extralight">{user.username}</p>
              <img src={user.imgUrl} width={40} height={40} className='rounded' />
            </div>
            // <></>
          )
        }
        <div className='flex gap-2'>
          <a className="btn btn-sm btn-error" onClick={logout}>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0 1 10.5 3h6a2.25 2.25 0 0 1 2.25 2.25v13.5A2.25 2.25 0 0 1 16.5 21h-6a2.25 2.25 0 0 1-2.25-2.25V15m-3 0-3-3m0 0 3-3m-3 3H15" />
            </svg>
            
          </a>
        </div>
      </div>
    </div>
  )
}