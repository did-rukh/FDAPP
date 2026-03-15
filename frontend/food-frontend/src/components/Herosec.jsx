import { Container } from "react-bootstrap";

function HeroSection() {
  return (
    <Container className="mt-4">

      <div
        style={{
          background: "#ff4d4f",
          color: "white",
          padding: "60px",
          borderRadius: "10px",
          textAlign: "center",
          marginBottom: "40px"
        }}>

        <h1>Fastest Food Delivery Near You </h1>
        <p style={{ fontSize: "18px" }}>
          Order delicious meals from the best restaurants.
          Fresh food delivered to your doorstep in minutes.
        </p>
        <p style={{ fontWeight: "bold" }}>
          Discover Restaurants • Order Food • Enjoy Fast Delivery
        </p>
      </div>
    </Container>
  );
}
export default HeroSection;