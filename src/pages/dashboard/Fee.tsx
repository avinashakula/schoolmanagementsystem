import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  MenuItem,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Paper,
} from "@mui/material";
import { getFees, saveFees } from "../../services/feeService";

const classesList = [
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

const Fees = () => {
  const currentYear = new Date().getFullYear();
  const [year, setYear] = useState<number>(currentYear);
  const [fees, setFees] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // 🔹 Fetch Fees
  const fetchFees = async (selectedYear: number) => {
    try {
      setLoading(true);
      const res = await getFees(selectedYear);

      const dbData = res.data;

      const mapped = classesList.map((cls) => {
        const found = dbData.find((f: any) => f.class === cls);

        return {
          class: cls,
          year: selectedYear,
          default_fee: found?.default_fee || "",
          admission_fee: found?.admission_fee || "",
        };
      });

      setFees(mapped);
    } catch (err) {
      console.error("Error fetching fees", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFees(year);
  }, [year]);

  // 🔹 Handle Change
  const handleChange = (index: number, field: string, value: any) => {
    const updated = [...fees];
    updated[index][field] = value;
    setFees(updated);
  };

  // 🔹 Save
  const handleSave = async () => {
    try {
      await saveFees({ data: fees });
      alert("Fee structure saved successfully");
    } catch (err) {
      console.error("Error saving fees", err);
      alert("Error saving fees");
    }
  };

  return (
    <Box p={3}>
      {/* 🔹 Filters */}
      <Paper sx={{ p: 2, borderRadius: 3, mb: 3, textAlign: "left" }}>
        <Box mb={2}>
          <TextField
            select
            label="Year"
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            sx={{ width: 150 }}
          >
            {[2026, 2025, 2024, 2023].map((yr) => (
              <MenuItem key={yr} value={yr}>
                {yr}
              </MenuItem>
            ))}
          </TextField>
        </Box>
      </Paper>

      {/* 🔹 Table */}
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <b>Class</b>
              </TableCell>
              <TableCell>
                <b>Default Fee</b>
              </TableCell>
              <TableCell>
                <b>Admission Fee</b>
              </TableCell>
              <TableCell>
                <b>Year</b>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {fees.map((row, i) => (
              <TableRow key={row.class}>
                <TableCell>{row.class}</TableCell>

                <TableCell>
                  <TextField
                    value={row.default_fee}
                    type="number"
                    size="small"
                    onChange={(e) =>
                      handleChange(i, "default_fee", e.target.value)
                    }
                  />
                </TableCell>

                <TableCell>
                  <TextField
                    value={row.admission_fee}
                    type="number"
                    size="small"
                    onChange={(e) =>
                      handleChange(i, "admission_fee", e.target.value)
                    }
                  />
                </TableCell>

                <TableCell>{row.year}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

      {/* 🔹 Save Button */}
      <div className="row g-3 mb-3 pt-3 justify-content-end">
        <div
          className="col-12 col-sm-6 col-md-4 col-lg-3"
          style={{ textAlign: "right" }}
        >
          <Button variant="contained" onClick={handleSave} disabled={loading}>
            Save Fee Structure
          </Button>
        </div>
      </div>
    </Box>
  );
};

export default Fees;
