import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
export default function ZapTriggers(){
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

  const navigate = useNavigate();
  const [zapTriggers, setZapTriggers] = useState([]);
  async function getZapTriggers() {
    const accessToken = JSON.parse(
      localStorage.getItem("zapmateAuthTokens")
    ).access;
    const response = await fetch(
      `http://localhost:8000/zapapp/zaptriggers/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    const data = await response.json();
    setZapTriggers(data);
  }
  useEffect(() => {
    getZapTriggers();
    const intervalId = setInterval(() => {
      getZapTriggers();
    }, 10000);
  
    return () => {
      clearInterval(intervalId);
    };
  }, []);

    return(
        <div
            className="sm:w-[397px] w-full bg-white shadow-lg md:!left-[73px] hidden !left-0 dark:bg-dark2 dark:border1 max-md:bottom-[57px]"
            uk-drop="pos: left-center;animate-out: true; animation: uk-animation-slide-left-medium ; mode:click"
          >
            <div className="md:h-screen overflow-y-auto h-[calc(100vh-120px)]">
              {/* header */}
              <div className="flex items-center justify-between px-5 py-4 mt-3">
                <h3 className="md:text-xl text-lg font-medium mt-3 text-black dark:text-white">
                  Notification
                </h3>
              </div>
              {/* contents list */}
              <div className="px-2 -mt-2 text-sm font-normal">
                <div className="px-5 py-3 -mx-2">
                  <h4 className="font-semibold">New</h4>
                </div>
                {zapTriggers && ( zapTriggers.slice(0,5).map((zapTrigger) => (<a
                  onClick={()=>navigate(`/user/${zapTrigger.username}`)}
                  className="relative flex items-center gap-3 p-2 duration-200 cursor-pointer rounded-xl pr-10 hover:bg-secondery bg-teal-500/5"
                >
                  <div className="relative w-12 h-12 shrink-0">
                    <img
                      src={zapTrigger.userbypfp}
                      alt=""
                      className="object-cover w-full h-full rounded-full"
                    />
                  </div>
                  <div className="flex-1 ">
                    <p>
                      {" "}
                      <b className="font-bold mr-1"> {zapTrigger.username}</b> {zapTrigger.message} {" "}
                    </p>
                    <div className="text-xs text-gray-500 mt-1.5 dark:text-white/80">
                      {datetotext(zapTrigger.trigger_date)}
                    </div>
                    <div className="w-2.5 h-2.5 bg-teal-600 rounded-full absolute right-3 top-5" />
                  </div>
                </a>)))}
                <div className="border-t px-5 py-3 -mx-2 mt-4 dark:border-slate-700/40">
                  <h4 className="font-semibold">This Week</h4>
                </div>
                {zapTriggers && ( zapTriggers.slice(5,).map((zapTrigger) => (<a
                  onClick={()=>navigate(`/user/${zapTrigger.username}`)}
                  className="relative flex items-center cursor-pointer gap-3 p-2 duration-200 rounded-xl hover:bg-secondery"
                >
                  <div className="relative w-12 h-12 shrink-0">
                    <img
                      src={zapTrigger.userbypfp}
                      alt=""
                      className="object-cover w-full h-full rounded-full"
                    />
                  </div>
                  <div className="flex-1 ">
                    <p>
                      {" "}
                      <b className="font-bold mr-1"> {zapTrigger.username}</b> {zapTrigger.message}{" "}
                    </p>
                    <div className="text-xs text-gray-500 mt-1.5 dark:text-white/80">
                      {datetotext(zapTrigger.trigger_date)}
                    </div>
                    
                  </div>
                </a>)))}
              </div>
            </div>
          </div>)
}