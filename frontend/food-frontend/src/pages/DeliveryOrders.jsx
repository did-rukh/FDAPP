// import { useEffect, useState, useContext } from "react";
// import API from "../api/axios";
// import { Container, Card, Button } from "react-bootstrap";
// import { AuthContext } from "../context/AuthContext";
// import { toast } from "react-toastify";

// function DeliveryOrders() {
//   const [orders, setOrders] = useState([]);
//   const { token, role } = useContext(AuthContext);

//   const fetchOrders = async () => {
//     try {
//       if (!token || role !== "delivery") return;
//       const res = await API.get("/orders/delivery");
//       setOrders(res.data);
//       console.log("Delivery partner orders:", res.data);
//     } catch (error) {
//       console.error("Error fetching delivery orders:", error.response || error);
//       toast.error("Failed to fetch delivery orders");
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, [token, role]);

//   const updateStatus = async (id, status) => {
//     try {
//       await API.put(`/orders/${id}/delivery-status`, { status });
//       fetchOrders(); // refresh
//     } catch (error) {
//       toast.error("Delivery update failed");
//     }
//   };

//   return (
//     <Container className="mt-4">
//       <h2>Delivery Orders</h2>
//       {orders.length === 0 ? (
//         <p>No delivery orders assigned yet.</p>
//       ) : (
//         orders.map((order) => (
//           <Card key={order._id} className="mb-3">
//             <Card.Body>
//               <h5>Order #{order._id.slice(-6)}</h5>
//               <p>Status: {order.status}</p>

//               {order.items.map((item) => (
//                 <p key={item.product._id}>
//                   {item.product.name} × {item.quantity}
//                 </p>
//               ))}

//               {order.status === "ASSIGNED" && (
//                 <Button onClick={() => updateStatus(order._id, "PICKED_UP")}>
//                   Pick Up
//                 </Button>
//               )}

//               {order.status === "PICKED_UP" && (
//                 <Button onClick={() => updateStatus(order._id, "DELIVERED")}>
//                   Delivered
//                 </Button>
//               )}
//             </Card.Body>
//           </Card>
//         ))
//       )}
//     </Container>
//   );
// }

// export default DeliveryOrders;   // old code   







// import { useEffect, useState, useContext } from "react";
// import API from "../api/axios";
// import { Container, Card, Button } from "react-bootstrap";
// import { AuthContext } from "../context/AuthContext";
// import { toast } from "react-toastify";

// function DeliveryOrders() {
//   const [orders, setOrders] = useState([]);
//   const { token, role } = useContext(AuthContext);

//   const fetchOrders = async () => {
//     try {
//       if (!token || role !== "delivery") return;
//       const res = await API.get("/orders/delivery");
//       setOrders(res.data);
//       console.log("Delivery partner orders:", res.data);
//     } catch (error) {
//       console.error("Error fetching delivery orders:", error.response || error);
//       toast.error("Failed to fetch delivery orders");
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, [token, role]);

//   const updateStatus = async (id, status) => {
//     try {
//       await API.put(`/orders/${id}/delivery-status`, { status });
//       toast.success("Status updated");
//       fetchOrders(); // refresh
//     } catch (error) {
//       toast.error("Delivery update failed");
//     }
//   };

//   // ✅✅✅ CHANGE 1: Added filtering logic
//   const activeOrders = orders.filter(
//     (order) => order.status !== "DELIVERED"
//   );

//   const completedOrders = orders.filter(
//     (order) => order.status === "DELIVERED"
//   );

//   return (
//     <Container className="mt-4">
//       <h2>Delivery Orders</h2>

//       {orders.length === 0 ? (
//         <p>No delivery orders assigned yet.</p>
//       ) : (
//         <>
//           {/* ✅✅✅ CHANGE 2: ACTIVE ORDERS SECTION */}
//           <h4 className="mt-3">Active Orders</h4>

//           {activeOrders.length === 0 ? (
//             <p>No active orders</p>
//           ) : (
//             activeOrders.map((order) => (
//               <Card key={order._id} className="mb-3">
//                 <Card.Body>
//                   <h5>Order #{order._id.slice(-6)}</h5>
//                   <p>Status: {order.status}</p>

