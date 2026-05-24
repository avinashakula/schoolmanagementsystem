import { useState } from "react";
import { Box, Button, TextField, Typography, Paper } from "@mui/material";
import { registerUser } from "../utils/auth";
import { useNavigate } from "react-router-dom";
import CustomAlert from "../components/CustomAlert";

export default function Register() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    contact: "",
    city: "",
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

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const isValidPhone = (phone: string) => {
    return /^[0-9]{10}$/.test(phone);
  };

  const handleRegister = async () => {
    // 🔍 Validation
    if (!form.firstName) {
      return setAlert({
        open: true,
        message: "First name is required",
        severity: "error",
      });
    }

    if (!form.lastName) {
      return setAlert({
        open: true,
        message: "Last name is required",
        severity: "error",
      });
    }

    if (!form.email) {
      return setAlert({
        open: true,
        message: "Email is required",
        severity: "error",
      });
    }

    if (!isValidEmail(form.email)) {
      return setAlert({
        open: true,
        message: "Invalid email format",
        severity: "error",
      });
    }

    if (!form.contact) {
      return setAlert({
        open: true,
        message: "Phone number is required",
        severity: "error",
      });
    }

    if (!isValidPhone(form.contact)) {
      return setAlert({
        open: true,
        message: "Phone must be 10 digits",
        severity: "error",
      });
    }

    try {
      await registerUser(form);

      setAlert({
        open: true,
        message: "Registration successful",
        severity: "success",
      });

      setTimeout(() => {
        navigate("/");
      }, 1200);
    } catch (err: any) {
      setAlert({
        open: true,
        message: err.response?.data?.message || "Registration failed",
        severity: "error",
      });
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #667eea, #764ba2)",
        p: 2,
      }}
    >
      <Paper sx={{ p: 4, maxWidth: 500, width: "100%", borderRadius: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Register
        </Typography>

        <Box display="flex" gap={2}>
          <TextField
            label="First Name"
            name="firstName"
            fullWidth
            onChange={handleChange}
          />
          <TextField
            label="Last Name"
            name="lastName"
            fullWidth
            onChange={handleChange}
          />
        </Box>

        <TextField
          label="Email"
          name="email"
          fullWidth
          margin="normal"
          onChange={handleChange}
        />
        <TextField
          label="Phone"
          name="contact"
          fullWidth
          margin="normal"
          onChange={handleChange}
        />
        <TextField
          label="City"
          name="city"
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
          sx={{ mt: 3 }}
          onClick={handleRegister}
        >
          Register
        </Button>
        <div style={{ marginTop: 20 }}>
          <Typography mt={2} textAlign="center">
            Already have an account?
            <span
              style={{ color: "#1976d2", cursor: "pointer", marginLeft: 5 }}
              onClick={() => navigate("/")}
            >
              Login
            </span>
          </Typography>
        </div>
      </Paper>

      {/* 🔥 Reusable Alert */}
      <CustomAlert
        open={alert.open}
        message={alert.message}
        severity={alert.severity}
        onClose={() => setAlert({ ...alert, open: false })}
      />
    </Box>
  );
}
