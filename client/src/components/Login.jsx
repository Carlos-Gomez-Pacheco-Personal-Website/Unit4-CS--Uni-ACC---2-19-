// Login.jsx
import PropTypes from "prop-types";
import { useState } from "react";
import { useHistory } from "react-router-dom";

const Login = ({ setCurrentUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const user = await response.json();
        setCurrentUser(user);
        history.push("/");
      } else {
        alert("Invalid credentials");
      }
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
  setCurrentUser: PropTypes.func,
};

export default Login;
