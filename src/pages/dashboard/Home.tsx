import { Box, Typography, Paper } from "@mui/material";
import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

import { getStudentClassWiseCount } from "../../services/studentService";
import { getFacultySubjectWiseCount } from "../../services/subjectService";
import { getBusOccupancy } from "../../services/busService";
// 🎯 Dummy Data

const managementData = [
  { name: "Senior", value: 5 },
  { name: "Mid-Level", value: 8 },
  { name: "Junior", value: 12 },
];

// const busData = [
//   { bus: "Bus 1", occupied: 35 },
//   { bus: "Bus 2", occupied: 40 },
//   { bus: "Bus 3", occupied: 28 },
//   { bus: "Bus 4", occupied: 45 },
//   { bus: "Bus 5", occupied: 38 },
//   { bus: "Bus 6", occupied: 30 },
//   { bus: "Bus 7", occupied: 42 },
//   { bus: "Bus 8", occupied: 25 },
//   { bus: "Bus 9", occupied: 48 },
//   { bus: "Bus 10", occupied: 33 },
// ];

const COLORS = ["#3b82f6", "#10b981", "#f59e0b"];

export default function Home() {
  const [studentsData, setStudentsData] = useState<any[]>([]);
  const [facultyData, setFacultyData] = useState<any[]>([]);
  const [busData, setBusData] = useState<any[]>([]);
  useEffect(() => {
    fetchStudentChart();
  }, []);

  const fetchBusData = async () => {
    try {
      const res = await getBusOccupancy();
      setBusData(res.data);
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchFacultyChart();
    fetchBusData();
  }, []);

  const fetchFacultyChart = async () => {
    try {
      const res = await getFacultySubjectWiseCount();
      setFacultyData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchStudentChart = async () => {
    try {
      const res = await getStudentClassWiseCount();
      setStudentsData(res.data);
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <div className="container-fluid">
      <div className="row g-3">
        {/* STUDENTS */}
        <div className="col-12 d-flex">
          <Paper
            sx={{
              p: 3,
              width: "100%",
              height: 420,
              display: "flex",
              flexDirection: "column",
              borderRadius: 4,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: "1px solid #f1f5f9",
              background: "linear-gradient(to bottom right, #ffffff, #f8fafc)",
            }}
          >
            {/* HEADER */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  Students Class-wise
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Total students distributed by class
                </Typography>
              </Box>

              <Box
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 10,
                  backgroundColor: "#eff6ff",
                  color: "#2563eb",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {studentsData.length} Classes
              </Box>
            </Box>

            {/* CHART */}
            <Box sx={{ flexGrow: 1 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={studentsData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 40,
                  }}
                >
                  <XAxis
                    dataKey="class"
                    interval={0}
                    angle={-15}
                    textAnchor="end"
                    tick={{
                      fontSize: 11,
                    }}
                    height={50}
                  />

                  <YAxis allowDecimals={false} />

                  <Tooltip
                    cursor={{ fill: "#f8fafc" }}
                    contentStyle={{
                      borderRadius: 12,
                      border: "none",
                      boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
                    }}
                    formatter={(value: any) => [
                      `${value} Students`,
                      "Students",
                    ]}
                  />

                  <Bar
                    dataKey="students"
                    fill="#3b82f6"
                    radius={[8, 8, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>

            {/* FOOTER */}
            <Box
              sx={{
                mt: 1,
                textAlign: "center",
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Student strength across all classes
              </Typography>
            </Box>
          </Paper>
        </div>

        {/* FACULTY */}
        <div className="col-12 col-md-6 col-xl-4 d-flex">
          <Paper
            sx={{
              p: 3,
              width: "100%",
              height: 420,
              display: "flex",
              flexDirection: "column",
              borderRadius: 4,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: "1px solid #f1f5f9",
              background: "linear-gradient(to bottom right, #ffffff, #f8fafc)",
            }}
          >
            {/* HEADER */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  Faculty Subject-wise
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Teachers allocated per subject
                </Typography>
              </Box>

              <Box
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 10,
                  backgroundColor: "#ecfdf5",
                  color: "#047857",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {facultyData.length} Subjects
              </Box>
            </Box>

            {/* CHART */}
            <Box sx={{ flexGrow: 1 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={facultyData}
                  margin={{
                    top: 10,
                    right: 10,
                    left: 0,
                    bottom: 50,
                  }}
                >
                  <XAxis
                    dataKey="subject"
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                    tick={{
                      fontSize: 11,
                    }}
                    height={60}
                  />

                  <YAxis allowDecimals={false} />

                  <Tooltip
                    cursor={{ fill: "#f8fafc" }}
                    contentStyle={{
                      borderRadius: 12,
                      border: "none",
                      boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
                    }}
                    formatter={(value: any) => [`${value} Faculty`, "Count"]}
                  />

                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {facultyData.map((entry, index) => (
                      <Cell
                        key={index}
                        fill={index % 2 === 0 ? "#10b981" : "#34d399"}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>

            {/* FOOTER */}
            <Box
              sx={{
                mt: 1,
                textAlign: "center",
              }}
            >
              <Typography variant="caption" color="text.secondary">
                Faculty distribution across subjects
              </Typography>
            </Box>
          </Paper>
        </div>

        {/* MANAGEMENT */}
        <div className="col-12 col-md-6 col-xl-4 d-flex">
          <Paper
            sx={{
              p: 3,
              width: "100%",
              height: 420,
              display: "flex",
              flexDirection: "column",
              borderRadius: 3,
              boxShadow: 3,
            }}
          >
            <Typography variant="h6" mb={2}>
              Management Level-wise
            </Typography>

            <Box sx={{ flexGrow: 1 }}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={managementData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {managementData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </Box>
          </Paper>
        </div>

        {/* BUS */}
        <div className="col-12 col-md-6 col-xl-4 d-flex">
          <Paper
            sx={{
              p: 3,
              width: "100%",
              height: 420,
              display: "flex",
              flexDirection: "column",
              borderRadius: 4,
              boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
              border: "1px solid #f1f5f9",
              background: "linear-gradient(to bottom right, #ffffff, #f8fafc)",
            }}
          >
            {/* HEADER */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Box>
                <Typography variant="h6" fontWeight={700}>
                  Bus Occupancy
                </Typography>

                <Typography variant="body2" color="text.secondary">
                  Students using transport service
                </Typography>
              </Box>

              <Box
                sx={{
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 10,
                  backgroundColor: "#fff7ed",
                  color: "#ea580c",
                  fontSize: 12,
                  fontWeight: 700,
                }}
              >
                {busData.length} Buses
              </Box>
            </Box>

            {/* CHART */}
            <Box sx={{ flexGrow: 1 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={busData.map((b) => ({
                    ...b,
                    available_seats:
                      Number(b.total_seats) - Number(b.occupied_seats),
                    occupancy_percent: Math.round(
                      (Number(b.occupied_seats) / Number(b.total_seats || 1)) *
                        100,
                    ),
                  }))}
                  barGap={4}
                >
                  <XAxis
                    dataKey="bus_name"
                    tick={{
                      fontSize: 11,
                    }}
                    angle={-15}
                    textAnchor="end"
                    interval={0}
                  />

                  <YAxis />

                  <Tooltip
                    contentStyle={{
                      borderRadius: 12,
                      border: "none",
                      boxShadow: "0 6px 20px rgba(0,0,0,0.12)",
                    }}
                    formatter={(value: any, name: any, props: any) => {
                      if (name === "occupied_seats") {
                        return [
                          `${value} Students`,
                          `Occupied (${props.payload.occupancy_percent}%)`,
                        ];
                      }

                      if (name === "available_seats") {
                        return [`${value} Seats`, "Available"];
                      }

                      return [value, name];
                    }}
                  />

                  {/* AVAILABLE */}
                  <Bar
                    dataKey="available_seats"
                    stackId="a"
                    fill="#e2e8f0"
                    radius={[0, 0, 6, 6]}
                  />

                  {/* OCCUPIED */}
                  <Bar
                    dataKey="occupied_seats"
                    stackId="a"
                    fill="#f59e0b"
                    radius={[6, 6, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </Box>

            {/* FOOTER LEGEND */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: 3,
                mt: 1,
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: "#f59e0b",
                  }}
                />
                <Typography fontSize={13}>Occupied</Typography>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box
                  sx={{
                    width: 12,
                    height: 12,
                    borderRadius: "50%",
                    backgroundColor: "#e2e8f0",
                  }}
                />
                <Typography fontSize={13}>Available</Typography>
              </Box>
            </Box>
          </Paper>
        </div>
      </div>
    </div>
  );
}
