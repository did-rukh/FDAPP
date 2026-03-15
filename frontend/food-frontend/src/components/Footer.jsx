import { Container, Row, Col } from "react-bootstrap";

function Footer() {
  return (
    <footer
      style={{
        backgroundColor: "#111",
        color: "#fff",
        padding: "40px 0",
        marginTop: "40px"
      }}
    >
      <Container>
        <Row>
          <Col md={3}>
            <h5>TASTE TRACK</h5>
            <p>
              Order delicious food from your favorite restaurants.
              Fast delivery and great taste in every bite.
            </p>
          </Col>
          <Col md={3}>
            <h5>Company</h5>
            <p>About Us</p>
            <p>Careers</p>
            <p>Blog</p>
          </Col>
          <Col md={3}>
            <h5>Contact</h5>
            <p>Email: support@tastetrack.com</p>
            <p>Phone: +91 9876543210</p>
            <p>Location: Banglore, India</p>
          </Col> 
          <Col md={3}>
            <h5>Info</h5>
            <p>Terms & Conditions </p>
            <p>Privacy Policy</p>
            <p>Services</p>
          </Col>
        </Row>

        <hr style={{ borderColor: "#444" }} />

        <p className="text-center">
          © {new Date().getFullYear()} TasteTrackk. All rights reserved.
        </p>

      </Container>
    </footer>
  );
}

export default Footer;