import { useContext, useEffect, useState } from "react"
import { socket } from "../utils/socket"
import { useNavigate, useParams } from "react-router"
import { UserContext } from "../contexts/userContext"
import PlayerGameCard from "../components/PlayerGameCard"
import GameBoard from "../components/GameBoard"

export default function GameRoom() {
  const { id } = useParams()
  const nav = useNavigate()
  const [room, setRoom] = useState({
    id: "",
    name: "",
    users: [],
    isPrivate: null,
    password: ""
  })

  const { user } = useContext(UserContext)

  useEffect(() => {
    socket.emit("room/room-info", { id })

    socket.on("room/room-info", (room) => {
      setRoom(room)
      console.log(room)
    })

    socket.on("room/user-joined", (room) => {
      setRoom(room)
    })

    socket.on("game/user-ready", (users) => {
      setRoom((prev) => ({
        ...prev,
        users
      }))
    })

    return () => {
      console.log("GameRoom unmounted")
      socket.emit("room/leave-room", { id })
    }
  }, [])

  // Next, Gameplay
  /* 
  - add counter when all player are ready
  - when start, Server will hit API to get random word
  - server hit tenor to get several gif based on the word
  - server will send the gif and total word (maybe clue) to all player
  - player will guess the word
  - if player guess the word right, they will get point
  - if player guess the word wrong, they should type the next answer
  - when someone guess the word right, the word will be spill and the guy will got point
  - the game will continue to the next word until 10 words
  - the player with the most point will win the game
  */


  const startGame = () => {
    socket.emit("game/user-state-ready", { id })
  }

  const leaveRoom = () => {
    socket.emit("room/leave-room", { id })
    nav("/")
  }

  const changeStatus = room.users.find((u) => u.id === user.id)?.isReady
    ? <p onClick={startGame} className="btn btn-error text-white px-2 rounded-md w-28 mr-4">Cancel</p>
    : <p onClick={startGame} className="btn btn-secondary text-white px-2 rounded-md w-28 mr-4">Ready</p>

  return (
    <div className="container-fluid p-6 text-accent px-24">
      <div className="container-fluid flex justify-between items-center w-full">
        <h1 className="text-3xl">{room.name}</h1>
        <div className="container flex justify-end ms-auto">
          {room.users.length >= 2 && changeStatus}
          <p onClick={leaveRoom} className="text-red-500 hover:underline p-2 rounded-md cursor-pointer">leave room</p>
        </div>
      </div>
      <div className="divider"></div>
      <div className="container flex flex-row">
        <div className="container-fluid flex flex-col justify-start gap-4 overflow-auto w-1/12">
          {
            room.users.map((userData) => <PlayerGameCard key={userData.id} userData={userData} />)
          }
        </div>
        <div className="divider lg:divider-horizontal h-full"></div>
        <div className="container">
          <GameBoard />
        </div>
      </div>
    </div>
  )
}