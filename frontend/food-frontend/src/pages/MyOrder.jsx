import { useEffect, useState } from "react";
import { Container, Card, Button } from "react-bootstrap";
import API from "../api/axios";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [reviewStatus, setReviewStatus] = useState({}); 

  const fetchOrders = async () => {
    try {
      const { data } = await API.get("/orders");
      setOrders(data);

      const status = {};

      for (let order of data) {
        if (order.status === "DELIVERED") {
          try {
            const res = await API.get(`/reviews/order/${order._id}`);
            status[order._id] = res.data.alreadyReviewed;
          } catch (err) {
            status[order._id] = false;
          }
        }
      }

      setReviewStatus(status);

    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const cancelOrder = async (orderId) => {
    const confirmCancel = window.confirm(
      "Are you sure you want to cancel this order?"
    );

    if (!confirmCancel) return;

    try {
      await API.put(`/orders/${orderId}/cancel`);
      alert("Order cancelled successfully");

      fetchOrders(); 

    } catch (error) {
      alert(error.response?.data?.message || "Cancel failed");
    }
  };
  const addReviewHandler = async (orderId) => {
  if (reviewStatus[orderId]) {
    alert("You already reviewed this order");
    return;
  }

  const rating = prompt("Enter rating (1-5)");
  const comment = prompt("Enter your comment");

  if (!rating) return;

  try {
    await API.post(`/reviews/${orderId}`, {
      rating: Number(rating),
      comment
    });

    alert("Review added successfully");
    fetchOrders(); 

  } catch (error) {
    alert(error.response?.data?.message || "Review failed");
  }
};


  return (
    <Container className="mt-4">
      <h3 className="mb-4">My Orders</h3>

      {orders.length === 0 && <p>No orders found</p>}

      {orders.map((order) => (
        <Card key={order._id} className="mb-3">
          <Card.Body>

            <Card.Title>
              Order #{order._id.slice(-6)}
            </Card.Title>

            <p>
              <strong>Status:</strong> {order.status}
            </p>

            <hr />
            {order.items.map((item) => (
           <li key={item._id}>
           {item.product?.name || "Product removed"} x {item.quantity}
         </li>
        ))}

            <hr />
            {["PLACED", "CONFIRMED"].includes(order.status) && (
              <Button
                variant="danger"
                className="me-2"
                onClick={() => cancelOrder(order._id)}
              >
                Cancel Order
              </Button>
            )}

            {order.status === "DELIVERED" && !reviewStatus[order._id] && (
              <Button
                onClick={() => addReviewHandler(order._id)}
                variant="primary"
              >
                Add Review
              </Button>
            )}

            {/* Already Reviewed */}
            {order.status === "DELIVERED" && reviewStatus[order._id] && (
              <Button variant="secondary" disabled>
                Reviewed
              </Button>
            )}

          </Card.Body>
        </Card>
      ))}
    </Container>
  );
}

export default MyOrders;