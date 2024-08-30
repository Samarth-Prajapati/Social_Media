import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState([]);
  const [searching, setSearching] = useState(false);
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      // Call your search function here
      userSearch();
    }, 500);
    setUsers([]);
    return () => {
      clearTimeout(delayDebounceFn);
    };
  }, [searchTerm]);
  const userSearch = async () => {
    setSearching(true);
    const accessToken = JSON.parse(
      localStorage.getItem("zapmateAuthTokens")
    ).access;
    const data = await fetch(
      `http://localhost:8000/zapapp/search/?search=${searchTerm}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const users = await data.json();
    if(users.length===0){
        setSearching(false);
    }
    setUsers(users);
  };
    const handleSearch = (event) => {
        setSearchTerm(event.target.value);
        setSearching(true);
    };
  const navigate = useNavigate();
  return (
    <div
      className="sm:w-[397px] w-full bg-white shadow-lg md:!left-[73px]  !left-0 dark:bg-dark2 dark:border1 max-md:bottom-[57px]"
      uk-drop="pos: left-center;animate-out: true; animation: uk-animation-slide-left-medium; mode:click; offset: 9"
    >
      <div className="md:h-screen overflow-y-auto h-[calc(100vh-120px)]">
        {/* header */}
        <div className="px-5 py-4 space-y-5 border-b border-gray-100 dark:border-slate-700">
          <h3 className="md:text-xl text-lg font-medium mt-3 text-black dark:text-white">
            Search
          </h3>
          <div className="relative -mx-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-5 h-5 absolute left-3 bottom-1/2 translate-y-1/2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search"
              onChange={handleSearch}
              className="bg-transparen w-full !pl-10 !py-2 !rounded-lg"
            />
          </div>
        </div>
        {/* contents list */}
        <div className="p-2 space-y-2 dark:text-white">
          <div className="flex items-center justify-between py-2.5 px-3 font-semibold">
            <h4>Results</h4>
          </div>
          {users.length===0 && searching && (
            <div className=" animate-pulse">
              <div className="mt-2">
                <div className=" flex space-x-4">
                  <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <div className=" flex space-x-4">
                  <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <div className=" flex space-x-4">
                  <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-2">
                <div className=" flex space-x-4">
                  <div className="rounded-full bg-gray-200 h-10 w-10"></div>
                  <div className="flex-1 space-y-4 py-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="space-y-2">
                      <div className="h-4 bg-gray-200 rounded"></div>
                      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          {users &&
            users.map((user) => (
              <Link to={`/user/${user.username}`}>
              <a
                className="relative flex items-center gap-3 p-2 duration-200 rounded-xl hover:bg-secondery"
                key={user.id}
              >
                <img
                  src={user.profile_picture}
                  alt=""
                  className="bg-gray-200 rounded-full w-10 h-10"
                />
                <div className="fldex-1 min-w-0">
                  <h4 className="font-medium text-sm text-black dark:text-white">
                    {user.username}
                  </h4>
                  <div className="text-xs text-gray-500 font-normal mt-0.5 dark:text-white-80">
                    Suggested For You
                  </div>
                </div>
              </a>
              </Link>
            ))}
        </div>
      </div>
    </div>
  );
}
