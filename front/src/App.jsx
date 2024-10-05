import Login from "./components/Login";
import Signup from "./components/Signup";
import MainLayout from "./components/MainLayout";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Home } from "./components/Home";
import { Profile } from "./components/Profile";
import { NotFound } from "./Pages/NotFound";
import EditProfile from "./components/EditProfile";
import ChatPage from "./components/ChatPage";
import { io } from "socket.io-client";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { setSocket } from "./redux/SocketSlice";
import { setOnlineUser } from "./redux/ChatSlice";

function App() {

  const browserRouter = createBrowserRouter([
    {
      path: '/',
      element: <MainLayout />,
      children: [
        { path: "/", element: <Home /> },
        { path: "/profile/:id", element: <Profile /> },
        { path: "/account/editprofile", element: <EditProfile /> },
        { path: "/chat", element: <ChatPage /> },
      ],
    },
    { path: "/login", element: <Login /> },
    { path: "/signup", element: <Signup /> },
    { path: "*", element: <NotFound /> },
  ]);

  const { user } = useSelector((store) => store.auth);
  const { socket } = useSelector(store => store.socketio);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      const socketio = io('http://localhost:4000', {
        query: {
          userId: user?._id
        },
        transports: ['websocket']
      });
      dispatch(setSocket(socketio));

      // listen all the events
      socketio.on('getOnlineUsers', (onlineUsers) => {
        dispatch(setOnlineUser(onlineUsers));
      });

      socketio.on('notification', (notification) => {
        dispatch(setLikeNotification(notification));
      });

      return () => {
        socketio.close();
        dispatch(setSocket(null));
      }
    } else if (socket) {
      socket.close();
      dispatch(setSocket(null));
    }
  }, [user, dispatch]);
  return (
    <>
      <RouterProvider router={browserRouter} />
    </>
  );
}

export default App;
