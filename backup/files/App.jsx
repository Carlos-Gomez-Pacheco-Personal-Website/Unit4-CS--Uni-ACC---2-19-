import { BrowserRouter as Router, Route } from "react-router-dom";
import "./App.css";
import { useState, useEffect } from "react";

// Normal imports
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

function App() {
  const [auth, setAuth] = useState({});
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    attemptLoginWithToken();
  }, []);

  const attemptLoginWithToken = async () => {
    const token = window.localStorage.getItem("token");
    if (token) {
      const response = await fetch(`/api/auth/me`, {
        headers: {
          authorization: token,
        },
      });
      const json = await response.json();
      if (response.ok) {
        setAuth(json);
      } else {
        window.localStorage.removeItem("token");
      }
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("/api/products");
      const json = await response.json();
      setProducts(json);
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const fetchFavorites = async () => {
      const response = await fetch(`/api/users/${auth.id}/favorites`, {
        headers: {
          "Content-Type": "application/json",
          authorization: window.localStorage.getItem("token"),
        },
      });
      const json = await response.json();
      if (response.ok) {
        setFavorites(json);
      }
    };
    if (auth.id) {
      fetchFavorites();
    } else {
      setFavorites([]);
    }
  }, [auth]);

  const login = async (credentials) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await response.json();
    if (response.ok) {
      window.localStorage.setItem("token", json.token);
      attemptLoginWithToken();
    } else {
      console.log(json);
      const error = await response.json();
      throw new Error(error.message);
    }
  };

  const addFavorite = async (product_id) => {
    const response = await fetch(`/api/users/${auth.id}/favorites`, {
      method: "POST",
      body: JSON.stringify({ product_id }),
      headers: {
        "Content-Type": "application/json",
        authorization: window.localStorage.getItem("token"),
      },
    });

    const json = await response.json();
    if (response.ok) {
      setFavorites([...favorites, json]);
    } else {
      console.log(json);
    }
  };

  const removeFavorite = async (id) => {
    const response = await fetch(`/api/users/${auth.id}/favorites/${id}`, {
      method: "DELETE",
      headers: {
        authorization: window.localStorage.getItem("token"),
      },
    });

    if (response.ok) {
      setFavorites(favorites.filter((favorite) => favorite.id !== id));
    } else {
      console.log();
    }
  };

  const logout = () => {
    window.localStorage.removeItem("token");
    setAuth({});
  };

  const register = async (credentials) => {
    const response = await fetch("/api/users", {
      method: "POST",
      body: JSON.stringify(credentials),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const json = await response.json();
    if (response.ok) {
      window.localStorage.setItem("token", json.token);
    } else {
      console.log(json);
    }
  };

  const addToCart = async (product_id) => {
    if (!auth || !auth.id) {
      alert("Please log in to add items to the cart.");
      return;
    }

    const response = await fetch(`/api/users/${auth.id}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: window.localStorage.getItem("token"),
      },
      body: JSON.stringify({ product_id }),
    });

    const json = await response.json();
    if (response.ok) {
      alert("Product added to cart successfully!");
    } else {
      console.log(json);
    }
  };

  return (
    <Router>
      <Navigation logout={logout} /> {/* Pass logout function as prop */}
      <Route exact path="/" render={() => <Products products={products} />} />
      <Route
        exact
        path="/products"
        render={() => <Products products={products} />}
      />
      <Route
        exact
        path="/products/:id"
        render={() => (
          <ProductDetails
            addToCart={addToCart}
            addFavorite={addFavorite}
            auth={auth}
          />
        )}
      />
      <Route exact path="/login" render={() => <Login login={login} />} />
      <Route
        exact
        path="/register"
        render={() => <Register register={register} />}
      />
      <Route
        exact
        path="/cart"
        render={() => <Cart addToCart={addToCart} auth={auth} />}
      />{" "}
      {/* Pass addToCart function as prop */}
      <Route
        exact
        path="/favorites"
        render={() => (
          <Favorites
            addFavorite={addFavorite}
            removeFavorite={removeFavorite}
            addToCart={addToCart}
            auth={auth}
          />
        )}
      />{" "}
      {/* Pass addToCart function as prop */}
      <Route exact path="/checkout" component={Checkout} />
      <Route exact path="/confirmation" component={Confirmation} />
      <Route exact path="/profile" component={UserProfile} />
      <Route exact path="/admin" component={AdminPanel} />
    </Router>
  );
}

export default App;
