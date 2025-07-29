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
  Switch,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';

// Import the form configuration from our new, separate file.
import { htRmuFormSteps, htRmuFrequencyCalculator, htRmuThresholdsCalculator, htRmuCurrentCalculator } from './forms/ht-rmu-form';

const panelFormSteps = htRmuFormSteps;

// We can create a separate blueprint for machines
const machineFormSteps = [
  {
    label: 'Machine Details',
    fields: [
      { id: 'machine_name', label: 'Machine Name', type: 'text', defaultValue: '' },
      { id: 'power_rating', label: 'Power Rating (kW)', type: 'number', defaultValue: 100 }
    ]
  }
  // ... other steps for machines
];

// --- CHANGE START ---
// This function now correctly selects the form based on propertyType.
const getFormConfigForPropertyType = (propertyType) => {
  switch (String(propertyType)) {
    case '5': // Panel
      return machineFormSteps;
    case '1': // Machine
      return panelFormSteps;
    default:
      // Fallback for devices without a propertyType
      return [{ label: 'Default', fields: [{ id: 'default', label: 'Default Field', type: 'text', defaultValue: 'N/A' }] }];
  }
};
// --- CHANGE END ---

const DevicePropertiesPage = () => {
  const { deviceId } = useParams();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({});
  const [formSteps, setFormSteps] = useState([]);
  const [initialData, setInitialData] = useState({});
  // New state to handle the initial loading of device data
  const [isLoading, setIsLoading] = useState(true);

  //form type
  const [selectedFormType, setSelectedFormType] = useState('');

  useEffect(() => {
    const loadFormForDevice = async () => {
      setIsLoading(true);

      const response = await fetch('https://iot-poc-001.s3.ap-south-1.amazonaws.com/hierarchyData5.json');
      const diagramData = await response.json();
      const currentNode = diagramData.nodes.find((n) => n.data.deviceId === deviceId);

      if (!currentNode) {
        console.error('Device not found!');
        setIsLoading(false);
        return;
      }

      // Get the propertyType and select the correct form blueprint
      const propertyType = currentNode.data.propertyType;
      const currentFormSteps = getFormConfigForPropertyType(propertyType);
      setFormSteps(currentFormSteps);

      // Initialize the form with default values from the selected blueprint
      const initialData = {};
      currentFormSteps.forEach((step) => {
        step.fields.forEach((field) => {
          if (field.defaultValue !== undefined) {
            initialData[field.id] = field.defaultValue;
          }
        });
      });

      // Only run the calculator if the function exists for this form type
      if (propertyType === '5' && initialData.nominal_voltage) {
        const initialThresholds = htRmuThresholdsCalculator(initialData.nominal_voltage);
        setFormData({ ...initialData, ...initialThresholds });
      } else {
        setFormData(initialData);
      }

      setActiveStep(0);
      setIsLoading(false);
    };

    loadFormForDevice();
  }, [deviceId]); // This whole process re-runs if the deviceId in the URL changes

  useEffect(() => {
    if (!selectedFormType) return; // Do nothing if no type is selected

    const currentFormSteps = getFormConfigForPropertyType(selectedFormType);
    setFormSteps(currentFormSteps);

    const initialValues = {};
    currentFormSteps.forEach((step) => {
      step.fields.forEach((field) => {
        if (field.defaultValue !== undefined) {
          initialValues[field.id] = field.defaultValue;
        }
      });
    });

    setInitialData(initialValues);

    if (selectedFormType === '5') {
      const initialVoltage = htRmuThresholdsCalculator(initialValues.nominal_voltage);
      const initialFreq = htRmuFrequencyCalculator(initialValues.nominal_frequency);
      const initialCurrent = htRmuCurrentCalculator(
        initialValues.r_phase_current,
        initialValues.y_phase_current,
        initialValues.b_phase_current
      );
      setFormData({ ...initialValues, ...initialVoltage, ...initialFreq, ...initialCurrent });
    } else {
      setFormData(initialValues);
    }

    setActiveStep(0); // Always reset to the first step when the form changes
  }, [selectedFormType]);
  const handleInputChange = useCallback(
    (fieldId, value) => {
      setFormData((prevData) => {
        const newData = { ...prevData, [fieldId]: value };

        // Check which form is loaded before trying to calculate
        if (selectedFormType === '5') {
          if (fieldId === 'nominal_voltage') {
            const newThresholds = htRmuThresholdsCalculator(value);
            return { ...newData, ...newThresholds };
          }
          if (fieldId === 'nominal_frequency') {
            const newThresholds = htRmuFrequencyCalculator(value);
            return { ...newData, ...newThresholds };
          }
          if (['r_phase_current', 'y_phase_current', 'b_phase_current'].includes(fieldId)) {
            const r = fieldId === 'r_phase_current' ? value : newData.r_phase_current;
            const y = fieldId === 'y_phase_current' ? value : newData.y_phase_current;
            const b = fieldId === 'b_phase_current' ? value : newData.b_phase_current;
            const newThresholds = htRmuCurrentCalculator(r, y, b);
            return { ...newData, ...newThresholds };
          }
        }
        return newData;
      });
    },
    [selectedFormType]
  ); // Add formSteps as a dependency

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };
  const handleReset = () => {
    console.log('Resetting form to initial values.');
    setFormData(initialData);
  };

  const handleSaveDraft = () => {
    console.log('Saving draft...', formData);
    alert('Draft Saved!');
  };

  const handleValidate = () => {
    console.log('Validating current step...', formData);
    alert('Validation Complete!');
  };

  const handleSubmit = () => {
    console.log('Submitting final form...', formData);
    alert('Form Submitted!');
  };
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
        );
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

  if (isLoading || formSteps.length === 0) {
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
      {/*allow users to switch forms*/}
      <FormControl fullWidth sx={{ my: 3 }}>
        <InputLabel>Form Type</InputLabel>
        <Select value={selectedFormType} label="Form Type" onChange={(e) => setSelectedFormType(e.target.value)}>
          <MenuItem value={'5'}>LT</MenuItem>
          <MenuItem value={'5'}>Machine</MenuItem>
          <MenuItem value={'1'}>HT</MenuItem>
        </Select>
      </FormControl>

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

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        {/* Left-aligned buttons */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" color="secondary" onClick={handleReset}>
            Reset
          </Button>
          <Button variant="outlined" color="primary" onClick={handleSaveDraft}>
            Save Draft
          </Button>
        </Box>

        {/* Right-aligned buttons */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          {/* Back button is only shown after the first step */}
          {activeStep > 0 && (
            <Button color="inherit" onClick={handleBack}>
              Back
            </Button>
          )}
          <Button variant="outlined" onClick={handleValidate}>
            Validate
          </Button>

          {/* Conditional Next/Submit button */}
          {activeStep < steps.length - 1 ? (
            <Button variant="contained" onClick={handleNext}>
              Next
            </Button>
          ) : (
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Submit
            </Button>
          )}
        </Box>
      </Box>
    </Paper>
  );
};

export default DevicePropertiesPage;