//                   {order.items.map((item) => (
//                     <p key={item.product._id}>
//                       {item.product.name} × {item.quantity}
//                     </p>
//                   ))}

//                   {order.status === "ASSIGNED" && (
//                     <Button
//                       onClick={() =>
//                         updateStatus(order._id, "PICKED_UP")
//                       }
//                     >
//                       Pick Up
//                     </Button>
//                   )}

//                   {order.status === "PICKED_UP" && (
//                     <Button
//                       onClick={() =>
//                         updateStatus(order._id, "DELIVERED")
//                       }
//                     >
//                       Delivered
//                     </Button>
//                   )}
//                 </Card.Body>
//               </Card>
//             ))
//           )}

//           {/* ✅✅✅ CHANGE 3: COMPLETED ORDERS SECTION */}
//           <h4 className="mt-4">Completed Orders</h4>

//           {completedOrders.length === 0 ? (
//             <p>No completed orders</p>
//           ) : (
//             completedOrders.map((order) => (
//               <Card key={order._id} className="mb-3">
//                 <Card.Body>
//                   <h5>Order #{order._id.slice(-6)}</h5>
//                   <p>Status: {order.status}</p>

//                   {order.items.map((item) => (
//                     <p key={item.product._id}>
//                       {item.product.name} × {item.quantity}
//                     </p>
//                   ))}

//                   {/* ✅ NEW UI */}
//                   <p style={{ color: "green", fontWeight: "bold" }}>
//                     ✅ Delivered Successfully
//                   </p>
//                 </Card.Body>
//               </Card>
//             ))
//           )}
//         </>
//       )}
//     </Container>
//   );                                                                              // old code    working
// }

// export default DeliveryOrders;




import { useEffect, useState, useContext } from "react";
import API from "../api/axios";
import { Container, Card, Button } from "react-bootstrap";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

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
      toast.error("Failed to fetch delivery orders");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [token, role]);

  const updateStatus = async (id, status) => {
    try {
      await API.put(`/orders/${id}/delivery-status`, { status });
      toast.success("Status updated");
      fetchOrders(); // refresh
    } catch (error) {
      toast.error("Delivery update failed");
    }
  };

  // ✅ FILTER ORDERS
  const activeOrders = orders.filter((order) => order.status !== "DELIVERED");
  const completedOrders = orders.filter((order) => order.status === "DELIVERED");

  return (
    <Container className="mt-4">
      <h2>Delivery Orders</h2>

      {orders.length === 0 ? (
        <p>No delivery orders assigned yet.</p>
      ) : (
        <>
          {/* ✅ ACTIVE ORDERS */}
          <h4 className="mt-3">Active Orders</h4>

          {activeOrders.length === 0 ? (
            <p>No active orders</p>
          ) : (
            activeOrders.map((order) => (
              <Card key={order._id} className="mb-3">
                <Card.Body>
                  <h5>Order #{order._id.slice(-6)}</h5>
                  <p>Status: {order.status}</p>

                  {/* ✅ FIXED: Check if product exists before rendering */}
                  {order.items.map((item) => (
                    <p key={item.product?._id || item._id}>
                      {item.product
                        ? `${item.product.name} × ${item.quantity}`
                        : `Product removed × ${item.quantity}`} {/* ✅ FIXED */}
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

          {/* ✅ COMPLETED ORDERS */}
          <h4 className="mt-4">Completed Orders</h4>

          {completedOrders.length === 0 ? (
            <p>No completed orders</p>
          ) : (
            completedOrders.map((order) => (
              <Card key={order._id} className="mb-3">
                <Card.Body>
                  <h5>Order #{order._id.slice(-6)}</h5>
                  <p>Status: {order.status}</p>

                  {/* ✅ FIXED: Check if product exists before rendering */}
                  {order.items.map((item) => (
                    <p key={item.product?._id || item._id}>
                      {item.product
                        ? `${item.product.name} × ${item.quantity}`
                        : `Product removed × ${item.quantity}`} {/* ✅ FIXED */}
                    </p>
                  ))}

                  <p style={{ color: "green", fontWeight: "bold" }}>
                    ✅ Delivered Successfully 
                  </p>
                </Card.Body>
              </Card>
            ))
          )}
        </>
      )}
    </Container>
  );
}

export default DeliveryOrders;