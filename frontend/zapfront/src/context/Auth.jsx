import { createContext, useState, useEffect, useCallback } from "react";
import jwtDecode from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
const AuthContext = createContext();

export default AuthContext;

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState( localStorage.getItem('zapmateAuthTokens')?jwtDecode(JSON.parse(localStorage.getItem('zapmateAuthTokens')).access) : null);
  const [authTokens, setAuthTokens] = useState( localStorage.getItem('zapmateAuthTokens')?JSON.parse(localStorage.getItem('zapmateAuthTokens')) : null);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(  localStorage.getItem('zapmateAuthTokens')?true : false);

  const loginUser = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch("http://localhost:8000/zapapp/api/token/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: e.target.username.value,
          password: e.target.password.value,
        }),
      });

      if (response.status === 401) {
        toast.error("Invalid Credentials");
        setLoading(false);
        navigate("/login", { replace: true });
        return;
      }

      const data = await response.json();

      if (data) {
        localStorage.setItem("zapmateAuthTokens", JSON.stringify(data));
        setAuthTokens(data);
        setUser(jwtDecode(data.access));
        setIsAuthenticated(true);
        setLoading(false);
        navigate("/", { replace: true });
      } else {
        setLoading(false);
        alert("Something went wrong while logging in the user!");
      }
    } catch (error) {
      setLoading(false);
      console.error("Error during login:", error);
    }
  };

  const logoutUser = useCallback(() => {
    localStorage.removeItem("zapmateAuthTokens");
    setAuthTokens(null);
    setUser(null);
    navigate("/login", { replace: true });
    setIsAuthenticated(false);
  }, []);

  const updateToken = useCallback(async () => {
    try {
      const response = await fetch(
        "http://localhost:8000/zapapp/api/token/refresh/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ refresh: authTokens?.refresh }),
        }
      );

      const data = await response.json();

      if (response.status === 200) {
        setAuthTokens((prevTokens) => ({
          ...prevTokens,
          access: data.access,
        }));
        setUser(jwtDecode(data.access));
        setIsAuthenticated(true);
        localStorage.setItem(
          "zapmateAuthTokens",
          JSON.stringify({
            ...authTokens,
            access: data.access,
          })
        );
      } else {
        logoutUser();
      }

      if (loading) {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error during token refresh:", error);
      logoutUser();
    }
  }, [authTokens, logoutUser]);

  useEffect(() => {
    const REFRESH_INTERVAL = 1000 * 60 * 60 * 24; // 1 Day
    let interval = null;

    if (authTokens) {
      interval = setInterval(() => {
        updateToken();
      }, REFRESH_INTERVAL);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [authTokens, updateToken]);

  const contextData = {
    user,
    authTokens,
    loginUser,
    logoutUser,
    isAuthenticated,
    loading,
  };
  return (
    <AuthContext.Provider value={contextData}>
      {children}
    </AuthContext.Provider>
  );
};
