import PropTypes from "prop-types";
import { useState, useEffect } from "react";

const Favorites = ({ currentUser }) => {
  const [favorites, setFavorites] = useState([]);
  const [productId, setProductId] = useState("");

  useEffect(() => {
    if (currentUser) {
      const fetchFavorites = async () => {
        try {
          const response = await fetch(
            `/api/users/${currentUser.id}/favorites`
          );
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
  }, [currentUser]);

  const handleAddToCart = async (product) => {
    try {
      const response = await fetch(`/api/users/${currentUser.id}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product_id: product.id }),
      });

      if (response.ok) {
        alert("Product added to cart successfully!");
      } else {
        alert("Failed to add product to cart");
      }
    } catch (error) {
      console.error("Failed to add product to cart:", error);
    }
  };

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
  currentUser: PropTypes.any,
};

export default Favorites;
