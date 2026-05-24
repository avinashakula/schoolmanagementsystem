import { useEffect, useState } from "react";

import { Switch, FormControlLabel, IconButton, Checkbox } from "@mui/material";

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  MenuItem,
  Grid,
  Chip,
  Dialog,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";

import { createUser, getUsers, updateUser } from "../../services/userService";

const roles = ["Admin", "Moderator"];
const permissionsList = [
  "students",
  "faculty",
  "attendance",
  "transport",
  "fee",
  "timetable",
  "notifications",
  "rfidAttendance",
  "practice",
];
const initialForm = {
  id: null,
  firstName: "",
  lastName: "",
  email: "",
  contact: "",
  city: "",
  password: "",
  role: "Moderator",
  permissions: [],
  status: true,
};

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);

  const [form, setForm] = useState(initialForm);

  const [isEdit, setIsEdit] = useState(false);

  const loadUsers = async () => {
    try {
      const res = await getUsers();

      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleSubmit = async () => {
    try {
      if (isEdit) {
        await updateUser(form.id, {
          ...form,
          permissions: JSON.stringify(form.permissions),
        });
      } else {
        const payload = {
          ...form,
          permissions: JSON.stringify(form.permissions),
        };
        await createUser(payload);
      }

      alert(
        isEdit
          ? "User updated successfully ✅"
          : "User created successfully ✅",
      );

      setForm(initialForm);

      setIsEdit(false);

      loadUsers();
    } catch (err) {
      console.error(err);
    }
  };

  const handleEdit = (user: any) => {
    setForm({
      ...user,
      password: "",
      permissions: user.permissions
        ? typeof user.permissions === "string"
          ? JSON.parse(user.permissions)
          : user.permissions
        : [],
    });

    setIsEdit(true);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Box>
      {/* FORM */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 3,
        }}
      >
        <Typography variant="h6" mb={3}>
          {isEdit ? "Update User" : "Create User"}
        </Typography>

        <Grid container spacing={2}>
          <Grid item xs={12} md={3}>
            <TextField
              label="First Name"
              fullWidth
              value={form.firstName}
              onChange={(e) =>
                setForm({
                  ...form,
                  firstName: e.target.value,
                })
              }
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              label="Last Name"
              fullWidth
              value={form.lastName}
              onChange={(e) =>
                setForm({
                  ...form,
                  lastName: e.target.value,
                })
              }
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              label="Email"
              fullWidth
              value={form.email}
              onChange={(e) =>
                setForm({
                  ...form,
                  email: e.target.value,
                })
              }
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              label="Contact"
              fullWidth
              value={form.contact}
              onChange={(e) =>
                setForm({
                  ...form,
                  contact: e.target.value,
                })
              }
            />
          </Grid>

          <Grid item xs={12} md={3}>
            <TextField
              label="City"
              fullWidth
              value={form.city}
              onChange={(e) =>
                setForm({
                  ...form,
                  city: e.target.value,
                })
              }
            />
          </Grid>

          {!isEdit && (
            <Grid item xs={12} md={3}>
              <TextField
                label="Password"
                type="password"
                fullWidth
                value={form.password}
                onChange={(e) =>
                  setForm({
                    ...form,
                    password: e.target.value,
                  })
                }
              />
            </Grid>
          )}

          <Grid item xs={12} md={3}>
            <TextField
              select
              label="Role"
              fullWidth
              value={form.role}
              onChange={(e) =>
                setForm({
                  ...form,
                  role: e.target.value,
                })
              }
            >
              {roles.map((role) => (
                <MenuItem key={role} value={role}>
                  {role}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={12} md={3}>
            <Box
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
              }}
            >
              <FormControlLabel
                control={
                  <Switch
                    checked={form.status}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        status: e.target.checked,
                      })
                    }
                  />
                }
                label={form.status ? "Active" : "Inactive"}
              />
            </Box>
          </Grid>

          <Grid item xs={12}>
            <Typography variant="subtitle1" mb={1}>
              Module Access
            </Typography>

            <Grid container spacing={1}>
              {permissionsList.map((permission) => (
                <Grid item xs={6} md={4} key={permission}>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={form.permissions.includes(permission)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setForm({
                              ...form,
                              permissions: [...form.permissions, permission],
                            });
                          } else {
                            setForm({
                              ...form,
                              permissions: form.permissions.filter(
                                (p: string) => p !== permission,
                              ),
                            });
                          }
                        }}
                      />
                    }
                    label={permission}
                  />
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Button variant="contained" onClick={handleSubmit}>
              {isEdit ? "Update User" : "Create User"}
            </Button>

            {isEdit && (
              <Button
                variant="outlined"
                sx={{ ml: 2 }}
                onClick={() => {
                  setForm(initialForm);

                  setIsEdit(false);
                }}
              >
                Cancel
              </Button>
            )}
          </Grid>
        </Grid>
      </Paper>

      {/* LIST */}
      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
        }}
      >
        <Typography variant="h6" mb={3}>
          Users List
        </Typography>

        {users.length === 0 && <Typography>No users found</Typography>}

        {users.map((user) => (
          <Box
            key={user.id}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #eee",
              py: 2,
              flexWrap: "wrap",
              gap: 2,
            }}
          >
            <Box>
              <Typography fontWeight={600}>
                {user.firstName} {user.lastName}
              </Typography>

              <Typography variant="body2">{user.email}</Typography>

              <Typography variant="body2">{user.contact}</Typography>

              <Typography variant="body2">{user.city}</Typography>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              <Chip
                label={user.role}
                color={user.role === "Admin" ? "primary" : "secondary"}
              />

              <Chip
                label={user.status ? "Active" : "Inactive"}
                color={user.status ? "success" : "error"}
              />

              <IconButton onClick={() => handleEdit(user)}>
                <EditIcon />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Paper>
    </Box>
  );
}
