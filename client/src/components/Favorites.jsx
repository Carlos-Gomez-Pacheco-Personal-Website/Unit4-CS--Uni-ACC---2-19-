import { useState, useEffect } from "react";
import { fetchFavorites, addToFavorites, removeFromFavorites } from "./db";

const Favorites = ({ currentUser }) => {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (currentUser) {
      (async () => {
        const favoritesData = await fetchFavorites(currentUser.id);
        setFavorites(favoritesData);
      })();
    }
  }, [currentUser]);

  const handleAddToFavorites = async (product) => {
    if (currentUser) {
      await addToFavorites(currentUser.id, product);
      setFavorites((prevFavorites) => [...prevFavorites, product]);
    }
  };

  const handleRemoveFromFavorites = async (product) => {
    if (currentUser) {
      await removeFromFavorites(currentUser.id, product.id);
      setFavorites((prevFavorites) =>
        prevFavorites.filter((item) => item.id !== product.id)
      );
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
                Remove
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

export default Favorites;
