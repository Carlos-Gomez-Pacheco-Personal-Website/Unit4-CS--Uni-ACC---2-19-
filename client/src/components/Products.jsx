import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { fetchProducts } from "./db";

const Products = ({ currentUser }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    (async () => {
      const results = await fetchProducts();
      setProducts(results);
    })();
  }, []);

  return (
    <div>
      <h1>Products</h1>
      {/* Render products here */}
    </div>
  );
};

Products.propTypes = {
  currentUser: PropTypes.any,
};

export default Products;
