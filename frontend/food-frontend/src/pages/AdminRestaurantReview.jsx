import { useEffect, useState } from "react";
import { Container, Card } from "react-bootstrap";
import { useParams } from "react-router-dom";
import API from "../api/axios";

function AdminRestaurantReviews() {

  const { id } = useParams();

  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const fetchReviews = async () => {

      try {

        const { data } = await API.get(`/reviews/restaurant/${id}`);
        setReviews(data);

      } catch (error) {

        console.error("Review fetch error:", error);

      } finally {
        setLoading(false);

      }
    };

    fetchReviews();

  }, [id]);

  if (loading) return <p>Loading reviews...</p>;

  if (reviews.length === 0) return <p>No reviews yet</p>;

  return (
    <Container className="mt-4">

      <h3>Restaurant Reviews</h3>

      {reviews.map((review) => (

        <Card key={review._id} className="mb-3">

          <Card.Body>

            <Card.Title>
              {review.user?.name || "Anonymous"} - {review.rating} ⭐
            </Card.Title>

            <Card.Text>
              {review.comment}
            </Card.Text>

            <Card.Text className="text-muted">
              {new Date(review.createdAt).toLocaleDateString()}
            </Card.Text>

          </Card.Body>

        </Card>

      ))}

    </Container>
  );
}

export default AdminRestaurantReviews;