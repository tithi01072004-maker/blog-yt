import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector(store => store.auth);

  // ❌ not logged in → go to home
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // ✅ logged in → allow access
  return children;
};

export default ProtectedRoute;
