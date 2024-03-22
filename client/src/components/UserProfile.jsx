import PropTypes from "prop-types";
import { useState, useEffect } from "react";

const UserProfile = ({ currentUser }) => {
  const [userData, setUserData] = useState(currentUser);

  useEffect(() => {
    if (currentUser) {
      (async () => {
        const response = await fetch(`/api/users/${currentUser.id}`);
        const user = await response.json();
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
    const response = await fetch(`/api/users/${currentUser.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      alert("Profile updated successfully");
    } else {
      alert("Failed to update profile");
    }
  };

  return (
    <div>
      <h1>User Profile</h1>
      <p>Username: {userData?.username}</p>
      <p>Email: {userData?.email}</p>
      <form onSubmit={handleSave}>
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={userData.username}
            onChange={handleChange}
          />
        </label>
        {/* Add other fields as needed */}
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

UserProfile.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.number,
    username: PropTypes.string,
  }),
};

export default UserProfile;
