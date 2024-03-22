import PropTypes from "prop-types";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { authenticate } from "./db";

const Login = ({ setCurrentUser }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = await authenticate(username, password);
    if (user) {
      setCurrentUser(user);
      history.push("/");
    } else {
      alert("Invalid credentials");
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
