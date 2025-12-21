import { Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoute from "./auth-interface/ProtectedRoute.jsx";
import Auth from "./auth-interface/Auth.jsx";
import Logout from "./auth-interface/Logout.jsx";
import Welcome from "./auth-interface/Welcome.jsx";
import Header from "./header-footer-interface/Header.jsx";
import Dashboard from "./admin-interface/Dashboard.jsx";
import HomePage from "./home-page-interface/HomePage.jsx";
import ProductInfo from "./product-info-interface/ProductInfo.jsx";
import Cart from "./cart-interface/Cart.jsx";
import CheckOut from "./cart-interface/CheckOut.jsx";
import Profile from "./profile-interface/Profile.jsx";
import Footer from "./header-footer-interface/Footer.jsx";


export default function App() {
  const location = useLocation()
  const hideHeaderFooterRoutes = ["/", "/auth"]
  return (
    <>
      
      {!hideHeaderFooterRoutes.includes(location.pathname) && <Header />}        
      <Routes>
          <Route path="/" element={<Welcome />} />

          <Route path="/ad" element={<Dashboard />} />

          <Route path="/auth" element={<Auth />} />

          <Route path="/logout" element={<Logout />} />
          
          <Route path="/home" element={<HomePage />} />

          <Route path="/product/:slug" element={<ProductInfo  />} />

          <Route path="/cart" element={
              <ProtectedRoute>
                <Cart/>
              </ProtectedRoute>
            } />

          <Route path="/Checkout" element={
              <ProtectedRoute>
                <CheckOut/>
              </ProtectedRoute>
            } />

          <Route path="/profile" element={
              <ProtectedRoute>
                <Profile/>
              </ProtectedRoute>
            } />
      </Routes>
      {!hideHeaderFooterRoutes.includes(location.pathname) && <Footer />}
      
    </>
  )
}


