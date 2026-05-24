import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DashboardLayout from "./layouts/DashboardLayout";

import Home from "./pages/dashboard/Home";
import Students from "./pages/dashboard/Students";
import Faculty from "./pages/dashboard/Faculty";
import Attendance from "./pages/dashboard/Attendance";
import Transport from "./pages/dashboard/Transport";
import Fee from "./pages/dashboard/Fee";
import Practice from "./pages/dashboard/Practice";
import StudentAttendance from "./pages/studentAttendance";
import TimeTable from "./pages/dashboard/TimeTable";
import RFIDAttendance from "./pages/rfidAttendance";
import Notifications from "./pages/notifications";
import Users from "./pages/users";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard Layout */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<Home />} />
          <Route
            path="students"
            element={
              <ProtectedRoute permission="students">
                <Students />
              </ProtectedRoute>
            }
          />
          <Route
            path="faculty"
            element={
              <ProtectedRoute permission="faculty">
                <Faculty />
              </ProtectedRoute>
            }
          />
          <Route
            path="attendance"
            element={
              <ProtectedRoute permission="attendance">
                <Attendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="transport"
            element={
              <ProtectedRoute permission="transport">
                <Transport />
              </ProtectedRoute>
            }
          />
          <Route
            path="fee"
            element={
              <ProtectedRoute permission="fee">
                <Fee />
              </ProtectedRoute>
            }
          />
          <Route
            path="timetable"
            element={
              <ProtectedRoute permission="timetable">
                <TimeTable />
              </ProtectedRoute>
            }
          />
          <Route
            path="practice"
            element={
              <ProtectedRoute permission="practice">
                <Practice />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/student-attendance/:id"
            element={
              <ProtectedRoute permission="student-attendance">
                <StudentAttendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/rfid-attendance"
            element={
              <ProtectedRoute permission="rfid-attendance">
                <RFIDAttendance />
              </ProtectedRoute>
            }
          />
          <Route
            path="notifications"
            element={
              <ProtectedRoute permission="notifications">
                <Notifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="users"
            element={
              <ProtectedRoute permission="users">
                <Users />
              </ProtectedRoute>
            }
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
