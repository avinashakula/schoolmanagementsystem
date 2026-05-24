import {
  Box,
  Typography,
  Paper,
  MenuItem,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";

import { useEffect, useMemo, useState } from "react";

import { getSubjects } from "../../services/subjectService";
import { getFaculty } from "../../services/facultyService";

import {
  getTimetableByClass,
  saveTimetable,
} from "../../services/timetableService";

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

const days = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const periods = [
  {
    period_no: 1,
    start: "09:00",
    end: "09:45",
  },
  {
    period_no: 2,
    start: "09:45",
    end: "10:30",
  },
  {
    period_no: 3,
    start: "10:30",
    end: "11:15",
  },
  {
    period_no: 4,
    start: "11:15",
    end: "12:00",
  },
  {
    period_no: 5,
    start: "01:00",
    end: "01:45",
  },
  {
    period_no: 6,
    start: "01:45",
    end: "02:30",
  },
  {
    period_no: 7,
    start: "02:30",
    end: "03:15",
  },
  {
    period_no: 8,
    start: "03:15",
    end: "04:00",
  },
];

export default function TimeTable() {
  const [selectedClass, setSelectedClass] = useState("1st");

  const [subjects, setSubjects] = useState<any[]>([]);
  const [faculty, setFaculty] = useState<any[]>([]);

  const [timetable, setTimetable] = useState<any[]>([]);

  const [open, setOpen] = useState(false);

  const [selectedCell, setSelectedCell] = useState<any>(null);

  const [form, setForm] = useState({
    subject_id: null,
    faculty_id: null,
  });

  useEffect(() => {
    fetchInitialData();
  }, []);

  useEffect(() => {
    fetchTimetable();
  }, [selectedClass]);

  const fetchInitialData = async () => {
    try {
      const [subjectsRes, facultyRes] = await Promise.all([
        getSubjects(),
        getFaculty(),
      ]);

      setSubjects(subjectsRes.data || []);
      setFaculty(facultyRes.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchTimetable = async () => {
    try {
      const res = await getTimetableByClass(selectedClass);

      setTimetable(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const getSlot = (day: string, periodNo: number) => {
    return timetable.find(
      (item) => item.day_name === day && item.period_no === periodNo,
    );
  };

  const handleOpen = (day: string, period: any, existingData?: any) => {
    setSelectedCell({
      day,
      period,
    });

    setForm({
      subject_id: existingData?.subject_id || null,
      faculty_id: existingData?.faculty_id || null,
    });

    setOpen(true);
  };

  const handleSave = async () => {
    try {
      await saveTimetable({
        class_name: selectedClass,
        day_name: selectedCell.day,
        period_no: selectedCell.period.period_no,
        start_time: selectedCell.period.start,
        end_time: selectedCell.period.end,
        subject_id: form.subject_id,
        faculty_id: form.faculty_id,
      });

      setOpen(false);

      fetchTimetable();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Box>
      {/* HEADER */}
      <Paper
        sx={{
          p: 3,
          mb: 3,
          borderRadius: 4,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box>
            <Typography variant="h5" fontWeight={700}>
              Curriculum Timetable
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Manage faculty & subject schedules
            </Typography>
          </Box>

          <TextField
            select
            label="Select Class"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            sx={{ width: 200 }}
          >
            {classes.map((cls) => (
              <MenuItem key={cls} value={cls}>
                {cls}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Paper>

      {/* TIMETABLE */}
      <Paper
        sx={{
          borderRadius: 4,
          overflow: "auto",
          border: "1px solid #e2e8f0",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: 1200,
          }}
        >
          <thead>
            <tr
              style={{
                background: "#0f172a",
                color: "white",
              }}
            >
              <th
                style={{
                  padding: 16,
                  border: "1px solid #1e293b",
                  minWidth: 140,
                }}
              >
                Period
              </th>

              {days.map((day) => (
                <th
                  key={day}
                  style={{
                    padding: 16,
                    border: "1px solid #1e293b",
                    minWidth: 180,
                  }}
                >
                  {day}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {periods.map((period) => (
              <tr key={period.period_no}>
                {/* PERIOD */}
                <td
                  style={{
                    padding: 14,
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    fontWeight: 600,
                    verticalAlign: "top",
                  }}
                >
                  <div>Period {period.period_no}</div>

                  <div
                    style={{
                      fontSize: 12,
                      color: "#64748b",
                      marginTop: 4,
                    }}
                  >
                    {period.start} - {period.end}
                  </div>
                </td>

                {/* DAYS */}
                {days.map((day) => {
                  const slot = getSlot(day, period.period_no);

                  return (
                    <td
                      key={day}
                      onClick={() => handleOpen(day, period, slot)}
                      style={{
                        padding: 12,
                        border: "1px solid #e2e8f0",
                        cursor: "pointer",
                        transition: "0.2s",
                        background: slot
                          ? "linear-gradient(to bottom right,#eff6ff,#dbeafe)"
                          : "white",
                        height: 110,
                        verticalAlign: "top",
                      }}
                    >
                      {slot ? (
                        <>
                          <div
                            style={{
                              fontWeight: 700,
                              fontSize: 15,
                              color: "#1e40af",
                            }}
                          >
                            {slot.subject_name}
                          </div>

                          <div
                            style={{
                              marginTop: 10,
                              display: "inline-block",
                              padding: "4px 10px",
                              borderRadius: 20,
                              background: "#dbeafe",
                              color: "#1d4ed8",
                              fontSize: 12,
                              fontWeight: 600,
                            }}
                          >
                            {slot.faculty_name}
                          </div>
                        </>
                      ) : (
                        <div
                          style={{
                            color: "#94a3b8",
                            fontSize: 13,
                            textAlign: "center",
                            marginTop: 30,
                          }}
                        >
                          + Add Schedule
                        </div>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </Paper>

      {/* DIALOG */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {selectedCell?.day} - Period {selectedCell?.period?.period_no}
        </DialogTitle>

        <DialogContent>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              mt: 1,
            }}
          >
            {/* SUBJECT */}
            <TextField
              select
              fullWidth
              label="Subject"
              value={form.subject_id}
              onChange={(e) =>
                setForm({
                  ...form,
                  subject_id: Number(e.target.value),
                })
              }
            >
              {subjects.map((sub) => (
                <MenuItem key={sub.id} value={sub.id}>
                  {sub.subject_name}
                </MenuItem>
              ))}
            </TextField>

            {/* FACULTY */}
            <TextField
              select
              fullWidth
              label="Faculty"
              value={form.faculty_id}
              onChange={(e) =>
                setForm({
                  ...form,
                  faculty_id: Number(e.target.value),
                })
              }
            >
              {faculty.map((f) => (
                <MenuItem key={f.id} value={f.id}>
                  {f.first_name} {f.last_name}
                </MenuItem>
              ))}
            </TextField>
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>

          <Button variant="contained" onClick={handleSave}>
            Save Timetable
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
