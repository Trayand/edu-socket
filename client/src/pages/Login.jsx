import { useState, useContext, useEffect } from 'react';

import { socket } from '../utils/socket';

// import { useNavigate } from 'react-router-dom';

import { UserContext } from '../contexts/userContext';

export default function Login() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const { setUser } = useContext(UserContext);

  const handleInputUsername = (e) => {
    if (e.target.value.length > 12) return;
    setUsername(e.target.value);
  }

  const handleSubmitUsername = (e) => {
    e.preventDefault();
    setLoading(true);

    if (username.length <= 3) {
      return;
    }

    socket.emit("user/new-user-username", { username });
  }

  useEffect(() => {
    socket.on("user/new-user", (user) => {
      setLoading(true);
      setUser({
        id: user.id,
        username: user.username,
        imgUrl: ""
      });
      setLoading(false);
    })
  }, [])

  return (
    <div className="bg-neutral container-fluid h-screen w-screen flex justify-center items-center">
      <form className="min-w-60" onSubmit={handleSubmitUsername}>
        <label htmlFor="input-username" className="text-3xl text-white font-semibold">How do we call you ?</label>
        <input
          id="input-username"
          type="text"
          placeholder="Type username..."
          className="input input-bordered w-full mt-2"
          value={username}
          onChange={handleInputUsername}
        />
        <div className={'w-full flex justify-end ' + (username.length > 3 ? "visible" : "invisible")}>
          <button
            className="btn btn-link mt-2 text-white text-lg ml-96"
            type='submit'
            onClick={() => {
              if (!username) return;
              // setUser({ id: 1, username, imgUrl: `https://api.dicebear.com/9.x/personas/svg?backgroundColor=b6e3f4,c0aede,d1d4f9&&seed=${username}` });
            }}
          >
            {loading ? <span className="loading loading-dots loading-md"></span> : <p>Let&#39;s go</p>}
          </button>
        </div>
      </form>
    </div>
  )
}