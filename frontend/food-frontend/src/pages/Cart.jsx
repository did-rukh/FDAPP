// import { Container, Button } from "react-bootstrap";
// import { useCart } from "../context/CartContext";
// import API from "../api/axios";

// function Cart() {
//   const { cartItems, removeFromCart, setCartItems, increaseQuantity, decreaseQuantity } = useCart();

//   const totalPrice = cartItems.reduce(
//     (total, item) =>total + item.price * item.quantity,0
    
//   );

//   const placeOrder = async () => {
//     try {
//       if (cartItems.length === 0) {
//         alert("Cart is empty");
//         return;
//       }


//      // ✅ CHECK UNAVAILABLE ITEMS BEFORE ORDER
//     const unavailableItems = cartItems.filter(item => !item.available);

//     if (unavailableItems.length > 0) {
//       alert(
//         `${unavailableItems.map(i => i.name).join(", ")} is unavailable`
//       );
//       return;
//     }

    
//       await API.post("/orders", {
//         items: cartItems.map((item) => ({
//           product: item._id,
//           quantity: item.quantity,
//         })),
//       });

//       alert("Order placed successfully!");

//       setCartItems([]);

//     } catch (error) {
//       alert(error.response?.data?.message || "Order failed");
//     }
//   };


//   return (

//     <Container className="mt-4">

//       {cartItems.length === 0 && <h4>Your cart is empty</h4>}

//       {cartItems.map((item) => (
//         <div
//           key={item._id}
//           style={{
//             border: "1px solid #ddd",
//             padding: "10px",
//             marginBottom: "10px"
//           }}>
//           <h5>{item.name}</h5>
//           <p>Price: ₹{item.price}</p>
//           <div>
//             <Button
//               variant="secondary"
//               onClick={() => decreaseQuantity(item._id)}>
//               -
//             </Button>
//             <span style={{ margin: "0 10px" }}>
//               {item.quantity}
//             </span>
//             <Button
//               variant="secondary"
//               onClick={() => increaseQuantity(item._id)} > + </Button>
//           </div>
//           <p className="mt-2">
//             Item Total: ₹{item.price * item.quantity}
//           </p>
//           <Button
//             variant="danger"
//             onClick={() => removeFromCart(item._id)} >Remove
//           </Button>
//         </div>
//       ))}
//       {cartItems.length > 0 && (
//         <>
//           <h4>Total Price: ₹{totalPrice}</h4>

//           {/* <Button className="mt-3" onClick={placeOrder}>
//             Place Order</Button> */}

//           <Button
//           className="mt-3"
//             onClick={placeOrder}
//           disabled={cartItems.some(item => !item.available)}>Place Order</Button>
//         </>
//       )}

//     </Container>
//   );
// }

// export default Cart;    // old code





import { Container, Button } from "react-bootstrap";
import { useCart } from "../context/CartContext";
import API from "../api/axios";
import { useState } from "react"; 
import { toast } from "react-toastify";

function Cart() {
  const {
    cartItems,
    removeFromCart,
    setCartItems,
    increaseQuantity,
    decreaseQuantity,
  } = useCart();

  const [loading, setLoading] = useState(false); 

  const totalPrice = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  const placeOrder = async () => {
    try {
      if (cartItems.length === 0) {
        // alert("Cart is empty");
        toast.warning("Cart is empty");
        return;
      }

      const unavailableItems = cartItems.filter((item) => !item.available);

      if (unavailableItems.length > 0) {
        alert(
          `${unavailableItems.map((i) => i.name).join(", ")} is unavailable`
        );
        return;
      }

      setLoading(true); 

      await API.post("/orders", {
        items: cartItems.map((item) => ({
          product: item._id,
          quantity: item.quantity,
        })),
      });

      // alert("Order placed successfully!");
      toast.success("Order placed successfully 🎉");
      setCartItems([]);

    } catch (error) {
      // alert(error.response?.data?.message || "Order failed");
      toast.error(error.response?.data?.message || "Order failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="mt-4">

      {cartItems.length === 0 && (
        <h4 style={{ textAlign: "center", marginTop: "50px" }}>
          🛒 Your cart is empty
        </h4>
      )}

      {cartItems.map((item) => (
        <div
          key={item._id}
          style={{
            border: "1px solid #ddd",
            padding: "15px",
            marginBottom: "15px",
            borderRadius: "10px",
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
          }}
        >
          <h5>{item.name}</h5>
          <p>Price: ₹{item.price}</p>

          <div>
            <Button
              variant="secondary"
              onClick={() => decreaseQuantity(item._id)}
            >
              -
            </Button>

            <span style={{ margin: "0 10px" }}>
              {item.quantity}
            </span>

            <Button
              variant="secondary"
              onClick={() => increaseQuantity(item._id)}
            >
              +
            </Button>
          </div>

          <p className="mt-2">
            Item Total: ₹{item.price * item.quantity}
          </p>

          {!item.available && (
            <p style={{ color: "red", fontWeight: "bold" }}>
              Currently Unavailable
            </p>
          )}

          <Button
            variant="danger"
            onClick={() => removeFromCart(item._id)}
          >
            Remove
          </Button>
        </div>
      ))}

      
      {cartItems.length > 0 && (
        <>
          <h4>Total Price: ₹{totalPrice}</h4>

          <Button
            className="mt-3"
            onClick={placeOrder}
            disabled={
              loading || cartItems.some((item) => !item.available)
            }
          >
            {loading ? "Placing Order..." : "Place Order"}
          </Button>
        </>
      )}

    </Container>
  );
}

export default Cart;