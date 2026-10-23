import { Navigate, Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useAuth } from "./context/AuthContext";
import AdminDashboard from "./pages/AdminDashboard";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import PaymentResult from "./pages/PaymentResult";
function Protected({ children, role }) {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div className="grid min-h-[70vh] place-items-center text-slate-500">
        Loading your account…
      </div>
    );
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/dashboard" replace />;
  return children;
}
export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Auth mode="register" />} />
        <Route path="/login" element={<Auth mode="login" />} />
        <Route
          path="/dashboard"
          element={
            <Protected>
              <Dashboard />
            </Protected>
          }
        />
        <Route
          path="/admin"
          element={
            <Protected role="admin">
              <AdminDashboard />
            </Protected>
          }
        />
        <Route
          path="/payment/success"
          element={
            <Protected>
              <PaymentResult />
            </Protected>
          }
        />
        <Route
          path="/payment/fail"
          element={
            <Protected>
              <PaymentResult />
            </Protected>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <footer className="border-t border-slate-200 px-5 py-7 text-center text-sm text-slate-500">
        © {new Date().getFullYear()} Coding Rangers · Learn skills that move you
        forward
      </footer>
    </>
  );
}
