import PropTypes from "prop-types";
import { useState, useEffect } from "react";

const Favorites = ({ addFavorite, removeFavorite, addToCart, auth }) => {
  // Destructure addFavorite, removeFavorite, and auth from props
  const [favorites, setFavorites] = useState([]);
  const [productId, setProductId] = useState("");

  useEffect(() => {
    if (auth.id) {
      const fetchFavorites = async () => {
        try {
          const response = await fetch(`/api/users/${auth.id}/favorites`);
          if (response.ok) {
            const favoritesData = await response.json();
            setFavorites(favoritesData);
          } else {
            console.error("Failed to fetch favorites:", response.status);
          }
        } catch (error) {
          console.error("Failed to fetch favorites:", error);
        }
      };

      fetchFavorites();
    }
  }, [auth]);

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product.id); // Use addToCart function passed from App.jsx
      alert("Product added to cart successfully!");
    } catch (error) {
      console.error("Failed to add product to cart:", error);
    }
  };

  const handleAddToFavorites = async (product) => {
    try {
      await addFavorite(product.id); // Use addFavorite function passed from App.jsx
      setFavorites((prevFavorites) => [...prevFavorites, product]);
    } catch (error) {
      console.error("Failed to add to favorites:", error);
    }
  };

  const handleRemoveFromFavorites = async (product) => {
    try {
      await removeFavorite(product.id); // Use removeFavorite function passed from App.jsx
      setFavorites((prevFavorites) =>
        prevFavorites.filter((item) => item.id !== product.id)
      );
    } catch (error) {
      console.error("Failed to remove from favorites:", error);
    }
  };

  return (
    <div>
      <h1>Favorites</h1>
      {favorites.length === 0 ? (
        <p>No favorites added yet.</p>
      ) : (
        <ul>
          {favorites.map((product) => (
            <li key={product.id}>
              {product.name}
              <button onClick={() => handleRemoveFromFavorites(product)}>
                Remove from Favorites
              </button>
              <button onClick={() => handleAddToCart(product)}>
                Add to Cart
              </button>
            </li>
          ))}
        </ul>
      )}
      <h2>Add a product to your favorites:</h2>
      <form onSubmit={handleAddToFavorites}>
        <input
          type="text"
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          placeholder="Enter product ID"
        />
        <button type="submit">Add to Favorites</button>
      </form>
    </div>
  );
};

Favorites.propTypes = {
  addFavorite: PropTypes.func.isRequired, // addFavorite is required
  addToCart: PropTypes.func,
  auth: PropTypes.object.isRequired, // auth is required
  removeFavorite: PropTypes.func.isRequired, // removeFavorite is required
};

export default Favorites;
