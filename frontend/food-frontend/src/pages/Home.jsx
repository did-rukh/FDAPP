import { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Home() {

  const [restaurants, setRestaurants] = useState([]);
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  const hideRestaurants = ["restaurant", "delivery", "admin"].includes(role);

  useEffect(() => {

    const fetchRestaurants = async () => {
      const { data } = await API.get("/restaurants");
      setRestaurants(data);
    };

    fetchRestaurants();

  }, []);

  return (
    <Container className="mt-4">
      {!hideRestaurants && (
        <Row>

          {restaurants.map((r) => (

            <Col md={4} key={r._id} className="mb-4">

              <h5>{r.name}</h5>

              <p>{r.address?.city}</p>

              <Button onClick={() => navigate(`/restaurant/${r._id}`)}>
                View Menu
              </Button>

            </Col>

          ))}

        </Row>

      )}

    </Container>
  );
}

export default Home;