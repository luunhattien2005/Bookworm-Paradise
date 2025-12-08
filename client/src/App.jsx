import { BrowserRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./auth-interface/ProtectedRoute.jsx";
import Card from './Card.jsx'
import Auth from './auth-interface/Auth.jsx'

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
            <Route path='/home' element={
                <ProtectedRoute>
                  <Card name="Luu Nhat Tien" school="HCMUS" ID={23127127}/>
                </ProtectedRoute>
              } />
            <Route path='/auth' element={<Auth />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}


