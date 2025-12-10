import { useContext } from "react";
import { AuthContext } from "./AuthContext.jsx";
import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { user, loading, logoutToHome } = useContext(AuthContext);
  const location = useLocation();

  console.log(`Ket qua tra ve tu protected route ${JSON.stringify(user)}`)
  if (loading) {
    return <div>Loading...</div>;   // Chờ load localStorage
  }
  if (!user) {
    if (logoutToHome) {
      return <Navigate to="/home" replace />;
    }
    // Chuyển sang trang auth, nhưng nhớ lại vị trí cũ
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return children;
}
