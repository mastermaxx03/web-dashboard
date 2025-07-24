import { FaExternalLinkAlt } from 'react-icons/fa';
import React, { useEffect, useState } from 'react';
import { Box, Paper, Typography, Slider, Select, MenuItem, FormControl, InputLabel, TextField, IconButton, Tooltip } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { SketchPicker } from 'react-color';
import { DeviceIcon, iconList } from './iconLibrary';

const darkBorderColors = ['#000000', '#424242', '#B71C1C', '#1A237E', '#004D40', '#1B5E20'];

export default function InspectorPanel({ node, onStyleChange, onClose }) {
  if (!node) return null;

  const [localDeviceName, setLocalDeviceName] = useState(node.data.deviceName || '');
  const [localDeviceId, setLocalDeviceId] = useState(node.data.deviceId || '');
  const [currentColor, setCurrentColor] = useState(node.data.color || '#fff');

  useEffect(() => {
    setLocalDeviceName(node.data.deviceName || '');
    setLocalDeviceId(node.data.deviceId || '');
    setCurrentColor(node.data.color || '#fff');
  }, [node.id, node.data.deviceName, node.data.deviceId, node.data.color]);

  const handleChange = (property, value) => {
    onStyleChange(node.id, { [property]: value });
  };

  const handleColorChangeComplete = (color) => {
    onStyleChange(node.id, { color: color.hex });
  };

  return (
    <Paper
      elevation={3}
      sx={{
        width: '280px',
        p: 2,
        zIndex: 10,
        position: 'absolute',
        right: 0,
        top: 0,
        height: '100%',
        overflowY: 'auto'
      }}
    >
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" gutterBottom sx={{ mb: 0 }}>
          Properties
        </Typography>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>
      <a
        href={`/canvas2/device-properties/${node.data.deviceId}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{ textDecoration: 'none' }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 1, color: 'primary.main', cursor: 'pointer' }}>
          <FaExternalLinkAlt size="14px" />
          <Typography variant="body2">More Details</Typography>
        </Box>
      </a>
      {/*icon picker section*/}
      <Typography variant="subtitle1" sx={{ mt: 2 }}>
        Device Icon
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '10px', p: 1, border: '1px solid #ddd', borderRadius: '4px' }}>
        {iconList.map((iconName) => (
          <Tooltip title={iconName} key={iconName}>
            <IconButton
              onClick={() => handleChange('icon', iconName)}
              sx={{
                fontSize: '24px',
                color: 'text.primary',
                // This line highlights the currently selected icon
                backgroundColor: node.data.icon === iconName ? 'action.selected' : 'transparent'
              }}
            >
              <DeviceIcon iconName={iconName} />
            </IconButton>
          </Tooltip>
        ))}
      </Box>
      {/* TextFields with all necessary props restored */}
      <TextField
        label="Device Name"
        fullWidth
        variant="outlined"
        size="small"
        value={localDeviceName}
        onChange={(e) => setLocalDeviceName(e.target.value)}
        onBlur={() => handleChange('deviceName', localDeviceName)}
        sx={{ mt: 2 }}
      />

      <TextField
        label="Device ID"
        fullWidth
        variant="outlined"
        size="small"
        value={localDeviceId}
        onChange={(e) => setLocalDeviceId(e.target.value)}
        onBlur={() => handleChange('deviceId', localDeviceId)}
        sx={{ mt: 1 }}
      />

      <Typography variant="subtitle1" sx={{ mt: 2 }}>
        Fill Color
      </Typography>
      <SketchPicker
        color={currentColor}
        onChange={(color) => setCurrentColor(color.hex)}
        onChangeComplete={handleColorChangeComplete}
        width="240px"
      />

      <Typography variant="subtitle1" sx={{ mt: 2 }}>
        Border Color
      </Typography>
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {darkBorderColors.map((color) => (
          <Box
            key={`border-${color}`}
            sx={{ width: 24, height: 24, backgroundColor: color, borderRadius: '4px', cursor: 'pointer', border: '1px solid #ccc' }}
            onClick={() => handleChange('borderColor', color)}
          />
        ))}
      </Box>

      <Typography variant="subtitle1" sx={{ mt: 2 }}>
        Border Style
      </Typography>
      <FormControl fullWidth size="small" sx={{ mt: 1 }}>
        <InputLabel>Style</InputLabel>
        <Select label="Style" defaultValue={node.data.borderStyle || 'solid'} onChange={(e) => handleChange('borderStyle', e.target.value)}>
          <MenuItem value="solid">Solid</MenuItem>
          <MenuItem value="dashed">Dashed</MenuItem>
          <MenuItem value="dotted">Dotted</MenuItem>
        </Select>
      </FormControl>

      <Typography variant="subtitle1" sx={{ mt: 2 }}>
        Border Thickness
      </Typography>
      <Slider
        defaultValue={node.data.borderWidth || 1}
        step={1}
        min={0}
        max={10}
        valueLabelDisplay="auto"
        onChangeCommitted={(e, value) => handleChange('borderWidth', value)}
      />
    </Paper>
  );
}
