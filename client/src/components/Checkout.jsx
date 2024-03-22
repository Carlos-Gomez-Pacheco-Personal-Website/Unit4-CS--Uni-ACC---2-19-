import PropTypes from "prop-types";
import { useState, useEffect } from "react";

const Checkout = ({ currentUser }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (currentUser) {
      const fetchData = async () => {
        const response = await fetch(`/api/users/${currentUser.id}/cart`);
        const cartData = await response.json();
        setCartItems(cartData);
      };

      fetchData();
    }
  }, [currentUser]);

  const handleUpdateQuantity = async (productId, newQuantity) => {
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
      alert("Failed to update quantity");
    }
  };

  const handleCheckout = async () => {
    try {
      const response = await fetch(`/api/users/${currentUser.id}/checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(cartItems),
      });

      if (response.ok) {
        alert("Checkout successful!");
        setCartItems([]); // Clear the cart after a successful checkout
      } else {
        alert("Checkout failed");
      }
    } catch (error) {
      console.error("Failed to checkout:", error);
    }
  };

  return (
    <div>
      <h1>Checkout</h1>
      {cartItems.length === 0 ? (
        <p>No items in your cart.</p>
      ) : (
        <ul>
          {cartItems.map((item) => (
            <li key={item.id}>
              {item.name}
              <button onClick={() => handleUpdateQuantity(item.id, 0)}>
                Remove
              </button>
              <input
                type="number"
                value={item.quantity}
                onChange={(e) =>
                  handleUpdateQuantity(item.id, parseInt(e.target.value))
                }
              />
            </li>
          ))}
        </ul>
      )}
      <button onClick={handleCheckout}>Checkout</button>
    </div>
  );
};

Checkout.propTypes = {
  currentUser: PropTypes.shape({
    id: PropTypes.any,
  }),
};

export default Checkout;
