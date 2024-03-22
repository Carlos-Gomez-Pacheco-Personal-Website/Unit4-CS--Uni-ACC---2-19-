import { useState, useEffect } from "react";
import { fetchCart, addToCart, removeFromCart, updateCart } from "./db";

const Cart = ({ currentUser }) => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    if (currentUser) {
      const fetchData = async () => {
        const items = await fetchCart(currentUser.id);
        setCartItems(items);
      };

      fetchData();
    }
  }, [currentUser]);

  const handleAddToCart = async (product) => {
    if (currentUser) {
      await addToCart(currentUser.id, product);
      setCartItems((prevItems) => [...prevItems, product]);
    }
  };

  const handleRemoveFromCart = async (product) => {
    await removeFromCart(currentUser.id, product.id);
    setCartItems((prevItems) =>
      prevItems.filter((item) => item.id !== product.id)
    );
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    await updateCart(currentUser.id, productId, newQuantity);

    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  return (
    <div>
      <h1>Cart</h1>
      {/* Render the cartItems with buttons to add, remove or update */}
    </div>
  );
};

export default Cart;

// import React, { useState, useEffect } from 'react';

// const Cart = () => {
//   const [cartItems, setCartItems] = useState([]);

//   useEffect(() => {
//     // Fetch cart items for the current user
//   }, []);

//   return (
//     <div>
//       {cartItems.map((item) => (
//         <div key={item.id}>
//           <h3>{item.product.name}</h3>
//           {/* Display other cart item details */}
//         </div>
//       ))}
//     </div>
//   );
// };

// export default Cart;
