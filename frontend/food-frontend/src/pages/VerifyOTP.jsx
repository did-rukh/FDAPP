
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Form, Button, Card } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
import API from "../api/axios";
import { AuthContext } from "../context/AuthContext";

function VerifyOTP() {

  const [otp, setOtp] = useState("");

  const { login } = useContext(AuthContext);

  const navigate = useNavigate();

 const submitHandler = async (e) => {
  e.preventDefault();

  const email = localStorage.getItem("otpEmail");

  if (!email) {
    alert("Session expired. Please login again.");
    navigate("/login");
    return;
  }

  try {
    const { data } = await API.post("/auth/verify-otp", {
      email,
      otp,
    });

    const token = data.accessToken;

    const decoded = jwtDecode(token);

    const role = decoded.role;

    console.log("ROLE FROM TOKEN:", role);

    login(token, role);

    localStorage.removeItem("otpEmail");

    navigate("/");

  } catch (error) {
    console.log(error.response?.data);
    alert(error.response?.data?.message || "Invalid OTP");
  }
};

  return (

    <Container className="d-flex justify-content-center mt-5">

      <Card style={{ width: "400px" }}>

        <Card.Body>

          <h3 className="mb-3 text-center">Verify OTP</h3>

          <Form onSubmit={submitHandler}>

            <Form.Group className="mb-3">

              <Form.Label>Enter OTP</Form.Label>

              <Form.Control
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                required
              />

            </Form.Group>

            <Button type="submit" className="w-100">
              Verify
            </Button>

          </Form>

        </Card.Body>

      </Card>

    </Container>

  );

}
export default VerifyOTP;
