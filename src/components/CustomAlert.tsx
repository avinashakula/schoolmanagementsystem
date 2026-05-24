import { Alert, Snackbar } from "@mui/material";
import { useEffect, useState } from "react";

type Props = {
  message: string;
  severity?: "error" | "warning" | "info" | "success";
  open: boolean;
  onClose: () => void;
};

export default function CustomAlert({
  message,
  severity = "error",
  open,
  onClose,
}: Props) {
  const [visible, setVisible] = useState(open);

  useEffect(() => {
    setVisible(open);
  }, [open]);

  return (
    <Snackbar
      open={visible}
      autoHideDuration={3000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
    >
      <Alert severity={severity} variant="filled" onClose={onClose}>
        {message}
      </Alert>
    </Snackbar>
  );
}
