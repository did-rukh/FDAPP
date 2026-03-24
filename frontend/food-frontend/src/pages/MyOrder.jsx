// import { useEffect, useState } from "react";
// import { Container, Card, Button, } from "react-bootstrap";
// import API from "../api/axios";
// import { toast } from "react-toastify";

// function MyOrders() {
//   const [orders, setOrders] = useState([]);
//   const [reviewStatus, setReviewStatus] = useState({}); 
//   const [loadingId, setLoadingId] = useState(null);

//   const fetchOrders = async () => {
//     try {
//       const { data } = await API.get("/orders");
//       setOrders(data);

//       const status = {};

//       for (let order of data) {
//         if (order.status === "DELIVERED") {
//           try {
//             const res = await API.get(`/reviews/order/${order._id}`);
//             status[order._id] = res.data.alreadyReviewed;
//           } catch (err) {
//             status[order._id] = false;
//           }
//         }
//       }

//       setReviewStatus(status);

//     } catch (error) {
//       console.error(error);
//     }
//   };

//   useEffect(() => {
//     fetchOrders();
//   }, []);

//   // const cancelOrder = async (orderId) => {
//   //   const confirmCancel = window.confirm(
//   //     "Are you sure you want to cancel this order?"
//   //   );

//   //   if (!confirmCancel) return;




// // const cancelOrder = async (orderId) => {     Old alert-based confirmation
// //   try {
// //     toast.info("Cancelling order...");

// //     await API.put(`/orders/${orderId}/cancel`);

// //     toast.success("Order cancelled successfully ❌");

// //     fetchOrders(); 

// //   } catch (error) {
// //     toast.error(error.response?.data?.message || "Cancel failed");
// //   }
// // };


// const cancelOrder = async (orderId) => {
//   try {
//     setLoadingId(orderId); // 🔥 disable button

//     toast.info("Cancelling order...");

//     await API.put(`/orders/${orderId}/cancel`);

//     toast.success("Order cancelled successfully ❌");

//     fetchOrders(); 

//   } catch (error) {
//     toast.error(error.response?.data?.message || "Cancel failed");
//   } finally {
//     setLoadingId(null); // 🔥 enable again
//   }
// };



// //   const addReviewHandler = async (orderId) => {
// //   if (reviewStatus[orderId]) {
// //     toast.error("You already reviewed this order");
// //     return;
// //   }

// //   const rating = prompt("Enter rating (1-5)");
// //   const comment = prompt("Enter your comment");

// //   if (!rating) return;

// //   try {
// //     await API.post(`/reviews/${orderId}`, {
// //       rating: Number(rating),
// //       comment
// //     });

// //     toast.success("Review added successfully");
// //     fetchOrders(); 

// //   } catch (error) {
// //     toast.error(error.response?.data?.message || "Review failed");
// //   }
// // };

//   const addReviewHandler = async (orderId) => {
//   if (reviewStatus[orderId]) {
//     toast.error("You already reviewed this order");
//     return;
//   }

//   const ratingInput = prompt("Enter rating (1-5)");
//   const rating = Number(ratingInput);

//   // ✅ FRONTEND VALIDATION (FIX)
//   if (!ratingInput || isNaN(rating) || rating < 1 || rating > 5) {
//     toast.error("Rating must be between 1 and 5");
//     return;
//   }

//   const comment = prompt("Enter your comment");

//   try {
//     await API.post(`/reviews/${orderId}`, {
//       rating,
//       comment
//     });

//     toast.success("Review added successfully");
//     fetchOrders();

//   } catch (error) {
//     toast.error(error.response?.data?.message || "Review failed");
//   }
// };





// //    const editReviewHandler = async (orderId) => {
// //   try {
// //     const res = await API.get(`/reviews/order/${orderId}`);

// //     const review = res.data.review;

// //     if (!review) {
// //       toast.error("Review not found");
// //       return;
// //     }

// //     const newRating = prompt("Enter new rating (1-5)", review.rating);
// //     const newComment = prompt("Enter new comment", review.comment);

// //     if (!newRating) return;

// //     await API.put(`/reviews/${review._id}`, {
// //       rating: Number(newRating),
// //       comment: newComment
// //     });

// //     toast.success("Review updated successfully");
// //     fetchOrders();

// //   } catch (error) {
// //     toast.error(error.response?.data?.message || "Update failed");
// //   }
// // };
   
//    const editReviewHandler = async (orderId) => {
//   try {
//     const res = await API.get(`/reviews/order/${orderId}`);
//     const review = res.data.review;

//     if (!review) {
//       toast.error("Review not found");
//       return;
//     }

//     const ratingInput = prompt("Enter new rating (1-5)", review.rating);
//     const newRating = Number(ratingInput);

//     // ✅ VALIDATION FIX
//     if (!ratingInput || isNaN(newRating) || newRating < 1 || newRating > 5) {
//       toast.error("Rating must be between 1 and 5");
//       return;
//     }

//     const newComment = prompt("Enter new comment", review.comment);

//     await API.put(`/reviews/${review._id}`, {
//       rating: newRating,
//       comment: newComment
//     });

//     toast.success("Review updated successfully");
//     fetchOrders();

//   } catch (error) {
//     toast.error(error.response?.data?.message || "Update failed");
//   }
// };

//   return (
//     <Container className="mt-4">
//       <h3 className="mb-4">My Orders</h3>

