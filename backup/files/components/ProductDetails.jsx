// ProductDetails.jsx
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const ProductDetails = ({ addToCart, addFavorite, auth }) => {
  const [product, setProduct] = useState(null);
  const { id } = useParams(); // Use useParams to get the id

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productId = id;
        const response = await fetch(`/api/products/${productId}`);
        if (response.ok) {
          const product = await response.json();
          setProduct(product);
        } else {
          console.error("Failed to fetch product:", response.status);
        }
      } catch (error) {
        console.error("Failed to fetch product:", error);
      }
    };

    fetchProduct();
  }, [id]);

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
      alert("Product added to favorites successfully!");
    } catch (error) {
      console.error("Failed to add product to favorites:", error);
    }
  };

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <button onClick={() => handleAddToCart(product)}>Add to Cart</button>
      <button onClick={() => handleAddToFavorites(product)}>
        Add to Favorites
      </button>
    </div>
  );
};

ProductDetails.propTypes = {
  addToCart: PropTypes.func.isRequired, // addToCart is required
  addFavorite: PropTypes.func.isRequired, // addFavorite is required
  auth: PropTypes.object.isRequired, // auth is required
};

export default ProductDetails;
