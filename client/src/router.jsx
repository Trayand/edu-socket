import {
  createBrowserRouter,
} from "react-router-dom";
import Home from './pages/Home';
import Login from './pages/Login';
import GameRoom from './pages/GameRoom';
import AuthProvider from "./layouts/AuthProvider";

const router = createBrowserRouter([
  {
    path: "/welcome",
    element: <AuthProvider condition={false} />,
    children: [
      {
        index: true,
        element: <Login />
      }
    ],
  },
  {
    element: <AuthProvider />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/room/:id",
        element: <GameRoom />,
      },
    ]
  }
]);

export default router;