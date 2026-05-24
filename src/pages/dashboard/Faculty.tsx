import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  MenuItem,
} from "@mui/material";

import { createFaculty, getFaculty } from "../../services/facultyService";
import { getSubjects, createSubject } from "../../services/subjectService";

export default function Faculty() {
  const [facultyList, setFacultyList] = useState<any[]>([]);
  const [subjects, setSubjects] = useState<any[]>([]);
  const [newSubject, setNewSubject] = useState("");
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    subject: "",
    contact: "",
    email: "",
    qualification: "",
    experience: "",
    joiningDate: new Date().toISOString().split("T")[0],
    salary: "",
  });

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const fetchFaculty = async () => {
    const res = await getFaculty();
    setFacultyList(res.data);
  };

  const fetchSubjects = async () => {
    try {
      const res = await getSubjects();

      setSubjects(res.data);

      // ✅ auto select first subject
      if (res.data.length > 0) {
        setForm((prev) => ({
          ...prev,
          subject: res.data[0].subject_name,
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };
  useEffect(() => {
    fetchFaculty();
    fetchSubjects();
  }, []);

  const handleSubmit = async () => {
    try {
      await createFaculty(form);
      alert("Faculty Created");

      fetchFaculty(); // refresh
    } catch (err) {
      console.error(err);
      alert("Error");
    }
  };

  const handleAddSubject = async () => {
    if (!newSubject.trim()) return;

    try {
      await createSubject({
        subject_name: newSubject,
      });

      alert("Subject Added");

      setNewSubject("");

      fetchSubjects();
    } catch (err: any) {
      console.error(err);

      alert(err?.response?.data?.message || "Error adding subject");
    }
  };
  return (
    <Box>
      {/* ADD SUBJECT */}
      <div className="row g-3 mb-3 justify-content-end">
        <div className="col-12 col-sm-6 col-md-4 col-lg-3">
          <Box
            sx={{
              display: "flex",
              gap: 1,
              mt: 1,
            }}
          >
            <TextField
              label="New Subject"
              size="small"
              fullWidth
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
            />

            <Button variant="contained" onClick={handleAddSubject}>
              Add
            </Button>
          </Box>
        </div>
      </div>
      {/* FORM */}
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <div className="row g-3">
          <div className="col-12 col-sm-6 col-md-3">
            <TextField
              label="First Name"
              name="firstName"
              fullWidth
              onChange={handleChange}
            />
          </div>

          <div className="col-12 col-sm-6 col-md-3">
            <TextField
              label="Last Name"
              name="lastName"
              fullWidth
              onChange={handleChange}
            />
          </div>

          <div className="col-12 col-sm-6 col-md-3">
            <TextField
              select
              label="Subject"
              name="subject"
              fullWidth
              value={form.subject}
              onChange={handleChange}
              sx={{
                "& .MuiSelect-select": {
                  textAlign: "left",
                },
              }}
            >
              {subjects.map((sub: any) => (
                <MenuItem
                  key={sub.id}
                  value={sub.subject_name}
                  sx={{
                    justifyContent: "flex-start",
                  }}
                >
                  {sub.subject_name}
                </MenuItem>
              ))}
            </TextField>
          </div>

          <div className="col-12 col-sm-6 col-md-3">
            <TextField
              label="Contact"
              name="contact"
              fullWidth
              onChange={handleChange}
            />
          </div>

          <div className="col-12 col-sm-6 col-md-3">
            <TextField
              label="Email"
              name="email"
              fullWidth
              onChange={handleChange}
            />
          </div>

          <div className="col-12 col-sm-6 col-md-3">
            <TextField
              label="Qualification"
              name="qualification"
              fullWidth
              onChange={handleChange}
            />
          </div>

          <div className="col-12 col-sm-6 col-md-3">
            <TextField
              label="Experience (years)"
              name="experience"
              fullWidth
              onChange={handleChange}
            />
          </div>

          <div className="col-12 col-sm-6 col-md-3">
            <TextField
              type="date"
              label="Joining Date"
              name="joiningDate"
              value={form.joiningDate}
              onChange={handleChange}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
          </div>

          <div className="col-12 col-sm-6 col-md-3">
            <TextField
              label="Salary"
              name="salary"
              fullWidth
              onChange={handleChange}
            />
          </div>

          <div
            className="col-12"
            style={{ display: "flex", alignItems: "center" }}
          >
            <Button variant="contained" onClick={handleSubmit}>
              Create Faculty
            </Button>
          </div>
        </div>
      </Paper>

      {/* TABLE */}
      <Paper sx={{ mt: 4, p: 2, borderRadius: 3 }}>
        <Typography variant="h6" mb={2}>
          Faculty List
        </Typography>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Name</TableCell>
              <TableCell>Subject</TableCell>
              <TableCell>Contact</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Experience</TableCell>
              <TableCell>Salary</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {facultyList.map((f: any) => (
              <TableRow key={f.id}>
                <TableCell>{f.id}</TableCell>
                <TableCell>
                  {f.first_name} {f.last_name}
                </TableCell>
                <TableCell>{f.subject}</TableCell>
                <TableCell>{f.contact}</TableCell>
                <TableCell>{f.email}</TableCell>
                <TableCell>{f.experience}</TableCell>
                <TableCell>{f.salary}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}
