import { useEffect, useState } from "react";
import {
  getStudents,
  createStudent,
  updateStudent,
} from "../../services/studentService";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  MenuItem,
  Dialog,
} from "@mui/material";
import {
  addPayment,
  getFeeByClass,
  getPayments,
  getPaymentSummary,
} from "../../services/feeService";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import type { GridColDef } from "@mui/x-data-grid";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import { useNavigate } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

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

const paymentTypes = ["Monthly", "Quarterly", "Yearly"];

export default function Students() {
  const [students, setStudents] = useState<any[]>([]);

  const [editMode, setEditMode] = useState(false);
  const [viewMode, setViewMode] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [useDefaultFee, setUseDefaultFee] = useState(false);
  const navigate = useNavigate();
  const initialForm = {
    firstName: "",
    lastName: "",
    fatherName: "",
    motherName: "",
    guardianName: "",
    contact: "",
    email: "",
    area: "",
    city: "",
    address: "",
    pincode: "",
    joiningDate: new Date().toISOString().split("T")[0],
    studentClass: classes[0],
    fee: "",
    paymentType: paymentTypes[0],
    aadhar: "",
    status: "Active",
    inactiveReason: "",
  };
  const [form, setForm] = useState(initialForm);

  const [openFeeDialog, setOpenFeeDialog] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [payments, setPayments] = useState<any[]>([]);
  const [feeSummary, setFeeSummary] = useState({
    total_fee: 0,
    paid_fee: 0,
    pending_fee: 0,
  });
  const [feeForm, setFeeForm] = useState({
    amount: "",
    mode: "Cash",
    description: "",
    type: "Fee",
  });

  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    // ✅ If class changed and checkbox ON → fetch fee
    if (name === "studentClass" && useDefaultFee) {
      fetchDefaultFee(value);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await getStudents();
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // ✅ EDIT
  const handleEdit = (stu: any) => {
    setEditMode(true);
    setViewMode(false);
    setSelectedId(stu.id);
    setUseDefaultFee(false);

    setForm({
      firstName: stu.first_name || "",
      lastName: stu.last_name || "",
      fatherName: stu.father_name || "",
      motherName: stu.mother_name || "",
      guardianName: stu.guardian_name || "",
      contact: stu.contact || "",
      email: stu.email || "",
      area: stu.area || "",
      city: stu.city || "",
      address: stu.address || "",
      pincode: stu.pincode || "",
      joiningDate: stu.joining_date?.split("T")[0],
      studentClass: stu.class || "",
      fee: stu.fee || "",
      paymentType: stu.payment_type || "",
      aadhar: stu.aadhar || "",
      status: stu.status || "Active",
      inactiveReason: stu.inactive_reason || "",
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // ✅ VIEW
  const handleView = (stu: any) => {
    handleEdit(stu);
    setViewMode(true);
  };

  // ✅ SUBMIT (CREATE / UPDATE)
  const handleSubmit = async () => {
    try {
      const payload = {
        first_name: form.firstName,
        last_name: form.lastName,
        father_name: form.fatherName,
        mother_name: form.motherName,
        guardian_name: form.guardianName,
        contact: form.contact,
        email: form.email,
        area: form.area,
        city: form.city,
        address: form.address,
        pincode: form.pincode,
        joining_date: form.joiningDate,
        class: form.studentClass,
        fee: form.fee,
        payment_type: form.paymentType,
        aadhar: form.aadhar, // ✅ FIXED
        status: form.status,
        inactive_reason: form.inactiveReason,
      };

      if (editMode && selectedId) {
        await updateStudent(selectedId, payload);
        alert("Student Updated ✅");
      } else {
        await createStudent(payload);
        alert("Student Created Successfully!");
      }

      fetchStudents();

      setForm(initialForm);
      setEditMode(false);
      setViewMode(false);
      setSelectedId(null);
    } catch (error: any) {
      console.error(error);
      alert(error?.response?.data?.message || "Error saving student");
    }
  };

  const fetchDefaultFee = async (cls: string) => {
    if (!cls) return;

    try {
      const currentYear = new Date().getFullYear();
      const res = await getFeeByClass(currentYear, cls);

      setForm((prev) => ({
        ...prev,
        fee: res.data.default_fee || "",
      }));
    } catch (err) {
      console.error("Error fetching default fee", err);
    }
  };

  const handleDefaultFeeToggle = async (checked: boolean) => {
    setUseDefaultFee(checked);

    if (checked) {
      await fetchDefaultFee(form.studentClass);
    } else {
      setForm((prev) => ({ ...prev, fee: "" }));
    }
  };

  const openFeeModal = async (student: any) => {
    setSelectedStudent(student);
    setOpenFeeDialog(true);

    const [paymentRes, summaryRes] = await Promise.all([
      getPayments(student.id),
      getPaymentSummary(student.id),
    ]);

    setPayments(Array.isArray(paymentRes.data) ? paymentRes.data : []);

    setFeeSummary(summaryRes.data);
  };

  const paymentCategories = [
    "Fee",
    "Stationary",
    "Events",
    "Transport",
    "Others",
  ];

  const columns: GridColDef[] = [
    { field: "id", headerName: "ID", width: 80 },

    {
      field: "name",
      headerName: "Name",
      flex: 1.5, // 🔥 instead of width
      valueGetter: (value, row) =>
        `${row.first_name || ""} ${row.last_name || ""}`,
    },

    { field: "class", headerName: "Class", flex: 1 },
    { field: "father_name", headerName: "Father", flex: 1 },
    { field: "contact", headerName: "Contact", flex: 1 },
    { field: "fee", headerName: "Fee", flex: 1 },
    { field: "payment_type", headerName: "Payment", flex: 1 },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      renderCell: (params) => (
        <Box
          sx={{
            borderRadius: 5,
            fontSize: 12,
            fontWeight: 600,
            textAlign: "center",
            color: params.row.status === "Active" ? "#2e7d32" : "#d32f2f",
            // backgroundColor:
            //   params.row.status === "Active" ? "#e8f5e9" : "#ffebee",
          }}
        >
          {params.row.status}
        </Box>
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 220,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 5,
            height: "inherit",
          }}
        >
          {/* VIEW */}
          <IconButton
            size="small"
            title="View"
            onClick={() => handleView(params.row)}
            sx={{
              p: "10px",
              width: 28,
              height: 28,
              minWidth: 28,

              backgroundColor: "#e1f5fe",
              color: "#0288d1",
              border: "1px solid #b3e5fc",

              "&:hover": {
                backgroundColor: "#b3e5fc",
              },
            }}
          >
            <i className="bi bi-eye-fill" style={{ fontSize: 16 }}></i>
          </IconButton>

          {/* EDIT */}
          <IconButton
            size="small"
            title="Edit"
            onClick={() => handleEdit(params.row)}
            sx={{
              p: "10px",
              width: 28,
              height: 28,
              minWidth: 28,
              backgroundColor: "#e8f5e9",
              color: "#2e7d32",
              border: "1px solid #c8e6c9",
              "&:hover": {
                backgroundColor: "#c8e6c9",
              },
            }}
          >
            <i className="bi bi-pencil-fill" style={{ fontSize: 16 }}></i>
          </IconButton>

          {/* ATTENDANCE */}
          <IconButton
            size="small"
            title="Attendance"
            onClick={() =>
              navigate(`/dashboard/student-attendance/${params.row.id}`, {
                state: {
                  student: params.row,
                },
              })
            }
            sx={{
              p: "10px",
              width: 28,
              height: 28,
              minWidth: 28,
              backgroundColor: "#ede7f6",
              color: "#5e35b1",
              border: "1px solid #d1c4e9",
              "&:hover": {
                backgroundColor: "#d1c4e9",
              },
            }}
          >
            <i className="bi bi-bar-chart-fill" style={{ fontSize: 16 }}></i>
          </IconButton>

          {/* FEE */}
          <IconButton
            size="small"
            title="Fee Payment"
            onClick={() => openFeeModal(params.row)}
            sx={{
              p: "10px",
              width: 28,
              height: 28,
              minWidth: 28,
              backgroundColor: "#fff3e0",
              color: "#ef6c00",
              border: "1px solid #ffe0b2",
              "&:hover": {
                backgroundColor: "#ffe0b2",
              },
            }}
          >
            <i className="bi bi-currency-rupee" style={{ fontSize: 16 }}></i>
          </IconButton>
        </div>
      ),
    },
  ];

  const handleResetForm = () => {
    setForm(initialForm);
    setEditMode(false);
    setViewMode(false);
    setSelectedId(null);
    setUseDefaultFee(false);
  };

  return (
    <Box>
      <Accordion defaultExpanded sx={{ mb: 3 }}>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography variant="h6" fontWeight={600}>
            {editMode ? "Edit Student" : "Create Student"}
          </Typography>
        </AccordionSummary>

        <AccordionDetails sx={{ p: 0 }}>
          <Paper sx={{ p: 4, borderRadius: 3, boxShadow: "none" }}>
            <div className="row g-3">
              {[
                { label: "First Name", name: "firstName", required: true },
                { label: "Last Name", name: "lastName", required: true },
                { label: "Father Name", name: "fatherName", required: true },
                { label: "Mother Name", name: "motherName" },
                { label: "Guardian Name", name: "guardianName" },
                { label: "Contact Number", name: "contact", required: true },
                { label: "Email ID", name: "email", required: true },
                { label: "Area", name: "area", required: true },
                { label: "City", name: "city", required: true },
                { label: "Address", name: "address", required: true },
                { label: "Pincode", name: "pincode", required: true },
              ].map((field, i) => (
                <div className="col-12 col-sm-6 col-md-3" key={i}>
                  <TextField
                    label={field.label}
                    name={field.name}
                    fullWidth
                    required={field.required}
                    value={(form as any)[field.name]}
                    onChange={handleChange}
                    disabled={viewMode}
                  />
                </div>
              ))}

              {/* Aadhar */}
              <div className="col-12 col-sm-6 col-md-3">
                <TextField
                  label="Aadhar Number"
                  name="aadhar"
                  fullWidth
                  value={form.aadhar}
                  onChange={handleChange}
                  disabled={viewMode}
                />
              </div>
            </div>
            <hr />
            <div className="row g-3">
              {/* Joining Date */}
              <div className="col-12 col-sm-6 col-md-3">
                <TextField
                  label="Date of Joining"
                  type="date"
                  name="joiningDate"
                  fullWidth
                  value={form.joiningDate}
                  onChange={handleChange}
                  // InputLabelProps={{ shrink: true }}
                  disabled={viewMode}
                />
              </div>

              {/* Class */}
              <div className="col-12 col-sm-6 col-md-3">
                <TextField
                  select
                  label="Class"
                  name="studentClass"
                  fullWidth
                  value={form.studentClass}
                  onChange={handleChange}
                  disabled={viewMode}
                  sx={{
                    "& .MuiSelect-select": {
                      textAlign: "left",
                    },
                  }}
                >
                  {classes.map((cls) => (
                    <MenuItem key={cls} value={cls} sx={{}}>
                      {cls}
                    </MenuItem>
                  ))}
                </TextField>
              </div>
            </div>
            <hr />
            <div className="row g-3">
              {/* Fee */}
              <div className="col-12 col-sm-6 col-md-3">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    border: "1px solid #d1d5db",
                    borderRadius: 2,
                    px: 2,
                    height: "100%",
                    minHeight: 56,
                    backgroundColor: "#fff",
                  }}
                >
                  {/* CHECKBOX */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <input
                      type="checkbox"
                      checked={useDefaultFee}
                      onChange={(e) => handleDefaultFeeToggle(e.target.checked)}
                      disabled={viewMode}
                    />

                    <Typography
                      sx={{
                        fontSize: 14,
                        whiteSpace: "nowrap",
                        fontWeight: 500,
                      }}
                    >
                      Use Default Fee
                    </Typography>
                  </Box>

                  {/* FEE INPUT */}
                  <TextField
                    label="Fee"
                    name="fee"
                    type="number"
                    size="small"
                    fullWidth
                    value={form.fee}
                    onChange={handleChange}
                    disabled={viewMode || useDefaultFee}
                  />
                </Box>
              </div>

              {/* Payment */}
              <div className="col-12 col-sm-6 col-md-3">
                <TextField
                  select
                  label="Type of Payment"
                  name="paymentType"
                  fullWidth
                  value={form.paymentType}
                  onChange={handleChange}
                  disabled={viewMode}
                  sx={{
                    "& .MuiSelect-select": {
                      textAlign: "left",
                    },
                  }}
                >
                  {paymentTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </TextField>
              </div>

              {/* Status */}
              <div className="col-12 col-sm-6 col-md-3">
                <TextField
                  select
                  label="Student Status"
                  name="status"
                  fullWidth
                  value={form.status}
                  onChange={handleChange}
                  disabled={viewMode}
                  sx={{
                    "& .MuiSelect-select": {
                      textAlign: "left",
                    },
                  }}
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                </TextField>
              </div>

              {/* Inactive Reason */}
              {form.status === "Inactive" && (
                <div className="col-12 col-sm-12 col-md-6 col-lg-4">
                  <TextField
                    label="Inactive Reason"
                    name="inactiveReason"
                    fullWidth
                    multiline
                    minRows={2}
                    value={form.inactiveReason}
                    onChange={handleChange}
                    disabled={viewMode}
                    placeholder="Reason for leaving school..."
                  />
                </div>
              )}

              {/* Button */}
              <div
                className="col-12"
                style={{ display: "flex", alignItems: "center" }}
              >
                <Box sx={{ display: "flex", gap: 2 }}>
                  {!viewMode && (
                    <Button variant="contained" onClick={handleSubmit}>
                      {editMode ? "Update Student" : "Create Student"}
                    </Button>
                  )}

                  {(editMode || viewMode) && (
                    <Button variant="outlined" onClick={handleResetForm}>
                      Cancel
                    </Button>
                  )}
                </Box>
              </div>
            </div>
          </Paper>
        </AccordionDetails>
      </Accordion>

      {/* TABLE */}
      <Paper sx={{ p: 2, mt: 4, borderRadius: 3 }}>
        <Typography
          variant="h6"
          mb={5}
          style={{ textAlign: "left", marginBottom: "10px" }}
        >
          Students List
        </Typography>
        <Box sx={{ width: "100%" }}>
          <div style={{ width: "100%" }}>
            <DataGrid
              rows={students}
              columns={columns}
              getRowId={(row) => row.id}
              pageSizeOptions={[5, 10, 20]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10, page: 0 },
                },
              }}
              slots={{ toolbar: GridToolbar }} // 🔥 filters + search
              slotProps={{
                toolbar: { showQuickFilter: true },
              }}
              // autoHeight
            />
          </div>
        </Box>
      </Paper>

      <Dialog open={openFeeDialog} onClose={() => setOpenFeeDialog(false)}>
        <Box sx={{ p: 3 }}>
          {/* HEADER */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography variant="h6">
              Fee Payment - {selectedStudent?.first_name}
            </Typography>

            <IconButton onClick={() => setOpenFeeDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Box>

          <Box
            sx={{
              mt: 2,
              p: 2,
              backgroundColor: "#f5f5f5",
              borderRadius: 2,
              display: "flex",
              justifyContent: "space-between",
              gap: 2,
              flexWrap: "wrap",
            }}
          >
            <Box>
              <Typography variant="body2" color="text.secondary">
                Total Fee
              </Typography>

              <Typography variant="h6" fontWeight={700}>
                ₹{feeSummary.total_fee || 0}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">
                Paid Fee
              </Typography>

              <Typography variant="h6" fontWeight={700} sx={{ color: "green" }}>
                ₹{feeSummary.paid_fee || 0}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">
                Pending Fee
              </Typography>

              <Typography
                variant="h6"
                fontWeight={700}
                sx={{
                  color: Number(feeSummary.pending_fee) > 0 ? "red" : "green",
                }}
              >
                ₹{feeSummary.pending_fee || 0}
              </Typography>
            </Box>

            <Box>
              <Typography variant="body2" color="text.secondary">
                Class
              </Typography>

              <Typography variant="h6" fontWeight={700}>
                {selectedStudent?.class}
              </Typography>
            </Box>
          </Box>

          <hr />
          {/* PAYMENT HISTORY */}
          <Typography mt={2} fontWeight={600}>
            Payment History
          </Typography>

          <table className="table table-striped border">
            <thead>
              <tr>
                <td scope="col">Date</td>
                <td scope="col">Type</td>
                <td scope="col">Amount</td>
                <td scope="col">Mode</td>
                <td scope="col">Description</td>
              </tr>
            </thead>
            <tbody>
              {payments?.map((p, i) => (
                <tr key={i} sx={{ borderBottom: "1px solid #eee", py: 1 }}>
                  <td>{new Date(p.created_at).toLocaleDateString()}</td>
                  <td>
                    <b>{p.type}</b>
                  </td>
                  <td>{p.amount}</td>
                  <td>{p.mode}</td>
                  <td>{p.description}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <hr />
          {/* NEW PAYMENT */}
          <Typography mt={2} fontWeight={600}>
            New Payment
          </Typography>

          <TextField
            select
            fullWidth
            sx={{ mt: 2 }}
            label="Payment Type"
            value={feeForm.type}
            onChange={(e) => setFeeForm({ ...feeForm, type: e.target.value })}
          >
            {paymentCategories.map((t) => (
              <MenuItem key={t} value={t}>
                {t}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Amount"
            type="number"
            fullWidth
            sx={{ mt: 1 }}
            value={feeForm.amount}
            onChange={(e) => setFeeForm({ ...feeForm, amount: e.target.value })}
          />

          <TextField
            select
            fullWidth
            sx={{ mt: 2 }}
            value={feeForm.mode}
            onChange={(e) => setFeeForm({ ...feeForm, mode: e.target.value })}
          >
            <MenuItem value="Cash">Cash</MenuItem>
            <MenuItem value="UPI">UPI</MenuItem>
            <MenuItem value="Card">Card</MenuItem>
            <MenuItem value="Bank Transfer">Bank Transfer</MenuItem>
          </TextField>

          <TextField
            label="Description"
            fullWidth
            multiline
            rows={2}
            sx={{ mt: 2 }}
            value={feeForm.description}
            onChange={(e) =>
              setFeeForm({ ...feeForm, description: e.target.value })
            }
          />

          <Button
            variant="contained"
            sx={{ mt: 2 }}
            onClick={async () => {
              await addPayment({
                student_id: selectedStudent.id,
                ...feeForm,
                type: feeForm.type,
              });

              setFeeForm({ amount: "", mode: "Cash", description: "" });

              const [paymentRes, summaryRes] = await Promise.all([
                getPayments(selectedStudent.id),
                getPaymentSummary(selectedStudent.id),
              ]);

              setPayments(paymentRes.data);
              setFeeSummary(summaryRes.data);
            }}
          >
            Pay
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
}
