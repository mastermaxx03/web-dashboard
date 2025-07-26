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
  const [isColorPickerVisible, setColorPickerVisible] = useState(false);

  useEffect(() => {
    setLocalDeviceName(node.data.deviceName || '');
    setLocalDeviceId(node.data.deviceId || '');
    setCurrentColor(node.data.color || '#fff');
  }, [node.id, node.data.deviceName, node.data.deviceId, node.data.color]);

  const handleChange = (property, value) => {
    onStyleChange(node.id, { [property]: value });
  };

  const handleColorChange = (color) => {
    setCurrentColor(color.hex);
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
      <FormControl fullWidth size="small" sx={{ mt: 1 }}>
        <InputLabel>Property Type</InputLabel>
        <Select
          label="Property Type"
          // Ensure the value is a string to match the MenuItem values
          value={String(node.data.propertyType || '')}
          onChange={(e) => handleChange('propertyType', e.target.value)}
        >
          {/* The values are now strings to ensure a correct match */}
          <MenuItem value={'1'}>Machine</MenuItem>
          <MenuItem value={'5'}>Panel</MenuItem>
        </Select>
      </FormControl>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 2 }}>
        <Typography variant="body1" sx={{ fontWeight: 'bold' }}>
          Fill Color
        </Typography>
        {/* --- CHANGE END --- */}
        <Box sx={{ position: 'relative' }}>
          <Box
            sx={{
              p: '5px',
              background: '#fff',
              borderRadius: '4px',
              boxShadow: '0 0 0 1px rgba(0,0,0,.1)',
              display: 'inline-block',
              cursor: 'pointer'
            }}
            onClick={() => setColorPickerVisible(!isColorPickerVisible)}
          >
            <Box
              sx={{
                width: '36px',
                height: '20px',
                borderRadius: '2px',
                backgroundColor: currentColor
              }}
            />
          </Box>

          {isColorPickerVisible && (
            <Box sx={{ position: 'absolute', zIndex: 2, top: '100%', right: 0, mt: '8px' }}>
              <Paper elevation={4} sx={{ position: 'relative', p: 2, pb: 1 }}>
                <IconButton
                  onClick={() => setColorPickerVisible(false)}
                  size="small"
                  sx={{ position: 'absolute', top: 8, right: 8, zIndex: 10 }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
                <SketchPicker color={currentColor} onChange={handleColorChange} onChangeComplete={handleColorChangeComplete} />
              </Paper>
            </Box>
          )}
        </Box>
      </Box>

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
