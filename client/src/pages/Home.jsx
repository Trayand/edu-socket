import { useEffect, useState, useContext } from 'react';
import { socket } from '../utils/socket';
import { UserContext } from '../contexts/userContext';
import RoomCard from '../components/RoomCard';
import RefreshIcon from '../components/RefreshIcon';

export default function Home() {
  const { user } = useContext(UserContext);
  const [rooms, setRooms] = useState([])

  useEffect(() => {
    console.log(user)
    socket.emit("room/get-rooms")
    const intervalGetRoom = setInterval(() => {
      socket.emit("room/get-rooms")
    }, 5000)

    socket.on("room/room-list", (rooms) => {
      setRooms(rooms)
    })

    return () => {
      clearInterval(intervalGetRoom)
    }
  }, [])

  return (
    <div className='min-h-svh w-full bg-base-100 text-accent px-24'>
      <div className='flex flex-col items-center justify-center h-full py-8'>
        <h1 className='text-5xl'>Welcome to MemeWar</h1>
        <h2 className='text-3xl'>The game where you can fight using memes and battle against your friends</h2>
        {/* <div className='flex gap-4 mt-4'>
          {
            user.username ? (
              <a href='/game-room' className='btn btn-primary'>Play</a>
            ) : (
              <a href='/welcome' className='btn btn-primary'>Login</a>
            )
          }
          <a href='/leaderboard' className='btn btn-ghost'>Leaderboard</a>
        </div> */}
      </div>
      <div className='h-full w-full mx-auto'>
        <div className='container-fluid flex justify-between items-center mb-6'>
          <div className='container flex gap-2 items-center'>
            <h3 className='text-xl text-accent'>Room list</h3>
            <RefreshIcon onClick={() => socket.emit("room/get-rooms")} className="border border-solid border-neutral cursor-pointer rounded p-1" />
          </div>
          <button className='btn btn-outline btn-accent'>+ Create Room</button>
        </div>
        <div className='flex flex-wrap gap-8 justify-center items-stretch'>
          {
            rooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))
          }
        </div>
      </div>
    </div>
  )
}