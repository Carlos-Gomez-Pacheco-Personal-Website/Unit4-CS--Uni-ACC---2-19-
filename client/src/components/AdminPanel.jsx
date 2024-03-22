import { useState, useEffect } from "react";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "./db";

const AdminPanel = ({ currentUser }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    (async () => {
      const productsData = await fetchProducts();
      setProducts(productsData);
    })();
  }, []);

  const handleAddProduct = async (product) => {
    await createProduct(product);
    setProducts((prevProducts) => [...prevProducts, product]);
  };

  // Add handleUpdateProduct, handleDeleteProduct and implement their functions

  return (
    <div>
      <h1>AdminPanel</h1>
      {/* Render the products with buttons or input fields to add, edit, or delete products */}
    </div>
  );
};

export default AdminPanel;

// import React, { useState, useEffect } from 'react';

// const AdminPanel = () => {
//   const [users, setUsers] = useState([]);
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     // Fetch users and products for admin management
//   }, []);

//   const handleUserActivation = (userId) => {
//     // Activate or deactivate user
//   };

//   const handleProductUpdate = (productId) => {
//     // Update product details
//   };

//   return (
//     <div>
//       <h1>Admin Panel</h1>
//       {/* Display user and product management interfaces */}
//     </div>
//   );
// };

// export default AdminPanel;
