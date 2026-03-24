import { useEffect, useState } from "react";
import { Container, Table, Button, Badge } from "react-bootstrap";
import API from "../api/axios";
import { toast } from "react-toastify";

function AdminDeliveryPartners() {
  const [partners, setPartners] = useState([]);

  const fetchPartners = async () => {
    try {
      const { data } = await API.get("/admin/delivery-partners");
      setPartners(data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load delivery partners");
    }
  };

  useEffect(() => {
    fetchPartners();
  }, []);

  // 🔴 BLOCK / UNBLOCK
  const toggleBlock = async (id) => {
    try {
      const res = await API.put(`/admin/toggle-user/${id}`);
      toast.success(res.data.message);

      setPartners((prev) =>
        prev.map((p) =>
          p._id === id ? { ...p, isBlocked: res.data.isBlocked } : p
        )
      );
    } catch (err) {
      console.error(err);
      toast.error("Action failed");
    }
  };

  return (
    <Container className="mt-4">
      <h3>Delivery Partners</h3>

      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </thead>

        <tbody>
          {partners.map((p) => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.email}</td>

              <td>
                {p.isBlocked ? (
                  <Badge bg="danger">Blocked</Badge>
                ) : (
                  <Badge bg="success">Active</Badge>
                )}
              </td>

              <td>
                <Button
                  variant={p.isBlocked ? "success" : "danger"}
                  onClick={() => toggleBlock(p._id)}
                >
                  {p.isBlocked ? "Unblock" : "Block"}
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </Container>
  );
}

export default AdminDeliveryPartners;