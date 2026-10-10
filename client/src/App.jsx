import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Default page */}
        <Route
          path="/"
          element={<Navigate to="/login" replace />}
        />

        {/* Login page */}
        <Route
          path="/login"
          element={<Login />}
        />

        {/* Register page */}
        <Route
          path="/register"
          element={<Register />}
        />
        <Route
          path="/dashboard"
          element={
          <ProtectedRoute>
             <Dashboard />
          </ProtectedRoute>
         }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;