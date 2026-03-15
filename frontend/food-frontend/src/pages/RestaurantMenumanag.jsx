
import { useEffect, useState } from "react";
import { Container, Card, Button, Form, Row, Col } from "react-bootstrap";
import API from "../api/axios";

function RestaurantMenuManag() {
  const [restaurantId, setRestaurantId] = useState(null);
  const [products, setProducts] = useState([]);

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [imageFile, setImage] = useState(null); 

  const fetchRestaurant = async () => {
    try {
      const res = await API.get("/restaurants/my-restaurant", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      setRestaurantId(res.data._id);
      fetchProducts(res.data._id);
    } catch (error) {
      console.error("Error fetching restaurant:", error);
    }
  };

  
  const fetchProducts = async (id) => {
    try {
      const res = await API.get(`/products?restaurantId=${id}`);
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Add Product
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!name || !price) {
      alert("Product name and price required");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("image", imageFile); 

      await API.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`, 
        },
      });

      alert("Product added successfully");

      setName("");
      setPrice("");
      setDescription("");
      setCategory("");
      setImage(null);

      fetchProducts(restaurantId);
    } catch (error) {
      console.error("Product creation failed:", error);
      alert("Failed to add product");
    }
  };

    const toggleAvailability = async (id) => {
    try {
      await API.put(`/products/${id}`, {}, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      fetchProducts(restaurantId);
    } catch (error) {
      console.error("Toggle failed:", error);
    }
  };

  useEffect(() => {
    fetchRestaurant();
  }, []);

  return (
    <Container className="mt-4">
      <h2 className="mb-4">Manage Menu</h2>

      {/* ADD PRODUCT */}
      <Card className="mb-4">
        <Card.Body>
          <h4>Add New Menu Item</h4>
          <Form onSubmit={handleAddProduct}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Product Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter product name"
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Price</Form.Label>
                  <Form.Control
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="Enter price"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Optional description"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Control
                type="text"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Example: Biryani, Drinks"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Upload Image</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </Form.Group>

            <Button type="submit">Add Product</Button>
          </Form>
        </Card.Body>
      </Card>

      <h4 className="mt-4">Your Menu</h4>
      {products.length === 0 ? (
        <p>No menu items added</p>
      ) : (
        products.map((product) => (
          <Card key={product._id} className="mb-3">
            <Card.Body>
              <Row>
                <Col md={8}>
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text>₹ {product.price}</Card.Text>
                  {product.description && <Card.Text>{product.description}</Card.Text>}
                  {product.category && (
                    <Card.Text>
                      <strong>Category:</strong> {product.category}
                    </Card.Text>
                  )}
                  <Card.Text>
                    <strong>Status:</strong> {product.available ? "Available" : "Out of Stock"}
                  </Card.Text>
                  <Button
                    variant={product.available ? "secondary" : "success"}
                    onClick={() => toggleAvailability(product._id)}
                  >
                    {product.available ? "Mark Out of Stock" : "Mark Available"}
                  </Button>
                </Col>

                <Col
                  md={4}
                  className="d-flex align-items-center justify-content-center mt-3 mt-md-0"
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{
                        width: "150px",
                        height: "150px",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: "150px",
                        height: "150px",
                        backgroundColor: "#f0f0f0",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: "8px",
                        color: "#aaa",
                      }}
                    >
                      No Image
                    </div>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        ))
      )}
    </Container>
  );
}

export default RestaurantMenuManag;