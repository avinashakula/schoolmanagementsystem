import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Checkbox,
  Button,
  Grid,
  Chip,
} from "@mui/material";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

import {
  getStudentsByClass,
  saveAttendance,
  getAttendance,
} from "../../services/attendanceService";

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

export default function Attendance() {
  const [selectedClass, setSelectedClass] = useState("Nursery"); // ✅ default
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [students, setStudents] = useState<any[]>([]);
  const [showChart, setShowChart] = useState(true);

  const [summary, setSummary] = useState({
    total: 0,
    present: 0,
    absent: 0,
  });

  const updateSummary = (data: any[]) => {
    const total = data.length;

    const present = data.filter((s) => s.checked).length;

    const absent = total - present;

    setSummary({
      total,
      present,
      absent,
    });
  };
  const loadData = async () => {
    try {
      // 1️⃣ Check attendance first
      const res = await getAttendance(selectedClass, date);

      if (res.data.length > 0) {
        const updated = res.data.map((s: any) => ({
          ...s,
          checked: s.status === "Present",
        }));

        setStudents(updated);

        updateSummary(updated);
      } else {
        // 2️⃣ Load fresh students
        const stuRes = await getStudentsByClass(selectedClass);

        const updated = stuRes.data.map((s: any) => ({
          ...s,
          checked: false, // 🔥 initially no attendance marked
        }));

        setStudents(updated);

        setSummary({
          total: updated.length,
          present: 0,
          absent: 0,
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ Auto load on page open + filter change
  useEffect(() => {
    loadData();
  }, [selectedClass, date]);

  const handleCheck = (index: number) => {
    const updated = [...students];

    updated[index].checked = !updated[index].checked;

    setStudents(updated);

    updateSummary(updated);
  };

  const handleSave = async () => {
    const attendanceList = students.map((s) => ({
      student_id: s.id || s.student_id,
      class: selectedClass,
      date,
      status: s.checked ? "Present" : "Absent",
    }));

    try {
      await saveAttendance({ attendanceList });
      alert("Attendance Saved / Updated ✅");
    } catch (err) {
      console.error(err);
    }
  };

  const chartData = [
    {
      name: "Present",
      value: summary.present,
    },
    {
      name: "Absent",
      value: summary.absent,
    },
  ];

  const COLORS = ["#22c55e", "#ef4444"];
  return (
    <Box>
      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 3 }}>
        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              select
              label="Class"
              fullWidth
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              {classes.map((c) => (
                <MenuItem key={c} value={c}>
                  {c}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid item xs={6}>
            <TextField
              type="date"
              label="Date"
              fullWidth
              value={date}
              onChange={(e) => setDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />
          </Grid>
        </Grid>
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            mt: 3,
          }}
        >
          <Chip label={`Total Students: ${summary.total}`} color="primary" />

          <Chip label={`Present: ${summary.present}`} color="success" />

          <Chip label={`Absent: ${summary.absent}`} color="error" />

          <Button
            variant="outlined"
            size="small"
            onClick={() => setShowChart(!showChart)}
          >
            {showChart ? "Hide Chart" : "Show Chart"}
          </Button>
        </Box>
      </Paper>

      {/* Attendance Chart */}
      {showChart && (
        <Paper
          sx={{
            p: 3,
            mb: 3,
            borderRadius: 3,
          }}
        >
          <Typography variant="h6" mb={2}>
            Attendance Summary
          </Typography>

          <Box
            sx={{
              width: "100%",
              height: 320,
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={110}
                  label
                >
                  {chartData.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>

                <Tooltip />

                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Box>
        </Paper>
      )}

      {/* Students Grid */}
      <Paper sx={{ p: 2, borderRadius: 3 }}>
        {students.length === 0 && <Typography>No students found</Typography>}

        {students.map((s, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              borderBottom: "1px solid #eee",
              py: 1,
            }}
          >
            <Typography>
              {s.first_name} {s.last_name} ({selectedClass})
            </Typography>

            <Checkbox checked={s.checked} onChange={() => handleCheck(index)} />
          </Box>
        ))}

        {students.length > 0 && (
          <Button variant="contained" sx={{ mt: 2 }} onClick={handleSave}>
            Save Attendance
          </Button>
        )}
      </Paper>
    </Box>
  );
}
