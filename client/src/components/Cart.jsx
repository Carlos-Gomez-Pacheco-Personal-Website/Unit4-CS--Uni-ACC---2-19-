import { useState, useEffect } from "react";

const Cart = ({ currentUser }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (currentUser) {
      const fetchData = async () => {
        const response = await fetch(`/api/users/${currentUser.id}/cart`);
        const items = await response.json();
        setCartItems(items);
      };

      fetchData();
    }
  }, [currentUser]);

  const handleAddToCart = async (product) => {
    if (currentUser) {
      const response = await fetch(`/api/users/${currentUser.id}/cart`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(product),
      });

      if (response.ok) {
        setCartItems((prevItems) => [...prevItems, product]);
      } else {
        alert("Failed to add to cart");
      }
    }
  };

  const handleRemoveFromCart = async (product) => {
    if (currentUser) {
      const response = await fetch(
        `/api/users/${currentUser.id}/cart/${product.id}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.id !== product.id)
        );
      } else {
        alert("Failed to remove from cart");
      }
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (currentUser) {
      const response = await fetch(
        `/api/users/${currentUser.id}/cart/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ quantity: newQuantity }),
        }
      );

      if (response.ok) {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.id === productId ? { ...item, quantity: newQuantity } : item
          )
        );
      } else {
        alert("Failed to update cart");
      }
    }
  };

  return (
    <div>
      <h1>Cart</h1>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <ul>
          {cartItems.map((item) => (
            <li key={item.product.id}>
              {item.product.name}
              <button onClick={() => handleRemoveFromCart(item.product)}>
                Remove from Cart
              </button>
              <button
                onClick={() =>
                  handleUpdateQuantity(item.product.id, item.quantity + 1)
                }
              >
                Increase Quantity
              </button>
              <button
                onClick={() =>
                  handleUpdateQuantity(item.product.id, item.quantity - 1)
                }
              >
                Decrease Quantity
              </button>
            </li>
          ))}
        </ul>
      )}
      <h2>Add a product to your cart:</h2>
      {/* Add a form or input fields to add products to cart */}
    </div>
  );
};

export default Cart;
