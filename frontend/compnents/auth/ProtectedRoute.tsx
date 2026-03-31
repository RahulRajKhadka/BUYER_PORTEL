import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from "../../store/authStore.js"
import { Navbar } from "../ui/Navbar.js"

export const ProtectedRoute = () => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return (
    <div className="min-h-screen bg-stone-50">
      <Navbar/>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
};