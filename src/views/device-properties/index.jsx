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
  Button,
  CircularProgress,
  TextField,
  ButtonGroup,
  FormControlLabel,
  Switch
} from '@mui/material';

import { htFormSteps } from './forms/ht-form';

const ltMachineFormSteps = [
  {
    label: 'LT / Machine General Details',
    fields: [
      { id: 'asset_name', label: 'Asset Name', type: 'text', defaultValue: '' },
      { id: 'power_rating_kw', label: 'Power Rating (kW)', type: 'number', defaultValue: '' }
    ]
  },
  {
    label: 'Operational Parameters',
    fields: []
  }
];

const getFormConfigForPropertyType = (propertyType) => {
  switch (String(propertyType)) {
    case '1':
      return htFormSteps;
    case '5':
      return ltMachineFormSteps;
    default:
      return [{ label: 'Configuration Missing', fields: [] }];
  }
};

const DevicePropertiesPage = () => {
  const { deviceId } = useParams();
  const [activeStep, setActiveStep] = useState(0);
  const [formSteps, setFormSteps] = useState([]);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // --- CHANGE START ---
  // 1. Initialized errors state as an empty object {}.
  const [errors, setErrors] = useState({});
  // --- CHANGE END ---

  useEffect(() => {
    const loadFormForDevice = async () => {
      setIsLoading(true);

      const response = await fetch('https://iot-poc-001.s3.ap-south-1.amazonaws.com/hierarchyData5.json');
      const diagramData = await response.json();
      const currentNode = diagramData.nodes.find((n) => n.data.deviceId === deviceId);

      if (!currentNode) {
        console.error('Device not found!');
        setFormSteps([{ label: 'Error', fields: [] }]);
        setIsLoading(false);
        return;
      }

      const propertyType = currentNode.data.propertyType;
      const currentFormSteps = getFormConfigForPropertyType(propertyType);
      setFormSteps(currentFormSteps);

      const initialData = {};
      currentFormSteps.forEach((step) => {
        step.fields.forEach((field) => {
          if (field.defaultValue !== undefined) {
            initialData[field.id] = field.defaultValue;
          }
        });
      });
      setFormData(initialData);

      setIsLoading(false);
    };

    loadFormForDevice();
  }, [deviceId]);

  const handleNext = () => {
    const currentStepFields = formSteps[activeStep].fields;
    const newErrors = {};
    let isValid = true;

    currentStepFields.forEach((field) => {
      if (field.required && (!formData[field.id] || formData[field.id] === '')) {
        newErrors[field.id] = 'This field is required';
        isValid = false;
      }
    });

    // Set errors after checking all fields.
    setErrors(newErrors);

    // Only proceed if the form is valid.
    if (isValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleInputChange = useCallback(
    (fieldId, value) => {
      setFormData((prevData) => ({
        ...prevData,
        [fieldId]: value
      }));

      if (errors[fieldId]) {
        setErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          delete newErrors[fieldId];
          return newErrors;
        });
      }
    },
    [errors]
  );

  const renderField = (field) => {
    const value = formData[field.id] || '';

    const fieldLabel = (
      <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
        {field.label}
        {field.required && <span style={{ color: 'red' }}> *</span>}
      </Typography>
    );

    let inputComponent;

    switch (field.type) {
      case 'header':
        return (
          <Typography
            variant="subtitle1"
            sx={{
              mb: 1,
              gridColumn: '1 / -1',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              color: 'primary.main',
              borderBottom: '1px solid #e0e0e0',
              pb: 1
            }}
          >
            {field.label}
          </Typography>
        );

      case 'button-group':
        return (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
            {fieldLabel}
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
        );
      case 'textarea':
        inputComponent = (
          <TextField
            multiline
            rows={3}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            fullWidth
            error={!!errors[field.id]}
            helperText={errors[field.id] || ''}
          />
        );
        break;
      case 'file':
        inputComponent = (
          <>
            <Button variant="outlined" component="label" fullWidth>
              Upload File
              <input type="file" hidden accept={field.accept} onChange={(e) => handleInputChange(field.id, e.target.files[0])} />
            </Button>
            {errors[field.id] && (
              <Typography color="error" variant="caption">
                {errors[field.id]}
              </Typography>
            )}
          </>
        );
        break;
      case 'text':
      case 'number':
      default:
        inputComponent = (
          <TextField
            type={field.type}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            fullWidth
            size="small"
            error={!!errors[field.id]}
            helperText={errors[field.id] || ''}
          />
        );
        break;
    }

    return (
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} sm={5}>
          {fieldLabel}
        </Grid>
        <Grid item xs={12} sm={7}>
          {inputComponent}
        </Grid>
      </Grid>
    );
  };
  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  const steps = formSteps.map((step) => step.label);

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h4" gutterBottom>
        Device Properties
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
        <Grid container spacing={3}>
          {formSteps[activeStep]?.fields.map((field) => (
            <Grid item xs={12} key={field.id}>
              {renderField(field)}
            </Grid>
          ))}
        </Grid>
      </Box>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 4 }}>
        {activeStep > 0 && (
          <Button color="inherit" onClick={handleBack} sx={{ mr: 1 }}>
            Back
          </Button>
        )}
        <Button variant="contained" disabled={activeStep === steps.length - 1} onClick={handleNext}>
          Next
        </Button>
      </Box>
    </Paper>
  );
};

export default DevicePropertiesPage;
