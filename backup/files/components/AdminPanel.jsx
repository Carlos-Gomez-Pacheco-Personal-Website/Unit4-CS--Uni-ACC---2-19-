import PropTypes from "prop-types";
import { useState, useEffect } from "react";

const AdminPanel = ({ currentUser }) => {
  const [users, setUsers] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (currentUser && currentUser.isAdmin) {
      const fetchData = async () => {
        const usersResponse = await fetch("/api/users");
        const usersData = await usersResponse.json();
        setUsers(usersData);

        const productsResponse = await fetch("/api/products");
        const productsData = await productsResponse.json();
        setProducts(productsData);
      };

      fetchData();
    }
  }, [currentUser]);

  const handleUserActivation = async (userId) => {
    const response = await fetch(`/api/users/${userId}/activate`, {
      method: "POST",
    });

    if (response.ok) {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, isActive: !user.isActive } : user
        )
      );
    } else {
      alert("Failed to update user activation status");
    }
  };

  const handleProductUpdate = async (productId, updatedProduct) => {
    const response = await fetch(`/api/products/${productId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedProduct),
    });

    if (response.ok) {
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product.id === productId ? updatedProduct : product
        )
      );
    } else {
      alert("Failed to update product");
    }
  };

  if (!currentUser || !currentUser.isAdmin) {
    return <div>You must be an admin to view this page.</div>;
  }

  return (
    <div>
      <h1>Admin Panel</h1>
      <h2>Users</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Username</th>
            <th>Active</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.id}</td>
              <td>{user.username}</td>
              <td>{user.isActive ? "Yes" : "No"}</td>
              <td>
                <button onClick={() => handleUserActivation(user.id)}>
                  {user.isActive ? "Deactivate" : "Activate"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <h2>Products</h2>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Description</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.description}</td>
              <td>
                <button onClick={() => handleProductUpdate(product.id)}>
                  Update
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

AdminPanel.propTypes = {
  currentUser: PropTypes.shape({
    isAdmin: PropTypes.any,
  }),
};

export default AdminPanel;
