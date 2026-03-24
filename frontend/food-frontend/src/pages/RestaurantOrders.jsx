
import { useEffect, useState } from "react";
import API from "../api/axios";
import { Container, Card, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";

function RestaurantOrders() {
  const [orders, setOrders] = useState([]);
  const [deliveryPartners, setDeliveryPartners] = useState({}); 
  const [allDeliveryPartners, setAllDeliveryPartners] = useState([]); 

  const fetchOrders = async () => {
    try {
      const res = await API.get("/orders/restaurant");
      setOrders(res.data);
      console.log("Restaurant orders:", res.data);
    } catch (error) {
      console.error("Error fetching restaurant orders:", error);
    }
  };

  const fetchDeliveryPartners = async () => {
    try {
      const res = await API.get("/orders/delivery-partners");
      setAllDeliveryPartners(res.data);
      console.log("Delivery partners:", res.data);
    } catch (error) {
      console.error("Error fetching delivery partners:", error.response || error);
      setAllDeliveryPartners([]);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchDeliveryPartners();
  }, []);

  const updateStatus = async (orderId, status) => {
    try {
      await API.put(`/orders/${orderId}/status`, { status });
      fetchOrders();
    } catch (error) {
      toast.error("Status update failed");
    }
  };

  const assignPartner = async (orderId) => {
    const partnerId = deliveryPartners[orderId];
    if (!partnerId) {
      toast.error("Select a delivery partner first");
      return;
    }

    try {
      await API.put(`/orders/${orderId}/assign`, { deliveryPartnerId: partnerId });
      toast.success("Delivery partner assigned!");
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Assignment failed");
    }
  };

  return (
    <Container className="mt-4">
      <h2>Restaurant Orders</h2>

      {orders.length === 0 && <p>No orders yet</p>}

      {orders.map((order) => (
        <Card key={order._id} className="mb-3">
          <Card.Body>
            <h5>Order #{order._id.slice(-6)}</h5>
            <p>Status: {order.status}</p>

            {order.items.map((item) => (
              <p key={item._id}>
                {item.product.name} × {item.quantity}
              </p>
            ))}

            {/* Status buttons */}
            {order.status === "PLACED" && (
              <Button onClick={() => updateStatus(order._id, "CONFIRMED")} className="me-2">
                Confirm
              </Button>
            )}
            {order.status === "CONFIRMED" && (
              <Button onClick={() => updateStatus(order._id, "PREPARING")} className="me-2">
                Start Preparing
              </Button>
            )}

            {order.status === "PREPARING" && allDeliveryPartners.length > 0 && (
              <>
                <Form.Select
                  className="my-2"
                  value={deliveryPartners[order._id] || ""}
                  onChange={(e) =>
                    setDeliveryPartners({
                      ...deliveryPartners,
                      [order._id]: e.target.value,
                    })
                  }
                >
                  <option value="">Select Delivery Partner</option>
                  {allDeliveryPartners.map((partner) => (
                    <option key={partner._id} value={partner._id}>
                      {partner.name} ({partner.email})
                    </option>
                  ))}
                </Form.Select>

                <Button onClick={() => assignPartner(order._id)}>
                  Assign Delivery Partner
                </Button>
              </>
            )}
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
}

export default RestaurantOrders;