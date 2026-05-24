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
  Dialog,
} from "@mui/material";

import {
  getTransportByClass,
  saveTransport,
} from "../../services/transportService";
import { getBuses, createBus } from "../../services/busService";
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

export default function Transport() {
  const [selectedClass, setSelectedClass] = useState("Nursery");
  const [students, setStudents] = useState<any[]>([]);
  const [buses, setBuses] = useState<any[]>([]);
  const [openBusDialog, setOpenBusDialog] = useState(false);
  const [busForm, setBusForm] = useState({
    bus_name: "",
    bus_code: "",
    description: "",
  });

  const [pendingChange, setPendingChange] = useState<any>(null);
  const loadData = async () => {
    try {
      const res = await getTransportByClass(selectedClass);

      const formatted = res.data.map((s: any) => ({
        ...s,
        checked: s.is_transport === 1 || s.is_transport === true,
        bus_id: s.bus_id || "",
        bus_label:
          s.bus_code && s.bus_name ? `${s.bus_code} - ${s.bus_name}` : "",
      }));

      setStudents(formatted);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadData();
    loadBuses();
  }, [selectedClass]);

  const loadBuses = async () => {
    const res = await getBuses();
    setBuses(res.data);
  };
  const handleCheck = (index: number) => {
    const updated = [...students];
    updated[index].checked = !updated[index].checked;

    if (!updated[index].checked) {
      updated[index].bus_name = "";
    }

    setStudents(updated);
  };

  const handleBusChange = (index: number, busId: string) => {
    const selectedBus = buses.find((b) => String(b.id) === String(busId));

    if (!selectedBus) return;

    setPendingChange({
      index,
      bus: selectedBus,
    });
  };

  const handleSave = async () => {
    const transportList = students.map((s) => ({
      student_id: s.id,
      class: selectedClass,
      bus_id: s.checked ? s.bus_id : null,
      is_transport: s.checked,
    }));

    try {
      await saveTransport({ transportList });
      alert("Transport Saved ✅");
    } catch (err) {
      console.error(err);
    }
  };
  const getBusLabel = (bus) => `${bus.bus_code} - ${bus.bus_name}`;
  return (
    <Box>
      <div className="row g-3 mb-3 justify-content-end">
        <div
          className="col-12 col-sm-6 col-md-4 col-lg-3"
          style={{ textAlign: "right" }}
        >
          <Button variant="contained" onClick={() => setOpenBusDialog(true)}>
            + Add Bus
          </Button>
        </div>
      </div>
      {/* Filter */}
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
        </Grid>
      </Paper>
      {/* Grid */}
      <Paper sx={{ p: 2, borderRadius: 3 }}>
        {students.map((s, index) => (
          <Box
            key={index}
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 2fr 2fr 2fr 1fr",
              gap: 10,
              alignItems: "center",
              borderBottom: "1px solid #eee",
              py: 1,
            }}
          >
            <Typography>{s.id}</Typography>

            <Typography>
              {s.first_name} {s.last_name}
            </Typography>

            <Typography>{s.address}</Typography>

            {/* Bus Dropdown */}
            <TextField
              select
              fullWidth
              disabled={!s.checked}
              value={s.bus_id || ""}
              onChange={(e) => handleBusChange(index, e.target.value)}
              sx={{
                "& .MuiSelect-select": {
                  textAlign: "left",
                },
              }}
            >
              {buses.map((bus) => (
                <MenuItem key={bus.id} value={bus.id}>
                  {bus.bus_code} - {bus.bus_name}
                </MenuItem>
              ))}
            </TextField>

            {/* Checkbox */}
            <Checkbox checked={s.checked} onChange={() => handleCheck(index)} />
          </Box>
        ))}

        {students.length > 0 && (
          <Button variant="contained" sx={{ mt: 2 }} onClick={handleSave}>
            Save Transport
          </Button>
        )}

        <Dialog open={openBusDialog} onClose={() => setOpenBusDialog(false)}>
          <Box sx={{ p: 3, width: 400 }}>
            <Typography variant="h6">Add Bus</Typography>

            <TextField
              fullWidth
              label="Bus Name"
              sx={{ mt: 2 }}
              value={busForm.bus_name}
              onChange={(e) =>
                setBusForm({ ...busForm, bus_name: e.target.value })
              }
            />

            <TextField
              fullWidth
              label="Bus Code"
              sx={{ mt: 2 }}
              value={busForm.bus_code}
              onChange={(e) =>
                setBusForm({ ...busForm, bus_code: e.target.value })
              }
            />

            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              sx={{ mt: 2 }}
              value={busForm.description}
              onChange={(e) =>
                setBusForm({ ...busForm, description: e.target.value })
              }
            />

            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={async () => {
                await createBus(busForm);
                setOpenBusDialog(false);
                setBusForm({ bus_name: "", bus_code: "", description: "" });
                loadBuses();
              }}
            >
              Save
            </Button>
          </Box>
        </Dialog>

        <Dialog
          open={!!pendingChange?.bus}
          onClose={() => setPendingChange(null)}
        >
          <Box sx={{ p: 3, width: 400 }}>
            <Typography variant="h6">Confirm Bus Change</Typography>

            <Typography>
              <b>Bus:</b> {pendingChange?.bus?.bus_name || "-"}
            </Typography>

            <Typography>
              <b>Code:</b> {pendingChange?.bus?.bus_code || "-"}
            </Typography>

            <Typography sx={{ mt: 1 }}>
              {pendingChange?.bus?.description || "No description available"}
            </Typography>

            <Box mt={3} display="flex" gap={2}>
              <Button onClick={() => setPendingChange(null)}>Cancel</Button>

              <Button
                variant="contained"
                onClick={() => {
                  const updated = [...students];

                  updated[pendingChange.index].bus_id = pendingChange.bus.id;

                  updated[pendingChange.index].bus_name =
                    pendingChange.bus.bus_name;

                  updated[pendingChange.index].checked = true;

                  setStudents(updated);
                  setPendingChange(null);
                }}
              >
                Confirm
              </Button>
            </Box>
          </Box>
        </Dialog>
      </Paper>
    </Box>
  );
}
