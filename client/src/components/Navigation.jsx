// Navigation.jsx
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "./Navigation.css"; // Import the CSS file

const Navigation = ({ currentUser }) => {
  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        {!currentUser && (
          <>
            {/* <li>
              <Link to="/products">Products</Link>
            </li> */}
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
          </>
        )}
        {currentUser && currentUser.isAdmin && (
          <li>
            <Link to="/admin">Admin</Link>
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
};

export default Navigation;
