import { useEffect, useState } from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { useParams } from "react-router-dom";
import API from "../api/axios";

function AdminRestaurantMenu() {
  const { id } = useParams();
  const [products, setProducts] = useState([]);

  useEffect(() => {

    const fetchMenu = async () => {
      const { data } = await API.get(`/products?restaurantId=${id}`);
      setProducts(data);
    };
    fetchMenu();
  }, [id]);

  return (
    <Container className="mt-4">
      <h3>Restaurant Menu</h3>
      <Row>
        {products.map((p) => (

          <Col md={3} key={p._id} className="mb-3">

            <Card>

              {p.image && (
                <Card.Img
                  variant="top"
                  src={p.image}
                  style={{ height: "180px", objectFit: "cover" }}
                />
              )}

              <Card.Body>
                <Card.Title>{p.name}</Card.Title>
                <Card.Text>₹ {p.price}</Card.Text>
                <Card.Text>
                  {p.available ? "Available" : "Out of Stock"}
                </Card.Text>
              </Card.Body>

            </Card>

          </Col>
        ))}

      </Row>
    </Container>
  );
}

export default AdminRestaurantMenu;