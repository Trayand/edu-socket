import PropTypes from 'prop-types';
import { UserContext } from '../contexts/userContext';
import { useContext } from 'react';

export default function PlayerGameCard({ userData }) {
  console.log(userData)
  const { user } = useContext(UserContext)
  return <div key={userData.id} className="container relative flex flex-col items-center justify-between gap-2 rounded-lg w-[90px] h-[90px]">
    {userData.isReady && <div className="badge badge-xs badge-secondary absolute right-0">&#10004;</div>}
    <img src={userData.imgUrl} className="rounded w-full" />
    <p className={(user.id == userData.id ? "text-secondary" : "text-neutral") + " font-extrabold -mt-8 w-full text-sm text-center rounded bg-white bg-opacity-60"}>{userData.username}</p>
  </div>
}

PlayerGameCard.propTypes = {
  userData: PropTypes.object.isRequired
}