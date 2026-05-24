import { useEffect, useRef, useState } from "react";

import { Box, Typography, Paper, TextField, Avatar, Chip } from "@mui/material";

import { markRFIDAttendance } from "../../services/attendanceService";

export default function RFIDAttendance() {
  const inputRef = useRef<HTMLInputElement>(null);

  const [rfid, setRFID] = useState("");

  const [student, setStudent] = useState<any>(null);

  const [message, setMessage] = useState("");

  const focusInput = () => {
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  useEffect(() => {
    focusInput();
  }, []);

  const handleRFIDChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    setRFID(value);

    // RFID usually auto enters quickly
    if (value.length >= 8) {
      try {
        const res = await markRFIDAttendance({
          rfid_uid: value,
        });

        setStudent(res.data.student);

        setMessage(res.data.message);

        // clear after 3 sec
        setTimeout(() => {
          setStudent(null);

          setMessage("");

          setRFID("");

          focusInput();
        }, 3000);
      } catch (err: any) {
        console.error(err);

        setStudent(null);

        setMessage(
          err?.response?.data?.message || "Error while marking attendance",
        );

        setTimeout(() => {
          setRFID("");

          setMessage("");

          focusInput();
        }, 3000);
      }
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh",
      }}
    >
      <Paper
        sx={{
          p: 5,
          width: "100%",
          maxWidth: 500,
          borderRadius: 4,
          textAlign: "center",
        }}
      >
        <Typography variant="h5" mb={4} fontWeight={700}>
          RFID Attendance
        </Typography>

        <TextField
          inputRef={inputRef}
          fullWidth
          autoFocus
          label="Scan RFID Card"
          value={rfid}
          onChange={handleRFIDChange}
        />

        {message && (
          <Typography
            mt={3}
            color={
              message.includes("successfully")
                ? "green"
                : message.includes("already")
                  ? "orange"
                  : "red"
            }
            fontWeight={600}
          >
            {message}
          </Typography>
        )}

        {student && (
          <Paper
            sx={{
              mt: 4,
              p: 3,
              borderRadius: 3,
              background: "#f8fafc",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Avatar
                sx={{
                  width: 70,
                  height: 70,
                  fontSize: 28,
                }}
              >
                {student.first_name?.charAt(0)}
              </Avatar>

              <Typography variant="h6">
                {student.first_name} {student.last_name}
              </Typography>

              <Chip label={`Class: ${student.class}`} color="primary" />

              <Chip label="Attendance Marked" color="success" />
            </Box>
          </Paper>
        )}
      </Paper>
    </Box>
  );
}
