import { useEffect, useState } from "react";
import { Container, Table, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

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

  return (
    <Container className="mt-4">

      <h3>Restaurants</h3>

      <Table striped bordered hover>

        <thead>
          <tr>
            <th>Name</th>
            <th>City</th>
            <th>Rating</th>
            <th>Menu</th>
            <th>Reviews</th>
          </tr>
        </thead>

        <tbody>
          {restaurants.map((r) => (
            <tr key={r._id}>

              <td>{r.name}</td>
              <td>{r.address?.city}</td>
              <td>{r.averageRating || 0} ⭐</td>

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

            </tr>
          ))}
        </tbody>

      </Table>

    </Container>
  );
}

export default AdminRestaurants;