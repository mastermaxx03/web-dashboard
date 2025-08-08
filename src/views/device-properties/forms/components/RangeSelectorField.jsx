import React from 'react';
import { Box, Grid, Typography, Button, TextField, InputAdornment } from '@mui/material';

const RangeSelectorField = ({ field, config, calculatedValue, onModeChange, onPercentChange }) => {
  const fieldLabel = (
    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
      {field.label}
      {field.required && <span style={{ color: 'red' }}> *</span>}
    </Typography>
  );

  return (
    <Box sx={{ width: '100%' }}>
      {/* Top row with label and default button */}
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={5}>
          {fieldLabel}
        </Grid>
        <Grid item xs={12} sm={7}>
          <Button variant={config.mode === 'default' ? 'contained' : 'outlined'} onClick={() => onModeChange('default')} fullWidth>
            {field.buttonLabel || `Value (±${field.defaultPercent}%)`}
          </Button>
        </Grid>
      </Grid>

      {/* Custom percentage input */}
      <Box sx={{ mt: 2, px: 0 }}>
        <TextField
          type="number"
          label="Custom Range"
          value={config.percent}
          onChange={(e) => onPercentChange(e, field.sliderMin, field.sliderMax)}
          fullWidth
          size="small"
          InputProps={{
            startAdornment: <InputAdornment position="start">±</InputAdornment>,
            endAdornment: <InputAdornment position="end">%</InputAdornment>,
            inputProps: {
              min: field.sliderMin,
              max: field.sliderMax,
              step: field.sliderStep
            }
          }}
        />
      </Box>

      {/* Display for the calculated result */}
      <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
        Calculated Range: <strong>{calculatedValue}</strong>
      </Typography>
    </Box>
  );
};

export default RangeSelectorField;
