import { useEffect, useState } from "react";

import {
  Box,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Button,
  Switch,
} from "@mui/material";

import { DataGrid, GridToolbar } from "@mui/x-data-grid";

import type { GridColDef } from "@mui/x-data-grid";

import {
  getNotifications,
  createNotification,
  updateNotificationStatus,
} from "../../services/notificationService";

const categories = ["Parents/Guardians", "Website", "Faculty"];

export default function Notifications() {
  const [notifications, setNotifications] = useState<any[]>([]);

  const initialForm = {
    category: categories[0],
    title: "",
    description: "",
    postedDate: new Date().toISOString().split("T")[0],
  };

  const [form, setForm] = useState(initialForm);

  const [file, setFile] = useState<File | null>(null);

  const fetchNotifications = async () => {
    try {
      const res = await getNotifications();

      setNotifications(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleSubmit = async () => {
    try {
      const data = new FormData();

      data.append("category", form.category);

      data.append("title", form.title);

      data.append("description", form.description);

      data.append("posted_date", form.postedDate);

      if (file) {
        data.append("attachment", file);
      }

      await createNotification(data);

      alert("Notification Posted ✅");

      setForm(initialForm);

      setFile(null);

      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const handleStatusChange = async (id: number, status: boolean) => {
    try {
      await updateNotificationStatus(id, status);

      fetchNotifications();
    } catch (err) {
      console.error(err);
    }
  };

  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      width: 80,
    },

    {
      field: "category",
      headerName: "Category",
      flex: 1,
    },

    {
      field: "title",
      headerName: "Title",
      flex: 1.5,
    },

    {
      field: "posted_date",
      headerName: "Posted Date",
      flex: 1,
    },
    {
      field: "attachment",
      headerName: "Attachment",
      flex: 1,
      sortable: false,
      filterable: false,

      renderCell: (params) => {
        if (!params.row.attachment) {
          return "-";
        }

        return (
          <Button
            size="small"
            variant="outlined"
            color="secondary"
            startIcon={<i className="bi bi-paperclip"></i>}
            onClick={() =>
              window.open(
                `http://localhost:5000/files/${params.row.attachment}`,
                "_blank",
              )
            }
          >
            View
          </Button>
        );
      },
    },

    {
      field: "status",
      headerName: "Status",
      flex: 1,

      renderCell: (params) => (
        <Switch
          checked={Boolean(params.row.status)}
          onChange={(e) => handleStatusChange(params.row.id, e.target.checked)}
        />
      ),
    },
  ];

  return (
    <Box>
      {/* TOP FORM */}
      <Paper
        sx={{
          p: 3,
          borderRadius: 3,
          mb: 3,
        }}
      >
        <div className="row g-3">
          <div className="col-md-3">
            <TextField
              select
              fullWidth
              label="Category"
              value={form.category}
              onChange={(e) =>
                setForm({
                  ...form,
                  category: e.target.value,
                })
              }
              sx={{
                "& .MuiSelect-select": {
                  textAlign: "left",
                },
              }}
            >
              {categories.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>
          </div>

          <div className="col-md-3">
            <TextField
              fullWidth
              label="Title"
              value={form.title}
              onChange={(e) =>
                setForm({
                  ...form,
                  title: e.target.value,
                })
              }
            />
          </div>

          <div className="col-md-3">
            <TextField
              type="date"
              fullWidth
              label="Posted Date"
              InputLabelProps={{
                shrink: true,
              }}
              value={form.postedDate}
              onChange={(e) =>
                setForm({
                  ...form,
                  postedDate: e.target.value,
                })
              }
            />
          </div>

          <div className="col-md-3">
            <TextField
              type="file"
              fullWidth
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e: any) => setFile(e.target.files[0])}
            />
          </div>

          <div className="col-12">
            <TextField
              fullWidth
              multiline
              minRows={4}
              label="Description"
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
            />
          </div>

          <div className="col-12">
            <Button variant="contained" onClick={handleSubmit}>
              Post Notification
            </Button>
          </div>
        </div>
      </Paper>

      {/* GRID */}
      <Paper
        sx={{
          p: 2,
          borderRadius: 3,
        }}
      >
        <Typography variant="h6" mb={2}>
          Notifications List
        </Typography>

        <DataGrid
          rows={notifications}
          columns={columns}
          autoHeight
          pageSizeOptions={[5, 10, 20]}
          initialState={{
            pagination: {
              paginationModel: {
                pageSize: 10,
                page: 0,
              },
            },
          }}
          slots={{
            toolbar: GridToolbar,
          }}
        />
      </Paper>
    </Box>
  );
}
