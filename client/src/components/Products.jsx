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

// import React, { useState, useEffect } from 'react';

// const Products = () => {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     // Fetch products from the API and set state
//   }, []);

//   return (
//     <div>
//       {products.map((product) => (
//         <div key={product.id}>
//           <h3>{product.name}</h3>
//           {/* Render other product details */}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Products;
