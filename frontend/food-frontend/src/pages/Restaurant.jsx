                   
import { useEffect, useState, useContext } from "react";
import { Container, Button, Card, Row, Col } from "react-bootstrap";
import { useParams, Navigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import RestaurantReviews from "./RestaurantReview";

function Restaurant() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { role, token } = useContext(AuthContext);

  const [restaurant, setRestaurant] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await API.get(`/restaurants/${id}`);
        setRestaurant(data);

        const productRes = await API.get(`/products?restaurantId=${id}`);

        setProducts(productRes.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (role === "restaurant" || role === "delivery") {
    return <Navigate to="/" />;
  }

  if (loading) return <Container className="mt-4">Loading...</Container>;

  return (
    <Container className="mt-3">
      <h3>{restaurant?.name}</h3>
      <p>{restaurant?.address?.city}</p>
      <h4 className="mt-3">Menu</h4>

      {products.length === 0 && <p>No menu items found</p>}

      <Row className="g-3">
        {products.map((product) => (
          <Col key={product._id} xs={12} sm={6} md={4} lg={3}>
            <Card className="h-100 shadow-sm">
              {product.image && (
                <Card.Img
                  variant="top"
                  src={product.image}
                  style={{
                    height: "200px",
                    objectFit: "cover",
                  }}
                />
              )}
              <Card.Body className="d-flex flex-column">
                <Card.Title className="mb-1">{product.name}</Card.Title>
                <Card.Text className="mb-1">₹ {product.price}</Card.Text>
                {product.description && (
                  <Card.Text className="text-truncate">
                    {product.description}
                  </Card.Text>
                )}

                {product.available ? (
                  token && role === "user" ? (
                    <Button
                      onClick={() => addToCart({ ...product, restaurant: id })}
                      className="mt-auto"
                    >
                      Add to Cart
                    </Button>
                  ) : (
                    <Button disabled title="Login as user to add to cart" className="mt-auto">
                      Add to Cart
                    </Button>
                  )
                ) : (
                  <Button disabled className="btn-secondary mt-auto">
                    Out of Stock
                  </Button>
                )}
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <div className="mt-4">
        <RestaurantReviews restaurantId={id} />
      </div>
    </Container>
  );
}

export default Restaurant;


