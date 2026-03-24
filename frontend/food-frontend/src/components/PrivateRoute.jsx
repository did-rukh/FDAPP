// import { useContext } from "react";
// import { Navigate } from "react-router-dom";
// import { AuthContext } from "../context/AuthContext";

// const PrivateRoute = ({ children }) => {
//   const {token} = useContext(AuthContext);  

//   if (!token) {
//     return <Navigate to="/login" replace />;
//   }
//   return children;
// };
// export default PrivateRoute;     // old code updated code nxt




import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const PrivateRoute = ({ children, allowedRoles }) => {
  const { token, role } = useContext(AuthContext);

  //  Not logged in
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  //  Role not allowed
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/" replace />;
  }

  // ✅ Allowed
  return children;
};

export default PrivateRoute;