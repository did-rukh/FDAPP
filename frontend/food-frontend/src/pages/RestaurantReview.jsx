import { useEffect, useState } from "react";
import { Container, Card } from "react-bootstrap";
import API from "../api/axios";

function RestaurantReviews({ restaurantId }) {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

      if (!restaurantId) return; 

    const fetchReviews = async () => {
      try {
        const { data } = await API.get(`/reviews/restaurant/${restaurantId}`);
        setReviews(data);
      } catch (error) {
        console.error("Error fetching reviews:", error.response?.data || error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [restaurantId]);

  if (loading) return <p>Loading reviews...</p>;
  if (reviews.length === 0) return <p>No reviews yet</p>;

  return (
    <Container className="mt-4">
      <h4>Reviews</h4>

      {reviews.map((review) => (
        <Card key={review._id} className="mb-3">
          <Card.Body>
            <Card.Title>
              {review.user?.name || "Anonymous"} - {review.rating}⭐
            </Card.Title>
            <Card.Text>{review.comment}</Card.Text>
            <Card.Text className="text-muted">
              {new Date(review.createdAt).toLocaleDateString()}
            </Card.Text>
          </Card.Body>
        </Card>
      ))}
    </Container>
  );
}

export default RestaurantReviews;