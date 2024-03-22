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
