import { useState, useEffect } from "react";
import { fetchUser, updateUser } from "./db";

const UserProfile = ({ currentUser }) => {
  const [userData, setUserData] = useState(currentUser);

  useEffect(() => {
    if (currentUser) {
      (async () => {
        const user = await fetchUser(currentUser.id);
        setUserData(user);
      })();
    }
  }, [currentUser]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSave = async (e) => {
    e.preventDefault();
    await updateUser(currentUser.id, userData);
  };

  return (
    <div>
      <h1>UserProfile</h1>
      {/* Render the userData and use the handleChange, handleSave functions to save changes */}
    </div>
  );
};

export default UserProfile;
