import React from "react";
import { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import Loader from "./Loader";
import ProfileCapsuleView from "./ProfileCapsuleView";
export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [postedCapsules, setPostedCapsules] = useState([]);
  const [upcomingCapsules, setUpcomingCapsules] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [countdowns, setCountdowns] = useState([]);
  const [countdownStrings, setCountdownStrings] = useState([]);
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const strings = countdowns.map((endDate) => {
        const distance = endDate.getTime() - now.getTime();

        if (distance <= 0) {
          return 'Countdown expired';
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        return `${days} days\n ${hours} hours\n ${minutes} minutes\n ${seconds} seconds left`;
      });

      setCountdownStrings(strings);
    }, 1000);

    return () => clearInterval(interval);
  }, [countdowns]);

  
  async function fetchData() {
    const accessToken = JSON.parse(
      localStorage.getItem("zapmateAuthTokens")
    ).access;
    const response = await fetch(`http://localhost:8000/zapapp/profile/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    setProfileData(data[0]);

    setLoading(false);
  }
  async function fetchCapsuleData() {
    const accessToken = JSON.parse(
      localStorage.getItem("zapmateAuthTokens")
    ).access;
    const response = await fetch(`http://localhost:8000/zapapp/timecapsule/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const capsuleData = await response.json();
    setPostedCapsules(capsuleData.posted);
    setUpcomingCapsules(capsuleData.upcoming);
    setCountdowns(capsuleData.upcoming.map((item) => new Date(item.available_date)));
  }
  useEffect(() => {
    fetchData();
    fetchCapsuleData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );
  }
  const handlePostView = (postId) => {
    console.log(`Post ${postId} clicked`);

    setSelectedPost(postId);
  };
  const handleClosePostView = () => {
    setSelectedPost(null);
  };

  return (
    <>
      <main className="2xl:ml-[--w-side] xl:ml-[--w-side-md] md:ml-[--w-side-small]">
        <div className="main__inner">
          <div className="py-6 relative">
            <div className="flex md:gap-16 gap-4 max-md:flex-col">
              <div className="relative md:p-1 rounded-full h-full max-md:w-16 bg-gradient-to-tr from-blue-300 to-blue-600 shadow-md hover:scale-110 duration-500 uk-animation-scale-up">
                <div className="relative md:w-40 md:h-40 h-16 w-16 rounded-full overflow-hidden md:border-[6px] border-gray-100 shrink-0 dark:border-slate-900">
                  <img
                    src={profileData.profile_picture}
                    alt=""
                    className="w-full h-full absolute object-cover"
                  />
                </div>
              </div>
              <div className="max-w-2x flex-1">
                <h3 className="md:text-xl text-base font-semibold text-black dark:text-white capitalize">
                  {profileData.first_name} {profileData.last_name}
                </h3>
                <p className="sm:text-sm font-semibold text-blue-600 mt-1 font-sp text-xs tacking-wide">
                  @{profileData.username}
                </p>
                <p className="text-lg mt-2 md:font-normal font-light">
                  {profileData.bio}
                </p>
                <p
                  className="mt-2 space-x-2 text-gray-500 text-sm hidden"
                  style={{ marginTop: "11px" }}
                >
                  <a href="#" className="inline-block">
                    Travel
                  </a>{" "}
                  .{" "}
                  <a href="#" className="inline-block">
                    Business
                  </a>{" "}
                  .{" "}
                  <a href="#" className="inline-block">
                    Technolgy
                  </a>
                </p>
                <div className="flex md:items-end justify-between md:mt-8 mt-4 max-md:flex-col gap-4">
                  <div className="flex sm:gap-10 gap-6 sm:text-sm text-xs max-sm:absolute max-sm:top-10 max-sm:left-36">
                    <div>
                      <p className="font-medium">Capsules</p>
                      <h3 className="sm:text-xl sm:font-bold mt-1 text-black dark:text-white text-base font-normal">
                        {profileData.total_capsules}
                      </h3>
                    </div>
                    <div>
                      <p className="font-medium">Followers</p>
                      <h3 className="sm:text-xl sm:font-bold mt-1 text-black dark:text-white text-base font-normal">
                        {profileData.totalfollowers}
                      </h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-10">
            <div data-uk-sticky="cls-active: bg-slate-100/60 z-30 backdrop-blur-lg px-4 dark:bg-slate-800/60; start: 500; animation: uk-animation-slide-top">
              <nav className="text-sm text-center text-gray-500 capitalize font-semibold dark:text-white">
                <ul
                  className="flex gap-2 justify-center border-t dark:border-slate-700"
                  data-uk-switcher="connect: #story_tab ; animation: uk-animation-fade, uk-animation-slide-left-medium"
                >
                  <li>
                    {" "}
                    <a
                      href="#"
                      className="flex items-center p-4 py-2.5 -mb-px border-t-2 border-transparent aria-expanded:text-black aria-expanded:border-black aria-expanded:dark:text-white aria-expanded:dark:border-white"
                    >
                      {" "}
                      <ion-icon
                        class="mr-2 text-2xl md hydrated"
                        name="camera-outline"
                      />{" "}
                      Posted
                    </a>{" "}
                  </li>
                  <li>
                    {" "}
                    <a
                      href="#"
                      className="flex items-center p-4 py-2.5 -mb-px border-t-2 border-transparent aria-expanded:text-black aria-expanded:border-black aria-expanded:dark:text-white aria-expanded:dark:border-white"
                    >
                      {" "}
                      
                      <ion-icon name="time-outline" class="mr-2 text-2xl md hydrated"/>{" "}
                      Upcoming{" "}
                    </a>{" "}
                  </li>
                </ul>
              </nav>
            </div>
            <div id="story_tab" className="uk-switcher">
              <div className="mt-8">
                {/* post heading */}
                <div className="flex items-center justify-between py-3">
                  <h1 className="text-xl font-bold text-black dark:text-white">
                    Time Capsules
                  </h1>
                </div>
                {/* Post list */}
                <div
                  className="grid lg:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-3 mt-6"
                  uk-scrollspy="target: > div; cls: uk-animation-scale-up; delay: 100"
                >
                  {postedCapsules.length === 0 ? (
                    <>
                      <div className="w-full h-60 bg-slate-200/60 rounded-lg dark:bg-dark2 animate-pulse shadow-md" />
                      <div className="w-full h-60 bg-slate-200/60 rounded-lg dark:bg-dark2 animate-pulse shadow-md" />
                      <div className="w-full h-60 bg-slate-200/60 rounded-lg dark:bg-dark2 animate-pulse shadow-md" />
                      <div className="w-full h-60 bg-slate-200/60 rounded-lg dark:bg-dark2 animate-pulse shadow-md" />
                      <div className="w-full h-60 bg-slate-200/60 rounded-lg dark:bg-dark2 animate-pulse shadow-md" />
                      <div className="w-full h-60 bg-slate-200/60 rounded-lg dark:bg-dark2 animate-pulse shadow-md" />
                      <div className="w-full h-60 bg-slate-200/60 rounded-lg dark:bg-dark2 animate-pulse shadow-md" />
                      <div className="w-full h-60 bg-slate-200/60 rounded-lg dark:bg-dark2 animate-pulse shadow-md" />
                    </>
                  ) : (
                    postedCapsules.map((item) => (
                      <a onClick={() => handlePostView(item.id)} key={item.id}>
                        <div className="lg:hover:scale-105 hover:shadow-lg hover:z-10 duration-500 delay-100 shadow-xl shadow-black rounded-lg">
                          <div className="relative overflow-hidden rounded-lg uk-transition-toggle">
                            <div className="relative w-full lg:h-60 h-full aspect-[3/3] shadow-md">
                              <img
                                src={item.image}
                                alt=""
                                className="object-cover w-full h-full"
                              />
                            </div>
                            <div className="absolute inset-0 bg-white/5 backdrop-blur-sm uk-transition-fade shadow-md">
                              <div className="flex items-center justify-center gap-4 text-white w-full h-full shadow-md">
                                <div className="flex items-center gap-2">
                                  {" "}
                                  <ion-icon
                                    class="text-2xl md hydrated"
                                    name="heart-circle"
                                  />{" "}
                                  {item.total_likes}
                                </div>
                                <div className="flex items-center gap-2">
                                  {" "}
                                  <ion-icon
                                    class="text-2xl md hydrated"
                                    name="chatbubble-ellipses"
                                  />{" "}
                                  {item.total_comments}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </a>
                    ))
                  )}
                </div>
                {selectedPost && (
                  <div>
                    <ProfileCapsuleView
                      item={postedCapsules.find(
                        (item) => item.id === selectedPost
                      )}
                      handleClosePostView={handleClosePostView}
                      selectedPost={selectedPost}
                      fetchCapsuleData={fetchCapsuleData}
                    />
                    <div
                      className="uk-modal-backdrop"
                      onClick={handleClosePostView}
                    ></div>
                  </div>
                )}
              </div>
              <div className="mt-8">
                {/* post heading */}
                <div className="flex items-center justify-between py-3">
                  <h1 className="text-xl font-bold text-black dark:text-white">
                    Time Capsules
                  </h1>
                </div>
                {/* Post list */}
                <div
                  className="grid lg:grid-cols-4 sm:grid-cols-3 grid-cols-2 gap-3 mt-6"
                  data-uk-scrollspy="target: > div; cls: uk-animation-scale-up; delay: 100"
                >
                  {upcomingCapsules.length === 0 ? (
      <>
        <div className="w-full h-60 bg-slate-200/60 rounded-lg dark:bg-dark2 animate-pulse shadow-md" />
        <div className="w-full h-60 bg-slate-200/60 rounded-lg dark:bg-dark2 animate-pulse shadow-md" />
        <div className="w-full h-60 bg-slate-200/60 rounded-lg dark:bg-dark2 animate-pulse shadow-md" />
        <div className="w-full h-60 bg-slate-200/60 rounded-lg dark:bg-dark2 animate-pulse shadow-md" />
        <div className="w-full h-60 bg-slate-200/60 rounded-lg dark:bg-dark2 animate-pulse shadow-md" />
        <div className="w-full h-60 bg-slate-200/60 rounded-lg dark:bg-dark2 animate-pulse shadow-md" />
        <div className="w-full h-60 bg-slate-200/60 rounded-lg dark:bg-dark2 animate-pulse shadow-md" />
        <div className="w-full h-60 bg-slate-200/60 rounded-lg dark:bg-dark2 animate-pulse shadow-md" />
      </>
    ) : (
      upcomingCapsules.map((item, index) => {
        return (
          <a key={item.id}>
            <div className="rounded-lg text-center drop-shadow shadow-xl z-10 shadow-black">
              <div className="relative overflow-hidden rounded-lg uk-transition-toggle">
                <div className="relative w-full lg:h-60 h-full aspect-[3/3] shadow-md blur-[9px]">
                  <img
                    src={item.image}
                    alt=""
                    className="object-cover w-full h-full filter brightness-50"
                  />
                </div>
                <div className="absolute inset-0 bg-white/5 backdrop-blur-xl">
                  <div className="flex items-center flex-col justify-center gap-4 text-white w-full h-full shadow-md">
                    <div className="flex items-center text-xl capitalize gap-2 drop-shadow  font-semibold">
                      {item.title}
                    </div>
                    <div className="flex drop-shadow font-semibold items-center gap-2 whitespace-pre-line capitalize">
                      {countdownStrings[index]}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </a>
        );
      })
    )}
                </div>
                {selectedPost && (
                  <div>
                    <ProfileCapsuleView
                      item={upcomingCapsules.find(
                        (item) => item.id === selectedPost
                      )}
                      handleClosePostView={handleClosePostView}
                      selectedPost={selectedPost}
                    />
                    <div
                      className="uk-modal-backdrop"
                      onClick={handleClosePostView}
                    ></div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
