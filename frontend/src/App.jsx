import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect, useCallback } from "react";
import { useAuthStore } from "./store/useAuthStore";
import { useTicketStore } from "./store/useTicketStore";
//
//
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/SuperAdmin/Dashboard";
import Signup from "./pages/Signup";
import User from "./pages/userpage/User";
import SetUpAccount from "./pages/SetUpAccount";
import SystemOverview from "./components/SuperAdmin_Dashboard/MainContent/SystemOverview";
import OrganizationUnits from "./components/SuperAdmin_Dashboard/MainContent/OrganizationUnits";
import UserTicket from "./pages/userpage/UserTicket";
import DepartmentDashboard from "./pages/DepartmentAdmin/DepartmentDashboard";
//
//
import Ticket from "./pages/userpage/Ticket";
import { Toaster } from "react-hot-toast";
import ViewTicket from "./components/DepartmentAdmin_Dashboard/MainContent/ViewTicket";
import Main from "./components/DepartmentAdmin_Dashboard/MainContent/Main";
import Window from "./components/DepartmentAdmin_Dashboard/MainContent/Window";
import WindowContent from "./components/DepartmentAdmin_Dashboard/MainContent/WindowContent";

function App() {
  const { authUser, checkAuth } = useAuthStore();
  const { authTicket } = useTicketStore();

  // ✅ Memoize authentication checks
  const initializeAuth = useCallback(() => {
    checkAuth();
  }, [checkAuth]);

  // ✅ Run only once when the component mounts
  useEffect(() => {
    initializeAuth();
  }, [initializeAuth]);

  return (
    <div>
      <Routes>
        <Route
          path="/login"
          element={!authUser ? <LoginPage /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/signup"
          element={!authUser ? <Signup /> : <Navigate to="/dashboard" />}
        />
        <Route
          path="/setup-account"
          element={
            authUser ? (
              authUser.is_user_info_set === 0 ? (
                <SetUpAccount />
              ) : (
                <Navigate to="/userpage" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/ticket"
          // element={authTicket ? <Ticket /> : <Navigate to="/userpage" />}
          element={<Ticket />}
        />
        <Route path="/UserTicket" element={<UserTicket />} />

        {/* Super Admin */}

        <Route
          path="/dashboard"
          element={
            authUser ? (
              authUser.role === "superadmin" ? (
                <Dashboard />
              ) : authUser.role === "departmentadmin" ? (
                <Navigate to="/department-dashboard" />
              ) : authUser.role === "client" ? (
                authUser.is_user_info_set === 0 ? (
                  <Navigate to="/setup-account" />
                ) : (
                  <Navigate to="/userpage" />
                )
              ) : (
                <Navigate to="/login" />
              )
            ) : (
              <Navigate to="/login" />
            )
          }
        >
          <Route index element={<SystemOverview />} />
          <Route path="organization-units" element={<OrganizationUnits />} />
        </Route>

        {/* Department Admin */}
        <Route path="/department-dashboard" element={<DepartmentDashboard />}>
          <Route index element={<Main />} />
          <Route path="ticket-view" element={<ViewTicket />} />
          <Route path="windows" element={<Window />} />
          <Route path="windows/:windowId" element={<WindowContent />} />
        </Route>

        {/*  */}

        <Route
          path="/userpage"
          element={
            authUser?.role === "client" ? (
              <User />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;
