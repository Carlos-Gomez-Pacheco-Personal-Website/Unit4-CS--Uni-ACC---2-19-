import { useState, useEffect, lazy, Suspense } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import "./App.css";
import ErrorBoundary from "./components/ErrorBoundary";
import { UserContext } from "./context/UserContext";
import { loadUser, setUser } from "./localStorage";

// Lazy-loaded components
const Navigation = lazy(() => import("./components/Navigation"));
const Login = lazy(() => import("./components/Login"));
const Register = lazy(() => import("./components/Register"));
const Products = lazy(() => import("./components/Products"));
const ProductDetails = lazy(() => import("./components/ProductDetails"));
const Cart = lazy(() => import("./components/Cart"));
const Favorites = lazy(() => import("./components/Favorites"));
const Checkout = lazy(() => import("./components/Checkout"));
const Confirmation = lazy(() => import("./components/Confirmation"));
const UserProfile = lazy(() => import("./components/UserProfile"));
const AdminPanel = lazy(() => import("./components/AdminPanel"));

function App() {
  const [currentUser, setCurrentUser] = useState(loadUser());

  useEffect(() => {
    if (currentUser) {
      setUser(currentUser);
    }
  }, [currentUser]);

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser }}>
      <Router>
        <ErrorBoundary>
          <Suspense fallback={<div>Loading...</div>}>
            <Navigation />
            <Switch>
              <Route exact path="/" component={Products} />
              <Route path="/products/:id" component={ProductDetails} />
              <Route path="/login" component={Login} />
              <Route path="/register" component={Register} />
              <Route path="/cart" component={Cart} />
              <Route path="/favorites" component={Favorites} />
              <Route path="/checkout" component={Checkout} />
              <Route path="/confirmation" component={Confirmation} />
              <Route path="/profile" component={UserProfile} />
              <Route path="/admin" component={AdminPanel} />
            </Switch>
          </Suspense>
        </ErrorBoundary>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
