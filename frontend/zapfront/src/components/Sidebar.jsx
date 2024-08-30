import { useNavigate } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../context/Auth";
import { Link } from "react-router-dom";
import Loader from "./Loader";
import CreatePost from "./CreatePost";
import Search from "./Search";
import { ProfileContext } from "../context/Profile";
import icon from '../assets/images/LinkedIn cover - 1.png'
import ZapTriggers from "./ZapTriggers";
export default function Sidebar() {
  const [loading, setLoading] = useState(true);
  const {profileData,setProfileData} = useContext(ProfileContext);
  const [createPost, setCreatePost] = useState(false);
  async function fetchData() {
    const accessToken = JSON.parse(
      localStorage.getItem("zapmateAuthTokens")
    ).access;
    const response = await fetch(
      `http://localhost:8000/zapapp/profile/?fields=username,profile_picture,totalfollowers`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const data = await response.json();
    setProfileData(data[0]);
    console.log(profileData);
    setLoading(false);
  }
  useEffect(() => {
    fetchData();
  }, []);
  const { logoutUser } = useContext(AuthContext);

  const navigate = useNavigate();
  function handleprofile() {
    navigate("/profile");
  }
  function handlesettings() {
    navigate("/settings");
  }
  function handleExplore() {
    navigate("/explore");
  }
  function handleHome() {
    navigate("/");
  }

  if (loading) {
    return (
      <div
        id="sidebar"
        className="fixed top-0 left-0 z-40 max-md:top-auto max-md:bottom-0"
      >
        <div
          id="sidebar__inner"
          className="flex sside md:flex-col justify-between md:h-screen md:p-2 p-1 transition-all duration-500 bg-white shadow dark:bg-dark2 2xl:w-72 xl:w-60 max-xl:w-[73px] max-md:w-screen max-md:border-t max-md:dark:border-slate-700"
        >
          <Loader />
        </div>
      </div>
    );
  }
  function handleCreatePost() {
    setCreatePost(!createPost);
    }
    

  return (
    <>
    {<CreatePost handleCreatePost={handleCreatePost} createPost={createPost} />}
    <div
      id="sidebar"
      className="fixed top-0 left-0 z-40 max-md:top-auto max-md:bottom-0"
    >
      <div
        id="sidebar__inner"
        className="flex sside md:flex-col justify-between md:h-screen md:p-2 p-1 transition-all duration-500 bg-white shadow dark:bg-dark2 2xl:w-72 xl:w-60 max-xl:w-[73px] max-md:w-screen max-md:border-t max-md:dark:border-slate-700"
      >
        {/* logo */}
        <div className="flex h-20  max-md:fixed max-md:top-0 max-md:w-full max-md:bg-white/80 max-md:left-0 max-md:px-4 max-md:h-14 max-md:shadow-sm max-md:dark:bg-slate-900/80 backdrop-blur-xl">
          <a href="home.html" id="logo" className="flex items-center gap-3">
            {/* logo icon */}
            
            {/* text logo */}
            <img
              id="logo__text"
              src={icon}
              alt=""
              className="w-full h-6 ml-1 max-xl:hidden max-md:block dark:!hidden"
            />
            
          </a>
        </div>
        {/* nav */}
        <nav className="flex-1 max-md:flex max-md:justify-around md:space-y-2">
          {/* Home */}
          <a onClick={handleHome}>
            <svg
              id="icon__outline"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"
              />
            </svg>
            <svg
              id="icon__solid"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="hidden"
            >
              <path
                fillRule="evenodd"
                d="M9.293 2.293a1 1 0 011.414 0l7 7A1 1 0 0117 11h-1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-3a1 1 0 00-1-1H9a1 1 0 00-1 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-6H3a1 1 0 01-.707-1.707l7-7z"
                clipRule="evenodd"
              />
            </svg>
            <span className="max-xl:hidden"> Home </span>
          </a>
          {/* Search */}
          <a>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <span className="max-xl:hidden"> Search </span>
          </a>
          <Search />
          
          {/* Explore */}
          <a onClick={handleExplore} className="max-md:!hidden">
            <svg
              id="icon__outline"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              className="bi bi-compass"
              viewBox="0 0 16 16"
            >
              <path d="M8 16.016a7.5 7.5 0 0 0 1.962-14.74A1 1 0 0 0 9 0H7a1 1 0 0 0-.962 1.276A7.5 7.5 0 0 0 8 16.016zm6.5-7.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0z" />
              <path d="m6.94 7.44 4.95-2.83-2.83 4.95-4.949 2.83 2.828-4.95z" />
            </svg>
            <svg
              id="icon__solid"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="hidden"
            >
              <path
                fillRule="evenodd"
                d="M13.5 4.938a7 7 0 11-9.006 1.737c.202-.257.59-.218.793.039.278.352.594.672.943.954.332.269.786-.049.773-.476a5.977 5.977 0 01.572-2.759 6.026 6.026 0 012.486-2.665c.247-.14.55-.016.677.238A6.967 6.967 0 0013.5 4.938zM14 12a4 4 0 01-4 4c-1.913 0-3.52-1.398-3.91-3.182-.093-.429.44-.643.814-.413a4.043 4.043 0 001.601.564c.303.038.531-.24.51-.544a5.975 5.975 0 011.315-4.192.447.447 0 01.431-.16A4.001 4.001 0 0114 12z"
                clipRule="evenodd"
              />
            </svg>
            <span className="max-xl:hidden"> Explore </span>
          </a>
          {/* Notification */}
          <a
            className="max-md:!fixed max-md:top-2 max-md:right-14 relative"
          >
            <svg
              id="icon__outline"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
            <svg
              id="icon__solid"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="hidden"
            >
              <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
            </svg>
            <span className="max-xl:hidden"> ZapTriggers </span>
            <div className="w-2 h-2 bg-red-600 rounded-full absolute left-7 top-2.5" />
          </a>
          <ZapTriggers />
          
          {/* create a post */}
          <a> 
            <button
              className="flex items-center gap-3 w-full"
              onClick={handleCreatePost}
            >
              <svg
                id="icon__outline"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
              <svg
                id="icon__solid"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="hidden"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm.75-11.25a.75.75 0 00-1.5 0v2.5h-2.5a.75.75 0 000 1.5h2.5v2.5a.75.75 0 001.5 0v-2.5h2.5a.75.75 0 000-1.5h-2.5v-2.5z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="max-xl:hidden"> Create </span>
            </button>
          </a>
          
          
            {/* profile last section*/}
          <a onClick={handleprofile} className="max-md:!hidden active">
            <svg
              id="icon__outline"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M17.982 18.725A7.488 7.488 0 0012 15.75a7.488 7.488 0 00-5.982 2.975m11.963 0a9 9 0 10-11.963 0m11.963 0A8.966 8.966 0 0112 21a8.966 8.966 0 01-5.982-2.275M15 9.75a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <svg
              id="icon__solid"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="hidden"
            >
              <path
                fillRule="evenodd"
                d="M18.685 19.097A9.723 9.723 0 0021.75 12c0-5.385-4.365-9.75-9.75-9.75S2.25 6.615 2.25 12a9.723 9.723 0 003.065 7.097A9.716 9.716 0 0012 21.75a9.716 9.716 0 006.685-2.653zm-12.54-1.285A7.486 7.486 0 0112 15a7.486 7.486 0 015.855 2.812A8.224 8.224 0 0112 20.25a8.224 8.224 0 01-5.855-2.438zM15.75 9a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
                clipRule="evenodd"
              />
            </svg>
            <span className="max-xl:hidden"> Profile </span>
          </a>
          <a onClick={()=>navigate('/futurepeek')} className="max-md:!hidden active">
          <ion-icon name="infinite" class="text-2xl md hydrated" />
            <span className="max-xl:hidden"> Future Peek </span>
          </a>
        </nav>
        {/* profile */}
        <div>
          <a
            id="profile-link"
            onClick={handleprofile}
            className="flex items-center gap-3 p-3 group"
          >
            <img
              src={profileData.profile_picture}
              alt=""
              className="rounded-full md:w-7 md:h-7 w-5 h-5 shrink-0"
            />
            <span className="font-semibold text-sm max-xl:hidden capitalize">
              {profileData.first_name} {profileData.last_name}
            </span>
            <ion-icon
              name="chevron-forward-outline"
              class="text-xl ml-auto duration-200 group-aria-expanded:-rotate-90 max-xl:hidden md hydrated"
            />
          </a>
          <div
            className="bg-white sm:w-64 2xl:w-[calc(100%-16px)] w-full shadow-lg border rounded-xl overflow-hidden max-md:!top-auto max-md:bottom-16 border2 dark:bg-dark2 hidden"
            uk-drop="animation:uk-animation-slide-bottom-medium ;animate-out: true"
          >
            <div className="w-full h-1.5 bg-gradient-to-r to-emerald-500 via-sky-500 from-indigo-500" />
            <div className="p-4 text-xs font-medium">
              <a onClick={handleprofile}>
                <img
                  src={profileData.profile_picture}
                  className="w-8 h-8 rounded-full"
                  alt=""
                />
                <div className="mt-2 space-y-0.5">
                  <div className="text-base font-semibold capitalize">
                    {profileData.first_name} {profileData.last_name}
                  </div>
                  <div className="text-gray-400 dark:text-white/80  font-semibold">
                    @{profileData.username}
                  </div>
                </div>
              </a>

              <div className="mt-3 flex gap-3.5">
                <div>
                 <span className="font-bold">{profileData.totalfollowers}</span> 
                    <span className="text-gray-400 dark:text-white/80 ml-1">
                      Followers
                    </span>
                </div>
              </div>
            </div>
            <hr className="opacity-60" />
            <ul className="text-sm font-semibold p-2">
              <li>
                {" "}
                <a
                  onClick={handlesettings}
                  className="flex gap-3 rounded-md p-2 cursor-pointer hover:bg-secondery finer"
                >
                  {" "}
                  <ion-icon name="settings-outline" class="text-lg md hydrated" />{" "}
                  Account Setting
                </a>
              </li>
              <li>
                {" "}
                <a
                  onClick={logoutUser}
                  className="flex gap-3 rounded-md p-2 cursor-pointer hover:bg-rose-500 hover:text-white"
                >
                  {" "}
                  <ion-icon name="log-out-outline" class="text-lg md hydrated" /> Log
                  Out
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    </>
    
  );
} 
