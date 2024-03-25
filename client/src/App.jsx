import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./index.css";

// Login component
const Login = ({ login }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const submitLogin = (ev) => {
    ev.preventDefault();
    login({ username, password });
  };
  return (
    <form onSubmit={submitLogin}>
      <input
        value={username}
        placeholder="username"
        onChange={(ev) => setUsername(ev.target.value)}
      />
      <input
        value={password}
        placeholder="password"
        onChange={(ev) => setPassword(ev.target.value)}
      />
      <button disabled={!username || !password}>Login</button>
    </form>
  );
};

Login.propTypes = {
  login: PropTypes.func,
};
// Register Component
const Register = ({ register }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submitRegister = async (ev) => {
    ev.preventDefault();
    try {
      await register({ username, password });
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={submitRegister}>
      <input
        value={username}
        placeholder="username"
        onChange={(ev) => setUsername(ev.target.value)}
      />
      <input
        value={password}
        placeholder="password"
        onChange={(ev) => setPassword(ev.target.value)}
      />
      <button disabled={!username || !password}>Register</button>
      {error && <div className="error">{error}</div>}
    </form>
  );
};

Register.propTypes = {
  register: PropTypes.func,
};

const Cart = ({ cart, updateCart, checkout, removeFromCart }) => {
  return (
    <div className="cart">
      <h2>Cart</h2>
      {cart.map((item) =>
        item.product ? (
          <div key={item.id}>
            <p>{item.product.name}</p>
            <p>Price: {item.product.price}</p>
            <button onClick={() => updateCart(item.id, item.quantity - 1)}>
              -
            </button>
            <span>{item.quantity}</span>
            <button onClick={() => updateCart(item.id, item.quantity + 1)}>
              +
            </button>
            <button onClick={() => removeFromCart(item.id)}>Remove</button>
          </div>
        ) : null
      )}
      <button onClick={checkout}>Checkout</button>
    </div>
  );
};

Cart.propTypes = {
  cart: PropTypes.array,
  updateCart: PropTypes.func,
  checkout: PropTypes.func,
  removeFromCart: PropTypes.func,
};
// Order component
const Orders = ({ orders }) => {
  return (
    <div className="orders">
      <h2>Orders</h2>
      {orders.map((order) => (
        <div key={order.id}>
          <p>Order ID: {order.id}</p>
          <p>Total: {order.total}</p>
        </div>
      ))}
    </div>
  );
};

Orders.propTypes = {
  orders: PropTypes.array,
};

function App() {
  const [auth, setAuth] = useState({});
  const [products, setProducts] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);

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
  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      const response = await fetch("/api/products");
      const json = await response.json();
      setProducts(json);
    };

    fetchProducts();
  }, []);
  // Fetch favorites
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
  // Fetch Cart
  useEffect(() => {
    const fetchCart = async () => {
      const response = await fetch(`/api/users/${auth.id}/cart`, {
        headers: {
          "Content-Type": "application/json",
          authorization: window.localStorage.getItem("token"),
        },
      });
      const json = await response.json();
      if (response.ok) {
        setCart(json);
      }
    };
    if (auth.id) {
      fetchCart();
    } else {
      setCart([]);
    }
  }, [auth]);
  // Fetch Order
  useEffect(() => {
    const fetchOrders = async () => {
      const response = await fetch(`/api/users/${auth.id}/orders`, {
        headers: {
          "Content-Type": "application/json",
          authorization: window.localStorage.getItem("token"),
        },
      });
      const json = await response.json();
      if (response.ok) {
        setOrders(json);
      }
    };
    if (auth.id) {
      fetchOrders();
    } else {
      setOrders([]);
    }
  }, [auth]);

  //New AutoForm

  const AuthForm = ({ action }) => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const submitForm = async (ev) => {
      ev.preventDefault();
      try {
        await action({ username, password });
      } catch (err) {
        setError(err.message);
      }
    };

    return (
      <form onSubmit={submitForm}>
        <input
          value={username}
          placeholder="username"
          onChange={(ev) => setUsername(ev.target.value)}
        />
        <input
          value={password}
          placeholder="password"
          onChange={(ev) => setPassword(ev.target.value)}
        />
        <button disabled={!username || !password}>
          {action === login ? "Login" : "Register"}
        </button>
        {error && <div className="error">{error}</div>}
      </form>
    );
  };

  AuthForm.propTypes = {
    action: PropTypes.func,
  };

  // Internal Functions To Routes
  // Login
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
    const response = await fetch("/api/auth/register", {
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
  // New Functions Cart and Checkout

  const addToCart = async (product_id) => {
    const response = await fetch(`/api/users/${auth.id}/cart`, {
      method: "POST",
      body: JSON.stringify({ user_id: auth.id, product_id, quantity: 1 }), // add user_id and quantity
      headers: {
        "Content-Type": "application/json",
        authorization: window.localStorage.getItem("token"),
      },
    });

    const json = await response.json();
    if (response.ok) {
      setCart([...cart, json]);
    } else {
      console.log(json);
    }
  };

  const removeFromCart = async (id) => {
    const response = await fetch(`/api/users/${auth.id}/cart/${id}`, {
      method: "DELETE",
      headers: {
        authorization: window.localStorage.getItem("token"),
      },
    });

    if (response.ok) {
      setCart(cart.filter((item) => item.id !== id));
    } else {
      console.log();
    }
  };

  const updateCart = async (id, quantity) => {
    const response = await fetch(`/api/users/${auth.id}/cart/${id}`, {
      method: "PUT",
      body: JSON.stringify({ quantity }),
      headers: {
        "Content-Type": "application/json",
        authorization: window.localStorage.getItem("token"),
      },
    });

    const json = await response.json();
    if (response.ok) {
      setCart(cart.map((item) => (item.id === id ? json : item)));
    } else {
      console.log(json);
    }
  };

  const checkout = async () => {
    const response = await fetch(`/api/users/${auth.id}/checkout`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        authorization: window.localStorage.getItem("token"),
      },
    });

    const json = await response.json();
    if (response.ok) {
      setCart([]);
      setOrders([...orders, json]);
    } else {
      console.log(json);
    }
  };

  //   return (
  //     <>
  //       {!auth.id ? (
  //         <div className="auth-container">
  //           <Login login={login} />
  //           <Register register={register} />
  //         </div>
  //       ) : (
  //         <>
  //           <button onClick={logout}>Logout {auth.username}</button>
  //           <Cart
  //             cart={cart}
  //             updateCart={updateCart}
  //             checkout={checkout}
  //             removeFromCart={removeFromCart}
  //           />
  //           <Orders orders={orders} />
  //         </>
  //       )}
  //       <ul>
  //         {products.map((product) => {
  //           const isFavorite = favorites.find(
  //             (favorite) => favorite.product_id === product.id
  //           );
  //           return (
  //             <li key={product.id} className={isFavorite ? "favorite" : ""}>
  //               {product.name}
  //               {product.image}
  //               {product.price}
  //               {auth.id && isFavorite && (
  //                 <button onClick={() => removeFavorite(isFavorite.id)}>-</button>
  //               )}
  //               {auth.id && !isFavorite && (
  //                 <button onClick={() => addFavorite(product.id)}>+</button>
  //               )}
  //               {auth.id && (
  //                 <button onClick={() => addToCart(product.id)}>
  //                   Add to Cart
  //                 </button>
  //               )}
  //             </li>
  //           );
  //         })}
  //       </ul>
  //     </>
  //   );
  // }
  return (
    <Router>
      <div className="navbar">
        <Link to="/">Home</Link>
        {auth.id && <Link to="/cart">Cart</Link>}
        {auth.id && <Link to="/orders">Orders</Link>}
      </div>

      <Switch>
        <Route path="/cart">
          <Cart
            cart={cart}
            updateCart={updateCart}
            checkout={checkout}
            removeFromCart={removeFromCart}
          />
        </Route>

        <Route path="/orders">
          <Orders orders={orders} />
        </Route>

        <Route path="/">
          {!auth.id ? (
            <div className="auth-container">
              <AuthForm action={login} />
              <AuthForm action={register} />
            </div>
          ) : (
            <button onClick={logout}>Logout {auth.username}</button>
          )}
          <ul className="product-list">
            {products.map((product) => {
              const isFavorite = favorites.find(
                (favorite) => favorite.product_id === product.id
              );
              return (
                <li key={product.id} className={isFavorite ? "favorite" : ""}>
                  <div className="product-details">
                    <ul>Name: {product.name}</ul>
                    <ul>{product.image}</ul>
                    <ul>Price: ${product.price}</ul>
                  </div>
                  {auth.id && (
                    <div className="product-actions">
                      {isFavorite ? (
                        <button onClick={() => removeFavorite(isFavorite.id)}>
                          Remove from Favorites
                        </button>
                      ) : (
                        <button onClick={() => addFavorite(product.id)}>
                          Add to Favorites
                        </button>
                      )}
                      <button onClick={() => addToCart(product.id)}>
                        Add to Cart
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
