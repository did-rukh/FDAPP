import { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";

const CartContext = createContext();
export const CartProvider = ({ children }) => {

  const [cartItems, setCartItems] = useState([]);
  const addToCart = (product) => {
    
  // if (!product.available) {
  //   toast.error(`${product.name} is currently unavailable`);
  //   return;
  // }
  
    setCartItems((prevCart) => {

      if (
        prevCart.length > 0 &&
        prevCart[0].restaurant !== product.restaurant
      ) {
        toast.warning("You can order from only one restaurant at a time.");
        return prevCart;
      }

      const exist = prevCart.find((x) => x._id === product._id);

      if (exist) {
        return prevCart.map((x) =>
          x._id === product._id
            ? { ...x, quantity: x.quantity + 1 }
            : x
        );
      }

      return [...prevCart, { ...product, quantity: 1 }];
    });
  };

 const increaseQuantity = (id) => {

  setCartItems((prevCart) => {

    return prevCart.map((item) =>
      item._id === id
        ? { ...item, quantity: item.quantity + 1 }
        : item
    );
  });
};
  const decreaseQuantity = (id) => {

    setCartItems((prevCart) =>
      prevCart
        .map((item) =>
          item._id === id
            ? { ...item, quantity: item.quantity - 1 }
            : item
        )
        .filter((item) => item.quantity > 0)
    );
  };

  const removeFromCart = (id) => {
    setCartItems((prevCart) =>
      prevCart.filter((x) => x._id !== id)
    );
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,addToCart,increaseQuantity,decreaseQuantity, removeFromCart,setCartItems
      }} >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext); 