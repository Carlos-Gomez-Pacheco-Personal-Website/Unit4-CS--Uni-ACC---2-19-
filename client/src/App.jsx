import { useState, useEffect } from "react";
import "./App.css";
import Navigation from "./components/Navigation";
import Login from "./components/Login";
import Register from "./components/Register";
import Products from "./components/Products";
import ProductDetails from "./components/ProductDetails";
import Cart from "./components/Cart";
import Favorites from "./components/Favorites";
import Checkout from "./components/Checkout";
import Confirmation from "./components/Confirmation";
import UserProfile from "./components/UserProfile";
import AdminPanel from "./components/AdminPanel";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { loadUser, setUser } from "./localStorage";

function App() {
  const [currentUser, setCurrentUser] = useState(loadUser());

  useEffect(() => {
    setUser(currentUser);
  }, [currentUser]);

  return (
    <div className="App">
      <Router>
        <Navigation currentUser={currentUser} setCurrentUser={setCurrentUser} />
        <Switch>
          <Route
            path="/"
            exact
            component={() => <Products currentUser={currentUser} />}
          />
          <Route
            path="/products/:id"
            component={(props) => (
              <ProductDetails {...props} currentUser={currentUser} />
            )}
          />
          <Route
            path="/login"
            component={() => <Login setCurrentUser={setCurrentUser} />}
          />
          <Route path="/register" component={() => <Register />} />
          <Route
            path="/cart"
            component={() => <Cart currentUser={currentUser} />}
          />
          <Route
            path="/favorites"
            component={() => <Favorites currentUser={currentUser} />}
          />
          <Route
            path="/checkout"
            component={() => <Checkout currentUser={currentUser} />}
          />
          <Route path="/confirmation" component={() => <Confirmation />} />
          <Route
            path="/profile"
            component={() => <UserProfile currentUser={currentUser} />}
          />
          <Route
            path="/admin"
            component={() => <AdminPanel currentUser={currentUser} />}
          />
        </Switch>
      </Router>
    </div>
  );
}

export default App;
