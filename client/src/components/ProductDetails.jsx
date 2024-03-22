// ProductDetails.jsx
import PropTypes from "prop-types";
import { useState, useEffect } from "react";

const ProductDetails = ({ currentUser, match }) => {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const productId = match.params.id;
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
  }, [match.params.id]);

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
    try {
      const response = await fetch(`/api/users/${currentUser.id}/favorites`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ product_id: product.id }),
      });

      if (response.ok) {
        alert("Product added to favorites successfully!");
      } else {
        alert("Failed to add product to favorites");
      }
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
  currentUser: PropTypes.any,
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.any,
    }),
  }),
};

export default ProductDetails;
