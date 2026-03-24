import { useEffect, useState } from "react";
import { Container, Table, Button, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";
import { toast } from "react-toastify";


function AdminRestaurants() {

  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRestaurants = async () => {
      const { data } = await API.get("/restaurants");
      setRestaurants(data);
    };

    fetchRestaurants();
  }, []);
    
   const toggleBlock = async (id) => {
  try {
    const res = await API.put(`/admin/toggle-restaurant/${id}`);
    toast.success(res.data.message);

    // update UI instantly
    setRestaurants((prev) =>
      prev.map((r) =>
        r._id === id ? { ...r, isBlocked: res.data.isBlocked } : r
      )
    );
  } catch (err) {
    console.error(err);
    toast.error("Action failed");
  }
};
   

  return (
    <Container className="mt-4">

      <h3>Restaurants</h3>

      <Table striped bordered hover>

        <thead>
          <tr>
            <th>Name</th>
            <th>City</th>
            <th>Rating</th>
            <th>Status</th>
            <th>Menu</th>
            <th>Reviews</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {restaurants.map((r) => (
            <tr key={r._id}>

              <td>{r.name}</td>
              <td>{r.address?.city}</td>
              <td>{r.averageRating || 0} ⭐</td>

                {/* ✅ BLOCK STATUS */}
              <td>
                {r.isBlocked ? (
                  <Badge bg="danger">Blocked</Badge>
                ) : (
                  <Badge bg="success">Active</Badge>
                )}
              </td>

              <td>
                <Button
                  variant="primary"
                  onClick={() => navigate(`/admin/menu/${r._id}`)}
                >
                  Menu
                </Button>
              </td>

              <td>
                <Button
                  variant="secondary"
                  onClick={() => navigate(`/admin/reviews/${r._id}`)}
                >
                  Reviews
                </Button>
              </td>

             {/* 🔴 BLOCK BUTTON */}
              <td>
                <Button
                  variant={r.isBlocked ? "success" : "danger"}
                  onClick={() => toggleBlock(r._id)}
                >
                  {r.isBlocked ? "Unblock" : "Block"}
                </Button>
              </td>

            </tr>
          ))}
        </tbody>

      </Table>

    </Container>
  );
}

export default AdminRestaurants;

