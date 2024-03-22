import { useState, useEffect } from "react";
import { fetchProductById } from "./db";

const ProductDetails = ({ currentUser, match }) => {
  const [product, setProduct] = useState(null);

  useEffect(() => {
    (async () => {
      const productId = match.params.id;
      const product = await fetchProductById(productId);
      setProduct(product);
    })();
  }, []);

  if (!product) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h1>{product.name}</h1>
      {/* Render product details here */}
    </div>
  );
};

export default ProductDetails;
