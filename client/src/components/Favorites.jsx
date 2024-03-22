import PropTypes from "prop-types";
import { useState, useEffect } from "react";

const Favorites = ({ currentUser }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (currentUser) {
      (async () => {
        const response = await fetch(`/api/users/${currentUser.id}/favorites`);
        const favoritesData = await response.json();
        setFavorites(favoritesData);
      })();
    }
  }, [currentUser]);

  const handleAddToFavorites = async (product) => {
    if (currentUser) {
      const response = await fetch(`/api/users/${currentUser.id}/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      if (response.ok) {
        setFavorites((prevFavorites) => [...prevFavorites, product]);
      } else {
        alert("Failed to add to favorites");
      }
    }
  };

  const handleRemoveFromFavorites = async (product) => {
    if (currentUser) {
      const response = await fetch(
        `/api/users/${currentUser.id}/favorites/${product.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setFavorites((prevFavorites) =>
          prevFavorites.filter((item) => item.id !== product.id)
        );
      } else {
        alert("Failed to remove from favorites");
      }
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
      {/* Add a form or input fields to add products to favorites */}
    </div>
  );
};

Favorites.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.any,
  }),
};

export default Favorites;