//       {orders.length === 0 && <p>No orders found</p>}

//       {orders.map((order) => (
//         <Card key={order._id} className="mb-3">
//           <Card.Body>

//             <Card.Title>
//               Order #{order._id.slice(-6)}
//             </Card.Title>

//             <p>
//               <strong>Status:</strong> {order.status}
//             </p>

//             <hr />
//             {order.items.map((item) => (
//            <li key={item._id}>
//            {item.product?.name || "Product removed"} x {item.quantity}
//          </li>
//         ))}

//             <hr />
//             {["PLACED", "CONFIRMED"].includes(order.status) && (
//               // <Button
//               //   variant="danger"
//               //   className="me-2"
//               //   onClick={() => cancelOrder(order._id)}
//               // >
//               //   Cancel Order
//               // </Button>    // Old alert-based button
//               <Button
//           variant="danger"
//          className="me-2"
//         disabled={loadingId === order._id}
//          onClick={() => cancelOrder(order._id)}>
//       {loadingId === order._id ? "Cancelling..." : "Cancel Order"}
//            </Button>
//             )}

//             {order.status === "DELIVERED" && !reviewStatus[order._id] && (
//               <Button
//                 onClick={() => addReviewHandler(order._id)}
//                 variant="primary"
//               >
//                 Add Review
//               </Button>
//             )}

//             {order.status === "DELIVERED" && reviewStatus[order._id] && (
//               <Button variant="warning" onClick={() => editReviewHandler(order._id)}>
//                 Edit Review
//               </Button>
//             )}

//           </Card.Body>
//         </Card>
//       ))}
//     </Container>
//   );
// }

// export default MyOrders;       //  old code   







import { useEffect, useState } from "react";
import { Container, Card, Button, Modal, Form } from "react-bootstrap";
import API from "../api/axios";
import { toast } from "react-toastify";

function MyOrders() {
  const [orders, setOrders] = useState([]);
  const [reviewStatus, setReviewStatus] = useState({});
  const [loadingId, setLoadingId] = useState(null);

  // 🔥 NEW STATES (MODAL)
  const [showModal, setShowModal] = useState(false);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [rating, setRating] = useState("");
  const [comment, setComment] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const [editingReviewId, setEditingReviewId] = useState(null);

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
          } catch {
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

  // 🔥 CANCEL ORDER
  const cancelOrder = async (orderId) => {
    try {
      setLoadingId(orderId);
      toast.info("Cancelling order...");

      await API.put(`/orders/${orderId}/cancel`);

      toast.success("Order cancelled successfully ❌");
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Cancel failed");
    } finally {
      setLoadingId(null);
    }
  };

  // 🔥 OPEN ADD MODAL
  const addReviewHandler = (orderId) => {
    if (reviewStatus[orderId]) {
      toast.error("You already reviewed this order");
      return;
    }

    setSelectedOrderId(orderId);
    setRating("");
    setComment("");
    setIsEdit(false);
    setShowModal(true);
  };

  // 🔥 OPEN EDIT MODAL
  const editReviewHandler = async (orderId) => {
    try {
      const res = await API.get(`/reviews/order/${orderId}`);
      const review = res.data.review;

      if (!review) {
        toast.error("Review not found");
        return;
      }

      setSelectedOrderId(orderId);
      setRating(review.rating);
      setComment(review.comment);
      setEditingReviewId(review._id);
      setIsEdit(true);
      setShowModal(true);
    } catch {
      toast.error("Failed to load review");
    }
  };

  // 🔥 SUBMIT REVIEW
  const handleSubmitReview = async () => {
    const numRating = Number(rating);

    if (!numRating || numRating < 1 || numRating > 5) {
      toast.error("Rating must be between 1 and 5");
      return;
    }

    try {
      if (isEdit) {
        await API.put(`/reviews/${editingReviewId}`, {
          rating: numRating,
          comment,
        });
        toast.success("Review updated successfully");
      } else {
        await API.post(`/reviews/${selectedOrderId}`, {
          rating: numRating,
          comment,
        });
        toast.success("Review added successfully");
      }

      setShowModal(false);
      fetchOrders();
    } catch (error) {
      toast.error(error.response?.data?.message || "Action failed");
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
                disabled={loadingId === order._id}
                onClick={() => cancelOrder(order._id)}
              >
                {loadingId === order._id ? "Cancelling..." : "Cancel Order"}
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

            {order.status === "DELIVERED" && reviewStatus[order._id] && (
              <Button
                variant="warning"
                onClick={() => editReviewHandler(order._id)}
              >
                Edit Review
              </Button>
            )}

          </Card.Body>
        </Card>
      ))}

      {/* 🔥 MODAL */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            {isEdit ? "Edit Review" : "Add Review"}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Rating</Form.Label>
              <Form.Select
                value={rating}
                onChange={(e) => setRating(e.target.value)}
              >
                <option value="">Select rating</option>
                <option value="1">1 - Poor</option>
                <option value="2">2</option>
                <option value="3">3 - Average</option>
                <option value="4">4</option>
                <option value="5">5 - Excellent</option>
              </Form.Select>
            </Form.Group>

            <Form.Group>
              <Form.Label>Comment</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Write your review..."
              />
            </Form.Group>
          </Form>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>

          <Button variant="primary" onClick={handleSubmitReview}>
            {isEdit ? "Update" : "Submit"}
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
}

export default MyOrders;