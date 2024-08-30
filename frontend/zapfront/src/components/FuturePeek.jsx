import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function FuturePeek() {
  const navigate = useNavigate();
  const [futurecapsules, setFuturecapsules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [countdowns, setCountdowns] = useState([]);
  const [countdownStrings, setCountdownStrings] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchData();
    }, 1000);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm]);
  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };
  async function fetchData() {
    // setCountdowns([]);
    // setCountdownStrings([]);
    // setFuturecapsules([]);
    const accessToken = JSON.parse(
      localStorage.getItem("zapmateAuthTokens")
    ).access;
    const response = await fetch(
      `http://localhost:8000/zapapp/futurecapsules/?search=${searchTerm}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const data = await response.json();
    setFuturecapsules(data);
    setLoading(false);
  }
  useEffect(() => {
    if (futurecapsules.length > 0) {
      setCountdowns(
        futurecapsules.map((item) => new Date(item.available_date))
      );
    }
  }, [futurecapsules]);
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const strings = countdowns.map((endDate) => {
        const distance = endDate.getTime() - now.getTime();

        if (distance <= 0) {
          return "Countdown expired";
        }

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor(
          (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
        );
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        return (
          <div className="flex drop-shadow font-semibold items-center gap-2 whitespace-pre-line">
            <span className="text-4xl relative pr-3">
              {days}
              <span className="text-sm absolute bottom-0 right-0">D</span>
            </span>
            <span className="text-4xl relative pr-3">
              {hours}
              <span className="text-sm absolute bottom-0 right-0">H</span>
            </span>
            <span className="text-4xl relative pr-3">
              {minutes}
              <span className="text-sm absolute bottom-0 right-0">M</span>
            </span>
            <span className="text-4xl relative pr-3">
              {seconds}
              <span className="text-sm absolute bottom-0 right-0">S</span>
            </span>
          </div>
        );
      });

      setCountdownStrings(strings);
    }, 1000);

    return () => {
        clearInterval(interval);
      
    };
  }, [countdowns]);
  useEffect(() => {
    fetchData();
  }, []);
  const datetotext = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    let interval = Math.floor(seconds / 31536000);

    if (interval > 0) {
      return interval === 1 ? `${interval} year ago` : `${interval} years ago`;
    }
    interval = Math.floor(seconds / 2592000);
    if (interval > 0) {
      return interval === 1
        ? `${interval} month ago`
        : `${interval} months ago`;
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
      return interval === 1
        ? `${interval} minute ago`
        : `${interval} minutes ago`;
    }
    return `${Math.floor(seconds)} seconds ago`;
  };
  return (
    <main className="2xl:ml-[--w-side] xl:ml-[--w-side-md] md:ml-[--w-side-small]">
      <div className="main__inner">
        {/* search box */}
        <div className="z-[100] border-none outline-none shadow-none sticky md:top-0 right-0 left-0 max-lg:!top-[60px] lg:rounded-2xl bg-slate-100/60 backdrop-blur-3xl dark:bg-slate-800/60 flex items-center">
  <div className="relative w-full">
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
      className="!bg-white/20 h-full z-[0] w-full !pl-10 !py-2 shadow-none outline-none border-none"
      value={searchTerm}
      onChange={handleSearch}
    />
  </div>
</div>
        <div
          className="flex max-lg:flex-col xl:gap-10 md:gap-3 md:mt-10"
          id="js-oversized"
        >
          {/* feed story */}
          <div
            className="md:max-w-[510px] mx-auto flex-1 xl:space-y-6 space-y-3"
            data-uk-scrollspy="target: > div; cls: uk-animation-scale-up; delay: 100 ;repeat: false"
          >
            {futurecapsules.map((post, index) => (
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
                      {datetotext(post.publish_date)}
                    </div>
                  </div>
                </div>
                {/* post image */}
                <div className="relative rounded-xl w-full lg:h-72 h-full sm:px-4">
                  <div className="absolute inset-0 rounded-xl overflow-hidden">
                    <img
                      src={post.image}
                      alt=""
                      className="w-full h-full object-cover filter blur-lg"
                    />
                  </div>
                  <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-xl">
                    <div className="flex items-center rounded-xl flex-col justify-center gap-4 text-white w-full h-full shadow-md">
                      <div className="flex items-center text-xl capitalize gap-2 drop-shadow font-semibold">
                        {post.title}
                      </div>
                      <div className="flex drop-shadow font-semibold items-center gap-2 whitespace-pre-line capitalize">
                        {countdownStrings[index]}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          {/* right sidebar */}
        </div>
      </div>
    </main>
  );
}
