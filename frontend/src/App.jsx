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
import DepartmentDashboard from "./pages/DepartmentAdmin/DepartmentDashboard";
import Ticket from "./pages/userpage/Ticket";
//
//
import { Toaster } from "react-hot-toast";
import ViewTicket from "./components/DepartmentAdmin_Dashboard/MainContent/ViewTicket";
import Main from "./components/DepartmentAdmin_Dashboard/MainContent/Main";
import Window from "./components/DepartmentAdmin_Dashboard/MainContent/Window";
import WindowContent from "./components/DepartmentAdmin_Dashboard/MainContent/WindowContent";
import ManageWindow from "./components/DepartmentAdmin_Dashboard/MainContent/ManageWindow.jsx/ManageWindow";
import LoadingScreen from "./components/Loader/LoadingScreen";

import UserContent from "./pages/userpage/UserContent";
import UserMainContent from "./components/userpage/UserMainContent";
import UserProfile from "./components/userpage/UserProfile";

function App() {
  const { authUser, checkAuth } = useAuthStore();
  const { ticket, checkTicketAuthUser } = useTicketStore();

  // ✅ Memoize authentication checks
  const initializeAuth = useCallback(() => {
    checkAuth();
  }, [checkAuth]);

  // ✅ Run only once when the component mounts
  useEffect(() => {
    initializeAuth();
    checkTicketAuthUser();
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
          element={authUser ? <Ticket /> : <Navigate to="/userpage" />}
        />
        {/* UserMainContent */}
        <Route
          path="/user"
          element={ticket ? <UserContent /> : <Navigate to="/userpage" />}
        >
          <Route index path="profile" element={<UserProfile />} />
          <Route path="ticket" element={<UserMainContent />} />
        </Route>

        {/* <Route
          path="/ticket"
          element={authUser ? <Ticket /> : <Navigate to="/userpage" />}
        > */}
        {/* <Route
            path="UserTicket"
            element={authUser ? <UserTicket /> : <Navigate to="/login" />}
          /> */}
        {/* UserContent */}
        {/* <Route
            path="user"
            // element={authTicket ? <Ticket /> : <Navigate to="/userpage" />}
            element={<Ticket />}
          /> */}
        {/* </Route> */}

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

          <Route path="window-table" element={<WindowContent />} />
          <Route path="manage-windows" element={<ManageWindow />} />
        </Route>

        {/*  */}

        <Route
          path="/userpage"
          element={
            authUser?.role === "client" ? (
              ticket ? (
                <Navigate to="/user" />
              ) : (
                <User />
              )
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
