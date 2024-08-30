import { useState, useEffect } from "react";
import jwtDecode from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
export default function CreatePost(props) {
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isPrivate, setIsPrivate] = useState(false);
  const [date, setDate] = useState(null);
  const [hashtags, setHashtags] = useState([]);
  let objectUrl = null;

  async function handleSubmit(e) {
    e.preventDefault();
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("is_private", isPrivate);
    formData.append("available_date", date);
    formData.append("image", image);
    formData.append("hashtags", hashtags);

    const accessToken = JSON.parse(
      localStorage.getItem("zapmateAuthTokens")
    ).access;
    const responseUpdate = await fetch(
      `http://localhost:8000/zapapp/timecapsule/`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        body: formData,
      }
    );
    console.log(responseUpdate);
    if (responseUpdate.status === 201) {
      toast.success("Capsule Created successfully!");
      setPreview(null);
      setTitle("");
      setTimeout(() => {
        props.handleCreatePost();
      }, 1000);
    } else {
      toast.error("Something went wrong");
    }
  }
  useEffect(() => {
    if (!image) {
      setPreview(null);
      return;
    }
    objectUrl = URL.createObjectURL(image);
    setPreview(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }, [image]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
  };

  if (!props.createPost) {
    return null;
  }
  return (
    <>
      <ToastContainer />
      <div className="lg:p-20 max-lg:!items-start w-full h-full z-[100] top-[50%] left-[50%] fixed flex justify-center items-center translate-x-[-50%] translate-y-[-50%] backdrop-blur-sm"></div>

      <div className="tt fixed top-[50%] left-[50%] translate-x-[-50%] translate-y-[-50%] z-[150] h-fit mx-auto bg-white shadow-xl rounded-lg w-[90%] max-w-[902px]  dark:bg-dark2">
        <ul className=" p-3.5 border-b text-center text-sm font-semibold text-black dark:text-white dark:border-slate-700">
          <li className="flex justify-between items-center">
            <a onClick={props.handleCreatePost} className="">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18"
                />
              </svg>
            </a>
            <div> Create Time Capsule </div>
            {/* submit button */}
            <button
              type="button"
              onClick={handleSubmit}
              className="text-white bg-blue-600 rounded-lg py-1.5 px-5 text-sm mx-2.5 uk-animation-slide-right-small"
            >
              {" "}
              Share{" "}
            </button>
          </li>
        </ul>

        <div className="lg:inline-flex">
          <div className="lg:w-[600px] w-full">
            <div className="w-full lg:h-[450px] h-78 relative overflow-hidden flex justify-center items-center">
              <label
                htmlFor="addPostUrl"
                className="w-full h-full absolute inset-0 z-10 hover: cursor-pointer"
              ></label>
              <input
                required
                id="addPostUrl"
                type="file"
                className="hidden"
                onChange={handleImageChange}
              />
              <div
                className="space-y-4 absolute flex flex-col justify-center"
                uk-scrollspy="target: > div; cls: uk-animation-scale-up; delay: 300;repeat:true"
              >
                <div uk-scrollspy-class="uk-animation-scale-up">
                  <svg
                    className="mx-auto text-gray-600 dark:text-white"
                    width={96}
                    height={77}
                    role="img"
                    viewBox="0 0 97.6 77.3"
                  >
                    <path
                      d="M16.3 24h.3c2.8-.2 4.9-2.6 4.8-5.4-.2-2.8-2.6-4.9-5.4-4.8s-4.9 2.6-4.8 5.4c.1 2.7 2.4 4.8 5.1 4.8zm-2.4-7.2c.5-.6 1.3-1 2.1-1h.2c1.7 0 3.1 1.4 3.1 3.1 0 1.7-1.4 3.1-3.1 3.1-1.7 0-3.1-1.4-3.1-3.1 0-.8.3-1.5.8-2.1z"
                      fill="currentColor"
                    />
                    <path
                      d="M84.7 18.4 58 16.9l-.2-3c-.3-5.7-5.2-10.1-11-9.8L12.9 6c-5.7.3-10.1 5.3-9.8 11L5 51v.8c.7 5.2 5.1 9.1 10.3 9.1h.6l21.7-1.2v.6c-.3 5.7 4 10.7 9.8 11l34 2h.6c5.5 0 10.1-4.3 10.4-9.8l2-34c.4-5.8-4-10.7-9.7-11.1zM7.2 10.8C8.7 9.1 10.8 8.1 13 8l34-1.9c4.6-.3 8.6 3.3 8.9 7.9l.2 2.8-5.3-.3c-5.7-.3-10.7 4-11 9.8l-.6 9.5-9.5 10.7c-.2.3-.6.4-1 .5-.4 0-.7-.1-1-.4l-7.8-7c-1.4-1.3-3.5-1.1-4.8.3L7 49 5.2 17c-.2-2.3.6-4.5 2-6.2zm8.7 48c-4.3.2-8.1-2.8-8.8-7.1l9.4-10.5c.2-.3.6-.4 1-.5.4 0 .7.1 1 .4l7.8 7c.7.6 1.6.9 2.5.9.9 0 1.7-.5 2.3-1.1l7.8-8.8-1.1 18.6-21.9 1.1zm76.5-29.5-2 34c-.3 4.6-4.3 8.2-8.9 7.9l-34-2c-4.6-.3-8.2-4.3-7.9-8.9l2-34c.3-4.4 3.9-7.9 8.4-7.9h.5l34 2c4.7.3 8.2 4.3 7.9 8.9z"
                      fill="currentColor"
                    />
                    <path
                      d="M78.2 41.6 61.3 30.5c-2.1-1.4-4.9-.8-6.2 1.3-.4.7-.7 1.4-.7 2.2l-1.2 20.1c-.1 2.5 1.7 4.6 4.2 4.8h.3c.7 0 1.4-.2 2-.5l18-9c2.2-1.1 3.1-3.8 2-6-.4-.7-.9-1.3-1.5-1.8zm-1.4 6-18 9c-.4.2-.8.3-1.3.3-.4 0-.9-.2-1.2-.4-.7-.5-1.2-1.3-1.1-2.2l1.2-20.1c.1-.9.6-1.7 1.4-2.1.8-.4 1.7-.3 2.5.1L77 43.3c1.2.8 1.5 2.3.7 3.4-.2.4-.5.7-.9.9z"
                      fill="currentColor"
                    />
                  </svg>
                </div>
                <div
                  className=" mx-auto"
                  uk-scrollspy-class="uk-animation-slide-bottom-small"
                >
                  <button
                    type="button"
                    className="text-white bg-blue-600 rounded-lg py-1.5 px-4 text-sm dark:bg-white/5"
                  >
                    {" "}
                    Select from Device
                  </button>
                </div>
              </div>
              <img
                id="addPostImage"
                src={preview ? preview : ""}
                alt="Uploaded Image"
                accept="image/png, image/jpeg"
                style={{ display: preview ? "block" : "none" }}
                className="w-full h-full absolute object-cover fff"
              />
            </div>
          </div>
          <div className="relative w-auto border-l dark:border-slate-700"></div>
          <div className="lg:w-[300px] lg:max-h-[600px] h-[450px] overflow-y-auto before:uk-animation-slide-right-small">
            <div>
              <textarea
                name
                id
                rows={1}
                placeholder="What is going on.."
                className="w-[95%] ml-2 mt-1 resize-none"
                style={{ overflowY: "hidden" }}
                defaultValue={""}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = `${e.target.scrollHeight}px`;
                }}
                onChange={(e) => setContent(e.target.value)}
              />
              <input
                required
                type="text"
                name
                id
                rows={4}
                placeholder="Title"
                className="w-[95%] ml-2"
                defaultValue={""}
                onChange={(e) => setTitle(e.target.value)}
                value={title}
              />
              <ul
                className="divide-y divide-gray-100 dark:divide-slate-700"
                uk-nav="multiple: true"
              >
                <li className="uk-parent uk-open">
                  <a
                    href="#"
                    className="flex items-center justify-between py-2 px-3.5 group "
                    aria-expanded="true"
                  >
                    <h4 className="font-medium text-sm"> Accessibility</h4>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6 group-aria-expanded:rotate-180 duration-200"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 15.75l7.5-7.5 7.5 7.5"
                      />
                    </svg>
                  </a>
                  <ul className="-space-y-1">
                    <li>
                      <div className="p-4">
                        <p className="text-[13px] font-medium">
                          {" "}
                          Hashtags Improve Searchability of your public posts.{" "}
                        </p>
                        <input
                          required
                          type="text"
                          placeholder="#Hashtags"
                          className="w-full mt-3"
                          onChange={(e) => {
                            const hashtags = e.target.value
                              .trim()
                              .split(/\s+/)
                              .map((tag) => tag.replace(/^#/, ""));
                            setHashtags(hashtags);
                          }}
                        />
                      </div>
                    </li>
                    <li>
                      <div className="flex items-center justify-between py-2 px-3.5">
                        <input
                          required
                          type="text"
                          placeholder="Add locations"
                          className="font-medium text-sm w-full !bg-transparent !px-0 focus:!border-transparent focus:!ring-transparent"
                        />
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          strokeWidth="1.5"
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                          />
                        </svg>
                      </div>
                    </li>
                  </ul>
                </li>
                <li className="uk-parent uk-open">
                  <a
                    href="#"
                    className="flex items-center justify-between py-2 px-3.5 group "
                    aria-expanded="true"
                  >
                    <h4 className="font-medium text-sm"> Capsule Settings</h4>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-6 h-6 group-aria-expanded:rotate-180 duration-200"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4.5 15.75l7.5-7.5 7.5 7.5"
                      />
                    </svg>
                  </a>
                  <ul className="-space-y-2">
                    <li>
                      <div className="p-4">
                        <label className="switch flex justify-between items-start gap-4 cursor-pointer min-h-[30px]">
                          <div>
                            <h4 className="font-medium text-sm"> Private</h4>
                          </div>
                          <input
                            required
                            type="checkbox"
                            onChange={(e) => setIsPrivate(e.target.checked)}
                          />
                          <span className="switch-button !relative shrink-0" />
                        </label>
                      </div>
                    </li>
                    <li>
                      <div className="flex items-center justify-between py-2 px-3.5">
                        <input
                          required
                          type="datetime-local"
                          onChange={(e) => {
                            const date = new Date(e.target.value);
                            date.setHours(date.getHours() + 5);
                            date.setMinutes(date.getMinutes() + 30);
                            const formattedDate = date
                              .toISOString()
                              .slice(0, 16);
                            setDate(formattedDate);
                          }}
                          placeholder="Chrono Unlock"
                          className="font-medium text-sm w-full !bg-transparent !px-0 focus:!border-transparent focus:!ring-transparent"
                          onFocus={(e) => e.target.click()}
                        />
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          className="w-6 h-6"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6l4 2"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 6v6"
                          />
                          <circle cx={12} cy={12} r={10} strokeWidth={2} />
                        </svg>
                      </div>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
