// Register.jsx
import PropTypes from "prop-types";
import { useState } from "react";

const Register = ({ register }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({ username, password });
    } catch (error) {
      console.error("Failed to register:", error);
      alert("Failed to register. Please try again.");
      setError(error.message);
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
      <button disabled={!username || !password}>Register</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

Register.propTypes = {
  register: PropTypes.func.isRequired, // register is required
};

export default Register;
