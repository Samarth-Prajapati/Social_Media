import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/Auth";
import logo from "../assets/images/logo.png";
import { ToastContainer } from "react-toastify";
function Login() {
  let { loginUser } = useContext(AuthContext);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const onchangeUsername = (event) => {
    console.log(event.target.value);
    setUsername(event.target.value);
  };

  const onchangePassword = (event) => {
    console.log(event.target.value);
    setPassword(event.target.value);
  };

  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen justify-center items-center">
      <ToastContainer />
      <div className="max-w-sm mx-auto md:px-10 p-4 w-full">
        <div uk="true">
          <div className="flex justify-center mb-6">
            <img
              src={logo}
              alt=""
              className="w-auto h-[10rem] shrink-0 px-1 rounded-2xl p-2.5"
            />
          </div>
          <form
            onSubmit={loginUser}
            method="POST"
            action="#"
            className="space-y-3"
            data-uk-scrollspy="target: > *; cls: uk-animation-scale-up; delay: 100 ;repeat: true"
          >
            <input
              className="w-full"
              id="username"
              name="username"
              type="text"
              onChange={onchangeUsername}
              autoFocus
              placeholder="Username"
              required
            />
            <input
              className="w-full"
              id="password"
              name="password"
              type="password"
              onChange={onchangePassword}
              autoFocus
              placeholder="Password"
              required
            />
            <button
              type="submit"
              className="font-medium w-full rounded-lg bg-slate-900 py-1.5 px-4 text-white h-[38px] active:scale-97 transition-all duration-150"
            >
              {" "}
              <span>Sign in</span>{" "}
            </button>
            <div className="text-black text-center mt-8 font-bold font-sans text-md subpixel-antialiased">
              OR
            </div>
            <button
              type="button"
              onClick={() => navigate("/signup")}
              className="font-medium w-full rounded-lg bg-white py-1.5 px-4 text-slate-900 h-[38px] active:scale-97 transition-all duration-150"
            >
              {" "}
              <span>New? Sign Up</span>{" "}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Login;