import React, { createContext, useState } from 'react';
// Create the context
export const AlertContext = createContext();

// Create a provider component
export const AlertProvider = ({ children }) => {
  const [alert, setAlert] = useState({open:false, message: '', severity: '' });

  // Function to show an alert
  const showAlert = (message, severity) => {
    setAlert({ open:true,message, severity });
  };
  const closeAlert = () => {
    setAlert((prev) => ({ ...prev, open: false }));
  };

  return (
    <AlertContext.Provider value={{ alert, showAlert,closeAlert }}>
      {children}
    </AlertContext.Provider>
  );
};
