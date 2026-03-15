


import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppNavbar from "./components/Navbar";
import PrivateRoute from "./components/PrivateRoute";
import Home from "./pages/Home";
import Restaurant from "./pages/Restaurant";
import Login from "./pages/Login";
import VerifyOTP from "./pages/VerifyOTP";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import MyOrder from "./pages/MyOrder";
import RestaurantOrders from "./pages/RestaurantOrders";
import DeliveryOrders from "./pages/DeliveryOrders";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRestaurants from  "./pages/AdminRestaurants";
import AdminRestaurantMenu from "./pages/AdminRestaurantMenu";
import AdminRestaurantReviews from "./pages/AdminRestaurantReview";
import Footer from "./components/Footer";
import HeroSection from "./components/Herosec";
import RestaurantMenuManag from "./pages/RestaurantMenumanag";


function App() {
  return (
    <BrowserRouter>
      <AppNavbar />
      <HeroSection/>

      <main style={{ flex:1  }}>
      

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/restaurant/:id" element={<Restaurant />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-otp" element={<VerifyOTP />} />
        <Route path="/register" element={<Register />} />
        <Route path="/restaurant/orders" element={<RestaurantOrders />} />
        <Route path="/delivery/orders" element={ <PrivateRoute><DeliveryOrders /> </PrivateRoute> } />
        <Route path="/admin" element={ <PrivateRoute><AdminDashboard /></PrivateRoute>} />
        <Route path="/admin/restaurants" element={ <PrivateRoute><AdminRestaurants /></PrivateRoute>} />
        <Route path="/admin/menu/:id" element={ <PrivateRoute><AdminRestaurantMenu /></PrivateRoute>} />
        <Route path="/admin/reviews/:id" element={ <PrivateRoute><AdminRestaurantReviews /></PrivateRoute>} />
        

        <Route path="/cart" element={ <PrivateRoute><Cart /></PrivateRoute> }/>
        <Route path="/orders" element={ <PrivateRoute><MyOrder /></PrivateRoute>}/>
        <Route path="/restaurant/menu" element={ <PrivateRoute><RestaurantMenuManag /></PrivateRoute> } />
        
      </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  );
}

export default App;