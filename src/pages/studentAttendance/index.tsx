import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

import {
  Box,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Autocomplete,
} from "@mui/material";

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";

import { getStudentAttendanceReport } from "../../services/attendanceService";

import { getStudents } from "../../services/studentService";

const COLORS = ["#10b981", "#ef4444"];

const classes = [
  "Nursery",
  "LKG",
  "UKG",
  "1st",
  "2nd",
  "3rd",
  "4th",
  "5th",
  "6th",
  "7th",
  "8th",
  "9th",
  "10th",
];

export default function StudentAttendance() {
  const location = useLocation();

  const selectedStudent = location.state?.student;

  const today = new Date();

  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1)
    .toISOString()
    .split("T")[0];

  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0)
    .toISOString()
    .split("T")[0];

  const [students, setStudents] = useState<any[]>([]);

  const [filters, setFilters] = useState({
    className: selectedStudent?.class || "Nursery",
    studentId: selectedStudent?.id || "",
    fromDate: firstDay,
    toDate: lastDay,
  });

  const [report, setReport] = useState({
    total: 0,
    present: 0,
    absent: 0,
  });

  const fetchStudents = async () => {
    try {
      const res = await getStudents();

      const filteredStudents = res.data.filter(
        (s: any) => s.class === filters.className,
      );

      setStudents(filteredStudents);

      // auto select first student
      if (filteredStudents.length > 0) {
        setFilters((prev) => ({
          ...prev,
          studentId:
            prev.studentId &&
            filteredStudents.some((x: any) => x.id === prev.studentId)
              ? prev.studentId
              : filteredStudents[0].id,
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchReport = async () => {
    try {
      const res = await getStudentAttendanceReport(filters);

      setReport({
        total: Number(res.data.total || 0),
        present: Number(res.data.present || 0),
        absent: Number(res.data.absent || 0),
      });
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [filters.className]);

  useEffect(() => {
    fetchReport();
  }, [filters]);

  const chartData = [
    {
      name: "Present",
      value: Number(report.present),
    },
    {
      name: "Absent",
      value: Number(report.absent),
    },
  ].filter((x) => x.value > 0);

  return (
    <Box>
      {/* FILTERS */}
      <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
        <div className="row g-3">
          <div className="col-12 col-md-3">
            <TextField
              select
              fullWidth
              label="Class"
              value={filters.className}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  className: e.target.value,
                  studentId: "",
                })
              }
            >
              {classes.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>
          </div>

          <div className="col-12 col-md-3">
            <Autocomplete
              options={students}
              getOptionLabel={(option: any) =>
                `${option.first_name} ${option.last_name}`
              }
              value={
                students.find((s: any) => s.id === filters.studentId) || null
              }
              onChange={(event, newValue: any) => {
                setFilters({
                  ...filters,
                  studentId: newValue?.id || "",
                });
              }}
              renderInput={(params) => (
                <TextField {...params} label="Student" fullWidth />
              )}
            />
          </div>

          <div className="col-12 col-md-3">
            <TextField
              type="date"
              fullWidth
              label="From Date"
              InputLabelProps={{ shrink: true }}
              value={filters.fromDate}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  fromDate: e.target.value,
                })
              }
            />
          </div>

          <div className="col-12 col-md-3">
            <TextField
              type="date"
              fullWidth
              label="To Date"
              InputLabelProps={{ shrink: true }}
              value={filters.toDate}
              onChange={(e) =>
                setFilters({
                  ...filters,
                  toDate: e.target.value,
                })
              }
            />
          </div>
        </div>
      </Paper>
      {/* CHART */}
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <div className="row">
          {/* PIE CHART */}
          <div className="col-12 col-md-6">
            <Box sx={{ height: 350 }}>
              {chartData.length === 0 ? (
                <Box
                  sx={{
                    height: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography color="text.secondary">
                    No attendance data available
                  </Typography>
                </Box>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={120}
                      innerRadius={70}
                      paddingAngle={5}
                      label
                    >
                      {chartData.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index]} />
                      ))}
                    </Pie>

                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </Box>
            {/* </Box> */}
          </div>

          {/* SUMMARY */}
          <div className="col-12 col-md-6">
            <Box
              sx={{
                height: "100%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                gap: 3,
              }}
            >
              <Paper
                sx={{
                  p: 2,
                  borderRadius: 3,
                  background: "#ecfdf5",
                }}
              >
                <Typography variant="h6">Present Days</Typography>

                <Typography variant="h3" color="green">
                  {report.present}
                </Typography>
              </Paper>

              <Paper
                sx={{
                  p: 2,
                  borderRadius: 3,
                  background: "#fef2f2",
                }}
              >
                <Typography variant="h6">Absent Days</Typography>

                <Typography variant="h3" color="red">
                  {report.absent}
                </Typography>
              </Paper>

              <Paper
                sx={{
                  p: 2,
                  borderRadius: 3,
                  background: "#eff6ff",
                }}
              >
                <Typography variant="h6">Total Attendance Days</Typography>

                <Typography variant="h3" color="primary">
                  {report.total}
                </Typography>
              </Paper>
            </Box>
          </div>
        </div>
      </Paper>
    </Box>
  );
}
