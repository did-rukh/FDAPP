
import { Navbar, Nav, Container, Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
function AppNavbar() {
  const navigate = useNavigate();
  const { token, role, logout } = useContext(AuthContext);
  if (role === null && token) return null;
  if (role) console.log("ROLE:", role);
  const logoutHandler = () => {
    logout();
    navigate("/login"); 
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
    <Container>
      <Navbar.Brand as={Link} to="/">TASTE TRACK</Navbar.Brand>

        <Nav className="ms-auto">
          {!token && (
          <>
             <Nav.Link as={Link} to="/login">Login</Nav.Link>
           <Nav.Link as={Link} to="/register">Register</Nav.Link>
         </>
          )}
          {token && (
          <>
            {/* {role  === "user" && ( */}
            {role && role === "user" && (
          <>
           <Nav.Link as={Link} to="/cart">Cart</Nav.Link>
            <Nav.Link as={Link} to="/orders">My Orders</Nav.Link>
            </>
             )}
            {role && role === "restaurant" && (            
               <>
           <Nav.Link as={Link} to="/restaurant/orders">Restaurant Orders</Nav.Link>
             <Nav.Link as={Link} to="/restaurant/menu"> Manage Menu </Nav.Link>
                 <Nav.Link as={Link} to="/restaurant/reviews">Reviews</Nav.Link>


                </>
              )}
             {role && role === "delivery" && (
             <Nav.Link as={Link} to="/delivery/orders">Delivery Orders</Nav.Link>
              )}
             {role && role === "admin" && (
              <Nav.Link as={Link} to="/admin">Admin Dashboard</Nav.Link>
              )}
            <Button variant="outline-light" onClick={logoutHandler}>Logout</Button>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}
                                   
export default AppNavbar;


