import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";

import {
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import HomeIcon from "@mui/icons-material/Home";
import SchoolIcon from "@mui/icons-material/School";
import PeopleIcon from "@mui/icons-material/People";
import EventNoteIcon from "@mui/icons-material/EventNote";
import DirectionsBusIcon from "@mui/icons-material/DirectionsBus";
import PaymentsIcon from "@mui/icons-material/Payments";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import LogoutIcon from "@mui/icons-material/Logout";
import logo from "../assets/logo.png";
import {
  NotificationImportant,
  UsbRounded,
  VerifiedUserRounded,
} from "@mui/icons-material";

const drawerWidth = 240;

const menuItems = [
  {
    label: "Dashboard",
    path: "/dashboard",
    icon: <HomeIcon />,
    permission: "dashboard",
  },
  {
    label: "Students",
    path: "/dashboard/students",
    icon: <SchoolIcon />,
    permission: "students",
  },
  {
    label: "Faculty",
    path: "/dashboard/faculty",
    icon: <PeopleIcon />,
    permission: "faculty",
  },
  {
    label: "Attendance",
    path: "/dashboard/attendance",
    icon: <EventNoteIcon />,
    permission: "attendance",
  },
  {
    label: "Transport",
    path: "/dashboard/transport",
    icon: <DirectionsBusIcon />,
    permission: "transport",
  },
  {
    label: "Fee Structure",
    path: "/dashboard/fee",
    icon: <PaymentsIcon />,
    permission: "fee",
  },
  {
    label: "Time Table",
    path: "/dashboard/timetable",
    icon: <MenuBookIcon />,
    permission: "timetable",
  },
  {
    label: "Notifications",
    path: "/dashboard/notifications",
    icon: <NotificationImportant />,
    permission: "notifications",
  },
  {
    label: "RFID Attendance",
    path: "/dashboard/rfid-attendance",
    icon: <i className="bi bi-bar-chart-fill" />,
    permission: "rfid-attendance",
  },
  {
    label: "Practice",
    path: "/dashboard/practice",
    icon: <SportsEsportsIcon />,
    permission: "practice",
  },
  {
    label: "Users",
    path: "/dashboard/users",
    icon: <VerifiedUserRounded />,
    permission: "admin-only",
  },
];

export default function DashboardLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const permissions =
    typeof user.permissions === "string"
      ? JSON.parse(user.permissions)
      : user.permissions || [];

  const filteredMenuItems = menuItems.filter((item) => {
    // ✅ admin sees all
    if (user.role?.toLowerCase() === "admin") {
      return true;
    }

    // ✅ users module hidden for moderators
    if (item.permission === "admin-only") {
      return false;
    }

    // ✅ dashboard always visible
    if (item.permission === "dashboard") {
      return true;
    }

    return permissions.includes(item.permission);
  });

  const drawerContent = (
    <>
      <Box
        sx={{
          // display: "flex",
          alignItems: "center",
          gap: 1.5,
          padding: "10px",
          background: "#334155",
        }}
      ></Box>
      {/* MENU */}
      <List>
        {filteredMenuItems.map((item) => {
          const isActive = location.pathname === item.path;

          return (
            <ListItemButton
              key={item.label}
              onClick={() => {
                navigate(item.path);

                if (isMobile) {
                  setMobileOpen(false);
                }
              }}
              sx={{
                mx: 1,
                mb: 0.5,
                borderRadius: 2,
                background: isActive ? "#334155" : "transparent",
                "&:hover": { background: "#334155" },
              }}
            >
              <ListItemIcon sx={{ color: "#cbd5f5" }}>{item.icon}</ListItemIcon>

              <ListItemText primary={item.label} sx={{ color: "#e2e8f0" }} />
            </ListItemButton>
          );
        })}

        {/* LOGOUT */}
        <ListItemButton
          onClick={handleLogout}
          sx={{
            mx: 1,
            mt: 2,
            borderRadius: 2,
            "&:hover": { background: "#7f1d1d" },
          }}
        >
          <ListItemIcon sx={{ color: "#f87171" }}>
            <LogoutIcon />
          </ListItemIcon>

          <ListItemText primary="Logout" sx={{ color: "#f87171" }} />
        </ListItemButton>
      </List>

      <div
        style={{
          bottom: 10,
          position: "absolute",
        }}
      >
        {/* Logo */}
        <Box
          sx={{
            // display: "flex",
            alignItems: "center",
            gap: 1.5,
            padding: "10px",
          }}
        >
          <Box
            sx={{
              // width: 80,
              borderRadius: 3,
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img
              src={logo}
              alt="Logo"
              style={{
                width: "50px",
                objectFit: "contain",
                padding: 4,
              }}
            />
          </Box>

          <Box>
            <Typography
              sx={{
                fontSize: 22,
                fontWeight: 700,
                lineHeight: 1.1,
                textTransform: "uppercase",
              }}
            >
              Desire IT
            </Typography>
          </Box>
        </Box>
        <Typography
          sx={{
            mt: 2,
            fontSize: 13,
            color: "rgba(255,255,255,0.7)",
            textAlign: "center",
            letterSpacing: 0.5,
          }}
        >
          © {new Date().getFullYear()} Desire IT. All Rights Reserved.
        </Typography>
      </div>
    </>
  );

  return (
    <Box sx={{ display: "flex" }}>
      {/* MOBILE DRAWER */}
      {isMobile ? (
        <Drawer
          variant="temporary"
          open={mobileOpen}
          // open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            "& .MuiDrawer-paper": {
              width: drawerWidth,
              background: "#1e293b",
              color: "#fff",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      ) : (
        /* DESKTOP DRAWER */
        <Drawer
          variant="persistent"
          open={sidebarOpen}
          sx={{
            width: sidebarOpen ? drawerWidth : 0,
            flexShrink: 0,
            transition: "0.3s",

            "& .MuiDrawer-paper": {
              width: drawerWidth,
              boxSizing: "border-box",
              background: "#1e293b",
              color: "#fff",
              transition: "0.3s",
              overflowX: "hidden",
            },
          }}
        >
          {drawerContent}
        </Drawer>
      )}

      {/* RIGHT SIDE */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: "100%",
          minWidth: 0,
          backgroundColor: "#f1f5f9",
          transition: "0.3s",
        }}
      >
        {/* TOPBAR */}
        <AppBar
          position="sticky"
          sx={{
            background: "#fff",
            color: "#000",
            boxShadow: "none",
            borderBottom: "1px solid #e2e8f0",
            zIndex: 1200,
          }}
        >
          <Toolbar>
            <IconButton
              edge="start"
              onClick={() => {
                if (isMobile) {
                  handleDrawerToggle();
                } else {
                  setSidebarOpen(!sidebarOpen);
                }
              }}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6">
              {menuItems.find((item) => item.path === location.pathname)
                ?.label || "Dashboard"}
            </Typography>
          </Toolbar>
        </AppBar>

        {/* CONTENT */}
        <Box
          sx={{
            p: { xs: 2, md: 3 },
            overflow: "auto",
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
