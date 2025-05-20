
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import { Login } from "./pages/auth/Login";
import { Register } from "./pages/auth/Register";
import { ForgotPassword } from "./pages/auth/ForgotPassword";
import { ResetPassword } from "./pages/auth/ResetPassword";
import { AuthLayout } from "./components/Layout/AuthLayout";
import { AuthProvider } from "./hooks/useAuth";
import { DashboardLayout } from "./components/Layout/DashboardLayout";
import { UserDashboardLayout } from "./components/Layout/UserDashboardLayout";
import { Dashboard } from "./pages/admin/Dashboard";
import { UserDashboard } from "./pages/user/Dashboard";
import { SlotsList } from "./pages/admin/Slots/SlotsList";
import { CreateSlot } from "./pages/admin/Slots/CreateSlot";
import { VehiclesList } from "./pages/admin/Vehicles/VehiclesList";
import { CreateVehicle } from "./pages/admin/Vehicles/CreateVehicle";
import { OrdersList } from "./pages/admin/Orders/OrdersList";
import { CreateOrder } from "./pages/admin/Orders/CreateOrder";
import { OrderDetails } from "./pages/admin/Orders/OrderDetails";
import { UsersList } from "./pages/admin/Users/UsersList";
import { UserDetails } from "./pages/admin/Users/UserDetails";
import { CreateUser } from "./pages/admin/Users/CreateUser";
import { AdminProfile } from "./pages/admin/Profile/AdminProfile";
import { UserProfile } from "./pages/user/Profile/UserProfile";
import { UserSlotsList } from "./pages/user/Slots/SlotsList";
import { UserVehiclesList } from "./pages/user/Vehicles/VehiclesList";
import { UserOrdersList } from "./pages/user/Orders/OrdersList";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Index />} />
            
            {/* Auth Routes */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password/:token" element={<ResetPassword />} />
            </Route>
            
            {/* Admin Dashboard Routes */}
            <Route element={<DashboardLayout />}>
              <Route path="/admin/home" element={<Dashboard />} />
              
              {/* Slots */}
              <Route path="/admin/dashboard/slots" element={<SlotsList />} />
              <Route path="/admin/dashboard/slots/create" element={<CreateSlot />} />
              
              {/* Vehicles */}
              <Route path="/admin/dashboard/vehicles" element={<VehiclesList />} />
              
              {/* Orders */}
              <Route path="/admin/dashboard/orders" element={<OrdersList />} />

              
              {/* Users - Admin Only Routes */}
              <Route path="/admin/dashboard/users" element={<UsersList />} />

              
              {/* Admin Profile */}
              <Route path="/admin/dashboard/profile" element={<AdminProfile />} />
            </Route>
            
            {/* User Dashboard Routes */}
            <Route element={<UserDashboardLayout />}>
              <Route path="/user/dashboard" element={<UserDashboard />} />
              <Route path="/user/slots" element={<UserSlotsList />} />
              <Route path="/user/vehicles" element={<UserVehiclesList />} />
              <Route path="/user/orders" element={<UserOrdersList />} />
              <Route path="/user/profile" element={<UserProfile />} />
            </Route>
            
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
