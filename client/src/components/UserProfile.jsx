import { useState, useEffect } from "react";
import PropTypes from "prop-types";

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
      <h1>UserProfile</h1>
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
    // Include other user properties as needed
  }),
};

export default UserProfile;
