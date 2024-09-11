import PropTypes from 'prop-types';

export default function RoomCard({ room }) {
  const { id, name, isPrivate, users } = room;

  const handleJoinRoom = () => {
    console.log("Joining room", id);
  }

  return (
    <div className="card bg-neutral text-white w-60">
      <div className="card-body">
        <h2 className="card-title text-ellipsis	max-w-full">{name}</h2>
        {/* Lock Icon */}
        {
          isPrivate &&
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
          </svg>}
        {/* Lock Icon */}
        <div className="card-actions justify-between items-center mt-auto pt-4">
          <p>{users.length}/4</p>
          <button className="btn btn-base-100" onClick={handleJoinRoom}>Join</button>
        </div>
      </div>
    </div>
  )
}

RoomCard.propTypes = {
  room: PropTypes.object,
  // room: {
  //   id: PropTypes.string,
  //   name: PropTypes.string,
  //   isPrivate: PropTypes.bool,
  //   users: PropTypes.arrayOf(PropTypes.shape({
  //     id: PropTypes.string,
  //     username: PropTypes.string,
  //     imgUrl: PropTypes.string,
  //   })),
  // },
}