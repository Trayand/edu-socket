import {
  RouterProvider,
} from "react-router-dom";

import router from './router'
import UserContextProvider from './contexts/userContext';

import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { socket } from './utils/socket';
import { useEffect } from "react";
function App() {
  useEffect(() => {
    socket.on("error", (error) => {
      toast.error(error.message || "Something went wrong", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    })

    return () => {
      socket.emit("leave-all-rooms");
    }
  }, [])
  return (
    <UserContextProvider>
      <RouterProvider router={router} />
      <ToastContainer />
    </UserContextProvider>
  )
}

export default App
