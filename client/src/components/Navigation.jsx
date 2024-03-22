import PropTypes from "prop-types";
// import React from "react";
import { Link } from "react-router-dom";

const Navigation = ({ currentUser, setCurrentUser }) => {
  const handleLogout = () => {
    setCurrentUser(null);
  };

  return (
    <nav>
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        {!currentUser && (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Register</Link>
            </li>
          </>
        )}
        {currentUser && (
          <>
            <li>
              <Link to="/cart">Cart</Link>
            </li>
            <li>
              <Link to="/favorites">Favorites</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
            <li>
              <button onClick={handleLogout}>Logout</button>
            </li>
          </>
        )}
        {currentUser && currentUser.isAdmin && (
          <li>
            <Link to="/admin">Admin Panel</Link>
          </li>
        )}
      </ul>
    </nav>
  );
};

Navigation.propTypes = {
  currentUser: PropTypes.shape({
    isAdmin: PropTypes.any,
  }),
  setCurrentUser: PropTypes.func,
};

export default Navigation;
