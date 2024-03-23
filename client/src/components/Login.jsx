// Login.jsx
import PropTypes from "prop-types";
import { useState } from "react";

const Login = ({ login, onLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ username, password });
      onLogin(); // Call the onLogin function after a successful login
    } catch (error) {
      console.error("Failed to login:", error);
      alert("Failed to login. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Username:
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </label>
      <label>
        Password:
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </label>
      <button type="submit">Login</button>
    </form>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
  onLogin: PropTypes.func.isRequired,
};

export default Login;
