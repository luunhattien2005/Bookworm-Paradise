import { Routes, Route, useLocation } from "react-router-dom";
import ProtectedRoute from "./auth-interface/ProtectedRoute.jsx";
import Card from "./Card.jsx";
import Auth from "./auth-interface/Auth.jsx";
import Logout from "./auth-interface/Logout.jsx";
import Welcome from "./auth-interface/Welcome.jsx";
import Header from "./header-footer-interface/Header.jsx";
import Dashboard from "./admin-interface/components/dashboard/Dashboard.jsx";
import HomePage from "./home-page-interface/HomePage.jsx";
import ProductInfo from "./product-info-interface/ProductInfo.jsx";


export default function App() {
  const location = useLocation()

  return (
    <>
      
      {location.pathname !== "/auth" && <Header />}        
      <Routes>
          <Route path="/" element={<Welcome />} />

          <Route path="/ad" element={<Dashboard />} />

          <Route path="/auth" element={<Auth />} />

          <Route path="/logout" element={<Logout />} />
          
          <Route path="/home" element={<HomePage />} />

          <Route path="/product/:slug" element={<ProductInfo  />} />

          <Route path="/profile" element={
              <ProtectedRoute>
                <Card name="Luu Nhat Tien" school="HEHEE" ID={2323230}/>
              </ProtectedRoute>
            } />
          
      </Routes>
      
    </>
  )
}


