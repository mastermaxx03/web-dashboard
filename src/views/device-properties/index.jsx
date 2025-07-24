import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography, Paper } from '@mui/material';

// This component will render when you navigate to /canvas2/device-properties/:deviceId
const DevicePropertiesPage = () => {
  // Use the useParams hook to get the 'deviceId' from the URL
  const { deviceId } = useParams();

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Device Properties
      </Typography>
      <Typography variant="h6">
        Showing details for Device ID: <strong>{deviceId}</strong>
      </Typography>
      {/* You can now fetch and display more data here based on the deviceId */}
    </Paper>
  );
};

export default DevicePropertiesPage;
