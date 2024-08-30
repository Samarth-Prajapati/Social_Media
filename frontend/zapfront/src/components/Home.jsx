import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContext } from "react";
import { ProfileContext } from "../context/Profile";
export default function Home() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hashtags, setHashtags] = useState([]);
  const { profileData, setProfileData } = useContext(ProfileContext);
  const [comment, setComment] = useState({});
  const [follows, setFollows] = useState(false);
  const handleFollow = async (username) => {
    const accessToken = JSON.parse(
      localStorage.getItem("zapmateAuthTokens")
    ).access;
    const method = follows ? "DELETE" : "POST";
    const response = await fetch(
      `http://localhost:8000/zapapp/userfollows/?username=${username}`,
      {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const data = await response.json();
    fetchHastags();
    fetchData();
  };
  const handleliked = async (liked, id) => {
    const accessToken = JSON.parse(
      localStorage.getItem("zapmateAuthTokens")
    ).access;
    const method = liked ? "DELETE" : "POST";
    const timecapsule = id;
    const response = await fetch(
      `http://localhost:8000/zapapp/${ !liked ? "like/" : `like/${liked}/`}`
      ,
      {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,

        },
        body: JSON.stringify({ timecapsule: timecapsule }),
      }
    );
    const data = await response;
    fetchData();
  };


  const [suggestedPeople, setSuggestedPeople] = useState([]);
  async function fetchData() {
    const accessToken = JSON.parse(
      localStorage.getItem("zapmateAuthTokens")
    ).access;
    const response = await fetch(`http://localhost:8000/zapapp/home/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    setPosts(data);
    console.log(posts);
    setLoading(false);
  }
  async function fetchHastags() {
    const accessToken = JSON.parse(
      localStorage.getItem("zapmateAuthTokens")
    ).access;
    const response = await fetch(`http://localhost:8000/zapapp/homehastags/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const data = await response.json();
    setHashtags(data.hashtags);
    setSuggestedPeople(data.suggested_people);
  }
  const datetotext = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = Math.floor(seconds / 31536000);
  
    if (interval > 0) {
      return interval === 1 ? `${interval} year ago` : `${interval} years ago`;
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 0) {
      return interval === 1 ? `${interval} month ago` : `${interval} months ago`;
    }
    interval = Math.floor(seconds / 86400);
    if (interval > 0) {
      return interval === 1 ? `${interval} day ago` : `${interval} days ago`;
    }
    interval = Math.floor(seconds / 3600);
    if (interval > 0) {
      return interval === 1 ? `${interval} hour ago` : `${interval} hours ago`;
    }
    interval = Math.floor(seconds / 60);
    if (interval > 0) {
      return interval === 1 ? `${interval} minute ago` : `${interval} minutes ago`;
    }
    return `${Math.floor(seconds)} seconds ago`;
  };
  const handleComment = async () => {
    const accessToken = JSON.parse(
      localStorage.getItem("zapmateAuthTokens")
    ).access;
    const response = await fetch(`http://localhost:8000/zapapp/comment/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify(comment),
    });
    const data = await response.json();
    console.log(data);
    setComment({});
    fetchData();
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchData();
      fetchHastags();
    }, 3000);

    return () => clearTimeout(timer);
  }, []);
  useEffect(() => {
    checkCredentials();
  }, []);


  const checkCredentials = () => {
    if (!localStorage.getItem("zapmateAuthTokens")) {
      navigate("/login", { replace: true });
    };
  };
  if (loading) {
    return (
      <>
        <main className="2xl:ml-[--w-side] xl:ml-[--w-side-md] md:ml-[--w-side-small]">
          <div className="main__inner">
            <div
              className="flex lg:flex-col xl:gap-10 md:gap-3 md:mt-10"
              id="js-oversized"
            >
              <div className="md:max-w-[510px] mx-auto flex-1 xl:space-y-6 space-y-3"></div>
              <div className="rounded-xl shadow-sm p-4 space-y-4 bg-slate-200/40 animate-pulse border1 dark:bg-dark2">
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-300/20" />
                  <div className="flex-1 space-y-3">
                    <div className="w-40 h-5 rounded-md bg-slate-300/20" />
                    <div className="w-24 h-4 rounded-md bg-slate-300/20" />
                  </div>
                  <div className="w-6 h-6 rounded-full bg-slate-300/20" />
                </div>
                <div className="w-full h-52 rounded-lg bg-slate-300/10 my-3"></div>
                <div className="flex gap-3">
                  <div className="w-16 h-5 rounded-md bg-slate-300/20" />
                  <div className="w-14 h-5 rounded-md bg-slate-300/20" />
                  <div className="w-6 h-6 rounded-full bg-slate-300/20 ml-auto" />
                  <div className="w-6 h-6 rounded-full bg-slate-300/20  " />
                </div>
              </div>
              <div className="rounded-xl shadow-sm p-4 space-y-4 bg-slate-200/40 animate-pulse border1 dark:bg-dark2">
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-300/20" />
                  <div className="flex-1 space-y-3">
                    <div className="w-40 h-5 rounded-md bg-slate-300/20" />
                    <div className="w-24 h-4 rounded-md bg-slate-300/20" />
                  </div>
                  <div className="w-6 h-6 rounded-full bg-slate-300/20" />
                </div>
                <div className="w-full h-52 rounded-lg bg-slate-300/10 my-3"></div>
                <div className="flex gap-3">
                  <div className="w-16 h-5 rounded-md bg-slate-300/20" />
                  <div className="w-14 h-5 rounded-md bg-slate-300/20" />
                  <div className="w-6 h-6 rounded-full bg-slate-300/20 ml-auto" />
                  <div className="w-6 h-6 rounded-full bg-slate-300/20  " />
                </div>
              </div>
              <div className="rounded-xl shadow-sm p-4 space-y-4 bg-slate-200/40 animate-pulse border1 dark:bg-dark2">
                <div className="flex gap-3">
                  <div className="w-9 h-9 rounded-full bg-slate-300/20" />
                  <div className="flex-1 space-y-3">
                    <div className="w-40 h-5 rounded-md bg-slate-300/20" />
                    <div className="w-24 h-4 rounded-md bg-slate-300/20" />
                  </div>
                  <div className="w-6 h-6 rounded-full bg-slate-300/20" />
                </div>
                <div className="w-full h-52 rounded-lg bg-slate-300/10 my-3"></div>
                <div className="flex gap-3">
                  <div className="w-16 h-5 rounded-md bg-slate-300/20" />
                  <div className="w-14 h-5 rounded-md bg-slate-300/20" />
                  <div className="w-6 h-6 rounded-full bg-slate-300/20 ml-auto" />
                  <div className="w-6 h-6 rounded-full bg-slate-300/20  " />
                </div>
              </div>
              
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <main className="2xl:ml-[--w-side] xl:ml-[--w-side-md] md:ml-[--w-side-small]">
      <div className="main__inner">
        <div
          className="flex max-lg:flex-col xl:gap-10 md:gap-3 md:mt-10"
          id="js-oversized"
        >
          <div className="md:max-w-[510px] mx-auto flex-1 xl:space-y-6 space-y-3"
          data-uk-scrollspy="target: > div; cls: uk-animation-scale-up; delay: 100 ;repeat: false">
            {posts.map((post) => (
              <div
                key={post.id}
                className="bg-white  rounded-xl shadow-sm text-sm font-medium border1 dark:bg-dark2"
              >
                <div className="flex gap-3 sm:p-4 p-2.5 text-sm font-medium">
                  <a
                    className="hover:cursor-pointer"
                    onClick={() => navigate(`/user/${post.username}`)}
                  >
                    {" "}
                    <img
                      src={post.pfp}
                      alt=""
                      className="w-9 h-9 rounded-full"
                    />{" "}
                  </a>
                  <div className="flex-1">
                    <a
                      className="hover:cursor-pointer"
                      onClick={() => navigate(`/user/${post.username}`)}
                    >
                      {" "}
                      <h4 className="text-black dark:text-white">
                        {" "}
                        {post.username}{" "}
                      </h4>{" "}
                    </a>
                    <div className="text-xs text-gray-500 dark:text-white/80">
                      {" "}
                      {datetotext(post.available_date)}
                    </div>
                  </div>
                </div>
                {/* post image */}
                <div className="relative w-full lg:h-72 h-full sm:px-4">
                  <img
                    src={post.image}
                    alt=""
                    className="sm:rounded-lg w-full h-full object-cover"
                  />
                </div>
                {/* post icons */}
                <div className="sm:p-4 p-2.5 flex items-center gap-4 text-xs font-semibold">
                  <div className="flex items-center gap-2.5">
                    <button
                      type="button"
                      className={`button__ico $ ${post.liked ? "text-red-500" : "text-gray-300"  } bg-red-100 dark:bg-slate-700`}
                      onClick={() => handleliked(post.liked,post.id)}
                    >
                      <ion-icon
                        class="text-lg md hydrated"
                        name="heart"
                        role="img"
                      ></ion-icon>
                    </button>
                    <a href="#">{post.total_likes}</a>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      className="button__ico bg-slate-200/70 dark:bg-slate-700"
                    >
                      <ion-icon
                        class="text-xl md hydrated"
                        name="chatbubble-ellipses"
                      />
                    </button>
                    <span>{post.total_comments}</span>
                  </div>
                  <button type="button" className="button__ico ml-auto">
                    <ion-icon
                      class="text-xl md hydrated"
                      name={
                        post
                          ? post.is_private
                            ? "lock-closed-outline"
                            : "globe-outline"
                          : "globe-outline"
                      }
                    />{" "}
                  </button>
                  <button type="button" className="button__ico">
                    {" "}
                    <ion-icon
                      class="text-xl md hydrated"
                      name="share-outline"
                    />{" "}
                  </button>
                </div>
                {/* comments */}
                {post.comments.length !== 0 && (
                  <div className="sm:p-4 max-h-[200px] no-scrollbar overflow-y-scroll p-2.5 border-t border-gray-100 font-normal space-y-3 relative dark:border-slate-700/40">
                    {post.comments.map((comment) => (
                      <div
                        key={comment.id}
                        className="flex items-start gap-3 relative"
                      >
                        <a href="profile.html">
                          {" "}
                          <img
                            src={comment.pfp}
                            alt=""
                            className="w-6 h-6 mt-1 rounded-full"
                          />{" "}
                        </a>
                        <div className="flex-1">
                          <a
                            onClick={() =>
                              navigate(`/user/${comment.username}`)
                            }
                            className="text-black font-medium inline-block dark:text-white hover:cursor-pointer "
                          >
                            {" "}
                            {comment.username}{" "}
                          </a>
                          <p className="mt-0.5">{comment.comment}</p>
                        </div>
                      </div>
                    ))}
                    
                  </div>
                )}
                {/* add comment */}
                <div className="sm:px-4 sm:py-3 p-2.5 border-t border-gray-100 flex items-center gap-1 dark:border-slate-700/40">
                  <img
                    src={profileData.profile_picture}
                    alt=""
                    className="w-6 h-6 rounded-full"
                  />
                  <div className="flex-1 relative overflow-hidden h-10">
                    <textarea
                      placeholder="Add Comment...."
                      rows={1}
                      className="w-full resize-none !bg-transparent px-4 py-2 focus:!border-transparent focus:!ring-transparent"
                      defaultValue={""}
                      onChange={(e) =>
                        setComment({
                          comment: e.target.value,
                          timecapsule: post.id,
                        })
                      }
                    />
                  </div>
                  <button
                    type="submit"
                    className="text-sm rounded-full py-1.5 px-3.5 bg-secondery"
                    onClick={handleComment}
                  >
                    {" "}
                    Comment
                  </button>
                </div>
              </div>
            ))}
          </div>
          {/* right sidebar */}
          <div className="lg:max-w-[370px] md:max-w-[510px] mx-auto">
            <div
              className="xl:space-y-6 space-y-3 md:pb-12"
              data-uk-sticky="end: #js-oversized; offset: 50; media:992"
            >
              {/* peaple you might know */}
              <div className="bg-white rounded-xl shadow-sm p-5 px-6 border1 dark:bg-dark2">
                <div className="flex justify-between text-black dark:text-white">
                  <h3 className="font-bold text-base"> Suggested People </h3>
                  <button type="button" onClick={()=>fetchHastags()}>
                    {" "}
                    <ion-icon
                      name="sync-outline"
                      class="text-xl md hydrated"
                    />{" "}
                  </button>
                </div>
                <div className="space-y-4 capitalize text-xs font-normal mt-5 mb-2 text-gray-500 dark:text-white/80">
                  {suggestedPeople.map((person) => (
                    <div className="flex items-center gap-3" key={person.id}>
                      <a
                        className="hover:cursor-pointer"
                        onClick={() => navigate(`user/${person.username}`)}
                      >
                        <img
                          src={person.pfp}
                          alt="pfp"
                          className="bg-gray-200 rounded-full w-10 h-10"
                        />
                      </a>
                      <div className="flex-1">
                        <a
                          className="hover:cursor-pointer"
                          onClick={() => navigate(`user/${person.username}`)}
                        >
                          <h4 className="font-semibold text-sm text-black dark:text-white">
                            {person.username}
                          </h4>
                        </a>
                        <div className="mt-0.5"> Suggested For You </div>
                      </div>
                      <button
                        type="button"
                        className="text-sm rounded-full py-1.5 px-4 font-semibold bg-secondery"
                        onClick={() => handleFollow(person.username)}
                      >
                        {" "}
                        Follow{" "}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
              {/* Trends */}
              {hashtags.length !== 0 && (
                <div className="bg-white rounded-xl shadow-sm p-5 px-6 border1 dark:bg-dark2">
                  <div className="flex justify-between text-black dark:text-white">
                    <h3 className="font-bold text-base"> Trends for you </h3>
                  </div>
                  <div className="space-y-3.5 capitalize text-xs font-normal mt-5 mb-2 text-gray-600 dark:text-white/80">
                    {hashtags.map((hashtag) => (
                      <a href="#" key={hashtag.name}>
                        <div className="flex items-center gap-3 p">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="w-5 h-5 -mt-2"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="M5.25 8.25h15m-16.5 7.5h15m-1.8-13.5l-3.9 19.5m-2.1-19.5l-3.9 19.5"
                            />
                          </svg>
                          <div className="flex-1">
                            <h4 className="font-semibold text-black dark:text-white text-sm">
                              {hashtag.name}
                            </h4>
                            <div className="mt-0.5">{hashtag.total} posts</div>
                          </div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
