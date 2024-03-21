// import { useState } from "react";
import "./App.css";
import Navigation from "./components/Navigation";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
  return (
    <div className="App">
      <Navigation />
      <Login />
      <Register />
    </div>
  );
}

export default App;
