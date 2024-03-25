import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const Cart = ({ addToCart, auth }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (auth.id) {
      const fetchData = async () => {
        const response = await fetch(`/api/users/${auth.id}/cart`);
        const items = await response.json();
        setCartItems(items);
      };

      fetchData();
    }
  }, [auth]); // Use auth instead of currentUser

  const handleAddToCart = async (product) => {
    try {
      await addToCart(product.id); // Use addToCart function passed from App.jsx
      alert("Product added to cart successfully!");
    } catch (error) {
      console.error("Failed to add product to cart:", error);
    }
  };

  const handleRemoveFromCart = async (product) => {
    if (auth.id) {
      const response = await fetch(`/api/users/${auth.id}/cart/${product.id}`, {
        method: "DELETE",
      });

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
    if (auth.id) {
      const response = await fetch(`/api/users/${auth.id}/cart/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

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
      <Link to="/checkout">Proceed to Checkout</Link>
    </div>
  );
};

Cart.propTypes = {
  addToCart: PropTypes.func.isRequired, // addToCart is required
  auth: PropTypes.object.isRequired, // auth is required
};

export default Cart;
