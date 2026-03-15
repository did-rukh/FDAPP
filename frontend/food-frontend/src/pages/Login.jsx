

import { useState } from "react";
import { Container, Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import API from "../api/axios";

function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const changeHandler = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const submitHandler = async (e) => {

    e.preventDefault();

    try {

      await API.post("/auth/login", formData);

      localStorage.setItem("otpEmail", formData.email);

      navigate("/verify-otp");

    } catch (error) {

      alert(error.response?.data || "Login failed");

    }

  };

  return (

    <Container className="d-flex justify-content-center mt-5">

      <Card style={{ width: "400px" }}>

        <Card.Body>

          <h3 className="mb-3 text-center">Login</h3>

          <Form onSubmit={submitHandler}>

            <Form.Group className="mb-3">

              <Form.Label>Email</Form.Label>

              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={changeHandler}
                required
              />

            </Form.Group>

            <Form.Group className="mb-3">

              <Form.Label>Password</Form.Label>

              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={changeHandler}
                required
              />

            </Form.Group>

            <Button type="submit" className="w-100">
              Login
            </Button>

          </Form>

        </Card.Body>

      </Card>

    </Container>

  );

}

export default Login;