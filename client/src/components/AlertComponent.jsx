import React, { useContext } from "react";
import { Alert, Snackbar } from "@mui/material"; // Using Snackbar for better alert handling
import { AlertContext } from "./AlertContext";

function AlertComponent() {
  const { alert, closeAlert } = useContext(AlertContext);

  return (
    <Snackbar
        open={alert.open}
      autoHideDuration={6000} // Auto-hide after 6 seconds
      onClose={closeAlert}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }} // Positioning to the bottom-right
    >
      <Alert onClose={closeAlert} severity={alert.severity}>
        {alert.message}
      </Alert>
    </Snackbar>
  );
}

export default AlertComponent;
