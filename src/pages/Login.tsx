import { useState } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { loginUser } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import CustomAlert from "../components/CustomAlert";
import logo from "../assets/logo.png";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [alert, setAlert] = useState({
    open: false,
    message: "",
    severity: "error" as "error" | "success",
  });

  const navigate = useNavigate();

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
      const res = await loginUser(form);

      // localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setAlert({
        open: true,
        message: "Login successful",
        severity: "success",
      });

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);
    } catch (err: any) {
      setAlert({
        open: true,
        message: err.response?.data?.message || "Invalid login",
        severity: "error",
      });
    }
  };

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#334155",
        flexFlow: "column",
      }}
    >
      <Paper sx={{ p: 4, width: "100%", maxWidth: 400, borderRadius: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Login
        </Typography>

        <Typography align="center" mb={2} color="text.secondary">
          Welcome back!
        </Typography>

        <TextField
          label="Email"
          name="email"
          fullWidth
          margin="normal"
          onChange={handleChange}
        />

        <TextField
          label="Password"
          name="password"
          type="password"
          fullWidth
          margin="normal"
          onChange={handleChange}
        />

        <Button
          fullWidth
          variant="contained"
          sx={{ mt: 3, py: 1.5 }}
          onClick={handleLogin}
        >
          Login
        </Button>

        {/* <div style={{ marginTop: 20 }}>
          <Typography textAlign="center">
            Don’t have an account?
            <span
              style={{ color: "#1976d2", cursor: "pointer", marginLeft: 5 }}
              onClick={() => navigate("/register")}
            >
              Register
            </span>
          </Typography>
        </div> */}
      </Paper>

      {/* Logo */}
      <Box
        sx={{
          // display: "flex",
          alignItems: "center",
          gap: 1.5,
          padding: "10px",
          background: "#334155",
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
              color: "white",
            }}
          >
            Desire IT
          </Typography>

          <Typography
            sx={{
              fontSize: 12,
              // color: "#6b7280",
              letterSpacing: 1,
              color: "white",
            }}
          >
            SCHOOL MANAGEMENT SYSTEM
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

      <CustomAlert
        open={alert.open}
        message={alert.message}
        severity={alert.severity}
        onClose={() => setAlert({ ...alert, open: false })}
      />
    </Box>
  );
}
