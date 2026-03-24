import { useState } from "react";
import API from "../api/axios";
import { Container, Form, Button, Row, Col, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function AdminDashboard() {

    const navigate = useNavigate();


  const [restaurantData, setRestaurantData] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: ""
  });

  const [deliveryData, setDeliveryData] = useState({
    name: "",
    email: "",
    password: "",
    phone: ""
  });

  const handleRestaurantChange = (e) => {
    setRestaurantData({ ...restaurantData, [e.target.name]: e.target.value });
  };
  const handleDeliveryChange = (e) => {
    setDeliveryData({ ...deliveryData, [e.target.name]: e.target.value });
  };
  const createRestaurant = async (e) => {
    e.preventDefault();

    try {
      const res = await API.post("/admin/add-restaurant", restaurantData);

      toast.success("Restaurant created successfully");
      console.log(res.data);

      setRestaurantData({
        name: "",
       email: "",
       password: "",
      phone: "",
       street: "",
        city: "",
      state: "",
        zip: ""
      });

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error creating restaurant");
    }
  };

  const createDelivery = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/admin/create-delivery", deliveryData);

      toast.success("Delivery partner created");
      console.log(res.data);

      setDeliveryData({
         name: "",
        email: "",
        password: "",
         phone: ""
      });

    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Error creating delivery partner");
    }
  };

  return (
    <Container className="mt-4">

      <h2 className="mb-4">Admin Dashboard</h2>
      <Row>
        <Col md={6}>
          <Card className="p-3">
            <h4>Create Restaurant</h4>
            <Form onSubmit={createRestaurant}>
         <Form.Control
                placeholder="Restaurant Name"
                 name="name"
                 value={restaurantData.name}
                onChange={handleRestaurantChange}
                required
                 className="mb-2"
              />
        <Form.Control
                 placeholder="Email"
                  name="email"
                  value={restaurantData.email}
             onChange={handleRestaurantChange}
                required
                className="mb-2"
           />
          <Form.Control
             placeholder="Password"
               name="password"
             type="password"
             value={restaurantData.password}
             onChange={handleRestaurantChange}
              required
             className="mb-2"
              />
           <Form.Control
             placeholder="Phone"
               name="phone"
             value={restaurantData.phone}
             onChange={handleRestaurantChange}
             required
              className="mb-2"
              />
     <Form.Control
                placeholder="Street"
              name="street"
               value={restaurantData.street}
               onChange={handleRestaurantChange}
               required
                className="mb-2"
              />

          <Form.Control
            placeholder="City"
                name="city"
          value={restaurantData.city}
           onChange={handleRestaurantChange}
          required
           className="mb-2"
     />
       <Form.Control
             placeholder="State"
             name="state"
            value={restaurantData.state}
             onChange={handleRestaurantChange}
          className="mb-2"
       />

          <Form.Control
             placeholder="Zip"
             name="zip"
                value={restaurantData.zip}
            onChange={handleRestaurantChange}
                className="mb-2"
              />

              <Button type="submit" variant="primary">
                Create Restaurant
              </Button>
            </Form>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="p-3">
            <h4>Create Delivery Partner</h4>

         <Form onSubmit={createDelivery}>
       <Form.Control
        placeholder="Name"
        name="name"
          value={deliveryData.name}
         onChange={handleDeliveryChange}
         required
         className="mb-2"
         />
         <Form.Control
           placeholder="Email"
           name="email"
             value={deliveryData.email}
            onChange={handleDeliveryChange}
             required
             className="mb-2"
              />

          <Form.Control
             placeholder="Password"
                type="password"
             name="password"
            value={deliveryData.password}
             onChange={handleDeliveryChange}
             required
             className="mb-2"
         />
         <Form.Control
            placeholder="Phone"
            name="phone"
          value={deliveryData.phone}
            onChange={handleDeliveryChange}
            required
            className="mb-2"
         />
           <Button type="submit" variant="success"> Create Delivery</Button>
            </Form>
          </Card>
        </Col>

      </Row>
      <Row className="mt-4">
        <Col>
          <Card className="p-3 text-center">
            <h4>Restaurant Management</h4>
            <Button
              variant="dark"
              onClick={() => navigate("/admin/restaurants")}>
              View Restaurants
            </Button>
          </Card>
        </Col>
      </Row>
       
       <Row className="mt-4">
    <Col>
    <Card className="p-3 text-center">
      <h4>Delivery Management</h4>
      <Button
        variant="dark"
        onClick={() => navigate("/admin/delivery")}
      >
        View Delivery Partners
      </Button>
    </Card>
   </Col>
     </Row>
    </Container>
  );
}

export default AdminDashboard;