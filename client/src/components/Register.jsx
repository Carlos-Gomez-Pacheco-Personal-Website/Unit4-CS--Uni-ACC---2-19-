// Register.jsx
import PropTypes from "prop-types";
import { useState } from "react";

const Register = ({ register, onRegister }) => {
  // Destructure onRegister from props
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register({ username, password });
      onRegister(); // Call the onRegister function after a successful registration
    } catch (error) {
      console.error("Failed to register:", error);
      alert("Failed to register. Please try again.");
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
      <button type="submit">Register</button>
    </form>
  );
};

Register.propTypes = {
  register: PropTypes.func.isRequired, // register is required
  onRegister: PropTypes.func.isRequired, // onRegister is required
};

export default Register;
