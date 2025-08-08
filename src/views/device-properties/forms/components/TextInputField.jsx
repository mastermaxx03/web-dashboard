import React from 'react';
import { Grid, Typography, TextField, InputAdornment } from '@mui/material';

const TextInputField = ({ field, value, onChange, error }) => {
  const fieldLabel = (
    <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
      {field.label}
      {field.required && <span style={{ color: 'red' }}> *</span>}
    </Typography>
  );

  return (
    <Grid container spacing={2} alignItems="center">
      <Grid item xs={12} sm={5}>
        {fieldLabel}
      </Grid>
      <Grid item xs={12} sm={7}>
        <TextField
          // --- Core props ---
          type={field.type === 'textarea' ? 'text' : field.type}
          value={value}
          onChange={(e) => onChange(field.id, e.target.value)}
          fullWidth
          size="small"
          // --- Conditional props for different types ---
          multiline={field.type === 'textarea'}
          rows={field.type === 'textarea' ? 3 : 1}
          // --- Error handling ---
          error={!!error}
          helperText={error || ''}
          // --- MUI InputProps ---
          InputProps={{
            endAdornment: field.unit ? <InputAdornment position="end">{field.unit}</InputAdornment> : null,
            inputProps: {
              min: field.min,
              max: field.max
            }
          }}
        />
      </Grid>
    </Grid>
  );
};

export default TextInputField;
