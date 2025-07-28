import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Grid,
  TextField,
  Button,
  ButtonGroup,
  FormControlLabel,
  Switch
} from '@mui/material';

// Helper function to calculate voltage thresholds
const calculateThresholds = (voltageString) => {
  const nominal = parseInt(voltageString, 10);
  if (isNaN(nominal)) return {};

  const acceptableLower = (nominal * 0.95).toFixed(2);
  const acceptableUpper = (nominal * 1.05).toFixed(2);
  const warningUpper = (nominal * 1.1).toFixed(2);
  const criticalLower = (nominal * 0.9).toFixed(2);

  return {
    acceptable_range: `${acceptableLower} kV to ${acceptableUpper} kV`,
    warning_threshold: `> ${acceptableUpper} kV or < ${acceptableLower} kV`,
    critical_threshold: `> ${warningUpper} kV or < ${criticalLower} kV`
  };
};

const formSteps = [
  {
    label: 'Static & Default Settings',
    fields: [
      { type: 'header', label: 'a. 3PH L-L VOLTAGES - S1' },
      {
        id: 'nominal_voltage',
        label: 'Nominal L-L Voltage',
        type: 'button-group',
        options: ['11kV', '22kV', '33kV'],
        defaultValue: '11kV'
      },
      // --- CHANGE START ---
      // 1. Changed the type to 'display' for a custom, cleaner look.
      { id: 'acceptable_range', label: 'Acceptable Range', type: 'display', defaultValue: '' },
      { id: 'warning_threshold', label: 'Warning Thresholds', type: 'display', defaultValue: '' },
      { id: 'critical_threshold', label: 'Critical Thresholds', type: 'display', defaultValue: '' },
      // --- CHANGE END ---
      { type: 'header', label: 'b. VOLTAGE MAXIMUM DEVIATION ' },
      {
        id: 'max_dev_acceptable_toggle',
        label: 'Default - Acceptable Threshold (Voltage imbalance ≤ 2%)',
        type: 'switch',
        defaultValue: true
      },
      { id: 'max_dev_warning_toggle', label: 'Default - Warning Threshold (Voltage imbalance > 2%)', type: 'switch', defaultValue: true },
      { id: 'max_dev_critical_toggle', label: 'Default - Critical Threshold (Voltage imbalance > 3%)', type: 'switch', defaultValue: true }
    ]
  },
  {
    label: 'Breaker Specifications',
    fields: []
  },
  {
    label: 'Metering',
    fields: []
  },
  {
    label: 'Safety & Maintenance',
    fields: []
  }
];

const steps = formSteps.map((step) => step.label);

const DevicePropertiesPage = () => {
  const { deviceId } = useParams();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const initialData = {};
    formSteps.forEach((step) => {
      step.fields.forEach((field) => {
        if (field.defaultValue !== undefined) {
          initialData[field.id] = field.defaultValue;
        }
      });
    });
    const initialThresholds = calculateThresholds(initialData.nominal_voltage);
    setFormData({ ...initialData, ...initialThresholds });
  }, []);

  const handleInputChange = useCallback((fieldId, value) => {
    setFormData((prevData) => {
      const newData = { ...prevData, [fieldId]: value };

      if (fieldId === 'nominal_voltage') {
        const newThresholds = calculateThresholds(value);
        return { ...newData, ...newThresholds };
      }

      return newData;
    });
  }, []);

  const renderField = (field) => {
    const value = formData[field.id];

    switch (field.type) {
      case 'header':
        return (
          <Typography variant="h6" sx={{ mb: 1, gridColumn: '1 / -1' }}>
            {field.label}
          </Typography>
        );
      case 'button-group':
        return (
          // --- CHANGE START ---
          // 2. Wrapped the label and buttons in a flexbox for better alignment.
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            <Typography variant="body1" sx={{ mr: 2 }}>
              {field.label}
            </Typography>
            <ButtonGroup variant="outlined">
              {field.options.map((option) => (
                <Button
                  key={option}
                  variant={value === option ? 'contained' : 'outlined'}
                  onClick={() => handleInputChange(field.id, option)}
                >
                  {option}
                </Button>
              ))}
            </ButtonGroup>
          </Box>
          // --- CHANGE END ---
        );
      // --- CHANGE START ---
      // 3. Added a new 'display' type for read-only calculated fields.
      case 'display':
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', py: 1 }}>
            <Typography variant="body1" color="text.secondary">
              {field.label}
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
              {value}
            </Typography>
          </Box>
        );
      // --- CHANGE END ---
      case 'switch':
        return (
          <FormControlLabel
            control={<Switch checked={!!value} onChange={(e) => handleInputChange(field.id, e.target.checked)} />}
            label={field.label}
          />
        );
      case 'text':
      default:
        return (
          <TextField
            type={field.type}
            label={field.label}
            value={value || ''}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            fullWidth
          />
        );
    }
  };

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h4" gutterBottom>
        RMU / HT Panel Properties
      </Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Device ID: {deviceId}
      </Typography>

      <Stepper activeStep={activeStep} sx={{ my: 4 }}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <Box component="form" noValidate autoComplete="off" sx={{ mt: 3 }}>
        <Grid container spacing={3} alignItems="center">
          {formSteps[activeStep].fields.map((field, index) => {
            const isFullWidth = field.type === 'header' || field.type === 'button-group' || field.type === 'display';
            return (
              <Grid item xs={12} sm={isFullWidth ? 12 : 6} key={field.id || `header-${index}`}>
                {renderField(field)}
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Paper>
  );
};

export default DevicePropertiesPage;
