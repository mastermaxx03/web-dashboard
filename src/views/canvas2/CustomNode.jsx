import React from 'react';
import { Handle, Position } from 'reactflow';
import { Paper, Typography, Box } from '@mui/material';
import { DeviceIcon } from './iconLibrary';

function CustomNode({ data, selected }) {
  // Construct the border style from individual properties
  const borderWidth = data.borderWidth ?? 1;
  const borderStyle = data.borderStyle || 'solid';
  const borderColor = data.borderColor || '#1a192b';
  const statusColor = data.isActive === true ? '#4CAF50' : '#F44336';

  return (
    <Paper
      elevation={selected ? 6 : 3}
      sx={{
        backgroundColor: data.color || '#eeeeee',
        padding: '10px 15px',
        borderRadius: '4px',
        border: `${borderWidth}px ${borderStyle} ${borderColor}`,
        boxShadow: selected ? '0 0 0 2px dodgerblue' : 'none',
        width: 172
      }}
    >
      <Handle type="target" position={Position.Top} />
      <Box
        sx={{
          width: 10,
          height: 10,
          backgroundColor: statusColor,
          borderRadius: '50%',
          position: 'absolute',
          top: 5,
          right: 5,
          border: '1px solid white'
        }}
      />

      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
        {/* The DeviceIcon component renders the correct icon based on the name */}
        <DeviceIcon iconName={data.icon} style={{ fontSize: '16px' }} />
        <Typography sx={{ fontWeight: 'bold' }}>{data.deviceName}</Typography>
      </Box>

      <Handle type="source" position={Position.Bottom} />
    </Paper>
  );
}

export default CustomNode;
