import logo from "./logo.svg";
import "./App.css";
import UIkit from "uikit";
import "../src/assets/css/style.css";
import "../src/assets/css/tailwind.css";
import { Routes, Route, useLocation } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import AuthContext from "./context/Auth";
import Sidebar from "./components/Sidebar";
import User from "./components/User";
import Home from "./components/Home";
import Profile from "./components/Profile";
import {createContext, useContext } from "react";
import Settings from "./components/Settings";
import Explore from "./components/Explore";
import Loader from "./components/Loader";
import FuturePeek from "./components/FuturePeek";
function App() {
  const { user,loading } = useContext(AuthContext);
  const location = useLocation();

  return (
    <div id="wrapper">
      {loading && <Loader />}
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/user/:username" element={<User />} />
        <Route path="/futurepeek" element={<FuturePeek />} />
        <Route path="/" element={<Home />} />
      </Routes>
      {console.log(user)}
      {user &&
        location.pathname !== "/login" &&
        location.pathname !== "/signup" && <Sidebar />}
    </div>
  );
}

export default App;
