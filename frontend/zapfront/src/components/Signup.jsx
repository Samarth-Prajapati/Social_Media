import { useState,useContext } from "react";
import { useNavigate } from "react-router-dom";
import logo from "../assets/images/logo.png";
import AuthContext from "../context/Auth";
export default function Signup() {
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { loginUser } = useContext(AuthContext);

  async function handleSubmit(event) {
    
    event.preventDefault(); // Prevent the default form submission behavior

    try {
      // Send a POST request to the server with the form data
      const response = await fetch("http://localhost:8000/zapapp/register/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          first_name: firstName,
          last_name: lastName,
          email,
          password,
        }),
      });

      // Handle the response from the server
      if (response.ok) {
        alert("User Created Successfully!");
        loginUser(event);
      } else {
        // Handle the error
        alert("Something went wrong while creating the user!");
        navigate("/signup", { replace: true });
      }
    } catch (error) {
      // Handle the error
      console.error("Error during sign up:", error);
    }
  }
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen justify-center items-center">
      <div className="max-w-sm mx-auto md:px-10 p-4 w-full">
        <div uk="true">
          <div className="flex justify-center mb-6">
            <img
              src={logo}
              alt=""
              className="w-auto h-[10rem] shrink-0 px-1 rounded-2xl p-2.5"
            />
          </div>
          <div>
            <form
              onSubmit={handleSubmit}
              className="space-y-3"
              uk-scrollspy="target: > *; cls: uk-animation-scale-up; delay: 100 ;repeat: true"
            >
              <input
                className="!w-full"
                id="username"
                name="username"
                type="text"
                autoFocus
                placeholder="Username"
                required
                value={username}
                onChange={(event) => setUsername(event.target.value)}
              />
              <div className="flex gap-3">
                <div className="w-1/2">
                  <input
                    className="w-full"
                    id="firstname"
                    name="firstname"
                    type="text"
                    autoFocus
                    placeholder="First name"
                    required
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                  />
                </div>
                <div className="w-1/2">
                  <input
                    className="w-full"
                    id="lastname"
                    name="lastname"
                    type="text"
                    autoFocus
                    placeholder="Last name"
                    required
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                  />
                </div>
              </div>
              <input
                className="!w-full"
                id="email"
                name="email"
                type="email"
                autoFocus
                placeholder="Email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
              <input
                className="!w-full"
                id="password"
                name="password"
                type="password"
                autoFocus
                placeholder="Password"
                required
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <a href="#" className="hidden">
                <div className="text-sm text-right text-gray-400 py-4">
                  {" "}
                  Forget password{" "}
                </div>
              </a>
              <button
                type="submit"
                className="font-medium w-full rounded-lg bg-slate-900 py-1.5 px-4 text-white h-[38px] active:scale-[0.97] transition-all duration-150"
              >
                {" "}
                <span>Create Account</span>{" "}
              </button>
              <div className="text-black text-center mt-8 font-bold font-sans text-md subpixel-antialiased">
                OR
              </div>
              <button
                type="button"
                onClick={() => navigate("/login")}
                className="font-medium w-full rounded-lg bg-white py-1.5 px-4 text-slate-900 h-[38px] active:scale-[0.97] transition-all duration-150"
              >
                {" "}
                <span>Already Have an account? Log in</span>{" "}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
