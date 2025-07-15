import React from 'react';
import { Handle, Position } from 'reactflow';
import { Paper, Typography } from '@mui/material';

function CustomNode({ data }) {
  // The 'data' prop will contain the label and color we pass to the node
  return (
    <Paper
      elevation={3}
      sx={{
        backgroundColor: data.color || '#eeeeee', // Use color from data, or a default
        padding: '10px 15px',
        borderRadius: '4px',
        border: '1px solid #1a192b'
      }}
    >
      {/* Handles are the connection points for edges */}
      <Handle type="target" position={Position.Top} />
      <Typography>{data.label}</Typography>
      <Handle type="source" position={Position.Bottom} />
    </Paper>
  );
}

export default CustomNode;
