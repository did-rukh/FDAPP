import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import { Container, Card, Button } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";

function DeliveryOrders() {
  const [orders, setOrders] = useState([]);
  const { token, role } = useContext(AuthContext);

  const fetchOrders = async () => {
    try {
      if (!token || role !== "delivery") return;
      const res = await API.get("/orders/delivery");
      setOrders(res.data);
      console.log("Delivery partner orders:", res.data);
    } catch (error) {
      console.error("Error fetching delivery orders:", error.response || error);
      alert("Failed to fetch delivery orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token, role]);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}/delivery-status`, { status });
      fetchOrders(); // refresh
    } catch (error) {
      alert("Delivery update failed");
    }
  };

  return (
    <Container className="mt-4">
      <h2>Delivery Orders</h2>
      {orders.length === 0 ? (
        <p>No delivery orders assigned yet.</p>
      ) : (
        orders.map((order) => (
          <Card key={order._id} className="mb-3">
            <Card.Body>
              <h5>Order #{order._id.slice(-6)}</h5>
              <p>Status: {order.status}</p>

              {order.items.map((item) => (
                <p key={item.product._id}>
                  {item.product.name} × {item.quantity}
                </p>
              ))}

              {order.status === "ASSIGNED" && (
                <Button onClick={() => updateStatus(order._id, "PICKED_UP")}>
                  Pick Up
                </Button>
              )}

              {order.status === "PICKED_UP" && (
                <Button onClick={() => updateStatus(order._id, "DELIVERED")}>
                  Delivered
                </Button>
              )}
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
}

export default DeliveryOrders;