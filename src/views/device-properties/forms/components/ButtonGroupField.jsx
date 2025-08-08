import React from 'react';
import { Box, Grid, Typography, Button, ButtonGroup } from '@mui/material';

const ButtonGroupField = ({ field, value, onChange, error }) => {
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
        <Box>
          <ButtonGroup variant="outlined" fullWidth>
            {field.options.map((option) => (
              <Button
                key={option.value}
                variant={value === option.value ? 'contained' : 'outlined'}
                onClick={() => onChange(field.id, option.value)}
              >
                {option.label}
              </Button>
            ))}
          </ButtonGroup>
          {error && (
            <Typography color="error" variant="caption" sx={{ mt: 1 }}>
              {error}
            </Typography>
          )}
        </Box>
      </Grid>
    </Grid>
  );
};

export default ButtonGroupField;
