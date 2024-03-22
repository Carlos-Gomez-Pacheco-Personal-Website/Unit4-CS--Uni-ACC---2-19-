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

// import React, { useState, useEffect } from 'react';
// import { useParams } from 'react-router-dom';

// const ProductDetails = () => {
//   const { id } = useParams();
//   const [product, setProduct] = useState(null);

//   useEffect(() => {
//     // Fetch the product details from the API using the id
//   }, [id]);

//   if (!product) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <div>
//       <h2>{product.name}</h2>
//       {/* Display other product details */}
//     </div>
//   );
// };

// export default ProductDetails;
