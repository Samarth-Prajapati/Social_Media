import { createContext, useState } from "react";

const ProfileContext = createContext(null);

function ProfileProvider({ children }) {
  const [profileData, setProfileData] = useState(null);

  return (
    <ProfileContext.Provider value={{ profileData, setProfileData }}>
      {children}
    </ProfileContext.Provider>
  );
}

export { ProfileContext, ProfileProvider };