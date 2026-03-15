
import { Container, Button } from "react-bootstrap";
import { useCart } from "../context/CartContext";
import API from "../api/axios";

function Cart() {
  const { cartItems, removeFromCart, setCartItems, increaseQuantity, decreaseQuantity } = useCart();

  const totalPrice = cartItems.reduce(
    (total, item) =>total + item.price * item.quantity,0
    
  );
  const placeOrder = async () => {
    try {
      if (cartItems.length === 0) {
        alert("Cart is empty");
        return;
      }

      await API.post("/orders", {
        items: cartItems.map((item) => ({
          product: item._id,
          quantity: item.quantity,
        })),
      });

      alert("Order placed successfully!");

      setCartItems([]);

    } catch (error) {
      alert(error.response?.data?.message || "Order failed");
    }
  };

  return (

    <Container className="mt-4">

      {cartItems.length === 0 && <h4>Your cart is empty</h4>}

      {cartItems.map((item) => (
        <div
          key={item._id}
          style={{
            border: "1px solid #ddd",
            padding: "10px",
            marginBottom: "10px"
          }}>
          <h5>{item.name}</h5>
          <p>Price: ₹{item.price}</p>
          <div>
            <Button
              variant="secondary"
              onClick={() => decreaseQuantity(item._id)}>
              -
            </Button>
            <span style={{ margin: "0 10px" }}>
              {item.quantity}
            </span>
            <Button
              variant="secondary"
              onClick={() => increaseQuantity(item._id)} > + </Button>
          </div>
          <p className="mt-2">
            Item Total: ₹{item.price * item.quantity}
          </p>
          <Button
            variant="danger"
            onClick={() => removeFromCart(item._id)} >Remove
          </Button>
        </div>
      ))}
      {cartItems.length > 0 && (
        <>
          <h4>Total Price: ₹{totalPrice}</h4>

          <Button className="mt-3" onClick={placeOrder}>
            Place Order</Button>
        </>
      )}

    </Container>
  );
}

export default Cart;