import PropTypes from "prop-types";
import { useState, useEffect } from "react";

const ProductDetails = ({ currentUser, match }) => {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    (async () => {
      const productId = match.params.id;
      const response = await fetch(`/api/products/${productId}`);
      const product = await response.json();
      setProduct(product);
    })();
  }, []);

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
