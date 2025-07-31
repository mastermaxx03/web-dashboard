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
  Switch,
  InputAdornment
} from '@mui/material';

import { htFormSteps } from './forms/ht-form';

const ltMachineFormSteps = [
  {
    label: 'LT / Machine General Details',
    fields: [
      { id: 'asset_name', label: 'Asset Name', type: 'text', defaultValue: '' },
      { id: 'power_rating_kw', label: 'Power Rating (kW)', type: 'number', defaultValue: '' }
    ]
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

const calculateAcceptableRange = (nominalVoltage, percent) => {
  const nominal = parseInt(nominalVoltage, 10);
  if (isNaN(nominal) || !percent) return 'N/A';
  const deviation = nominal * (percent / 100);
  const lower = (nominal - deviation).toFixed(2);
  const upper = (nominal + deviation).toFixed(2);
  return `${lower} kV to ${upper} kV`;
};

const calculateWarningRange = (nominalVoltage, percent) => {
  const nominal = parseInt(nominalVoltage, 10);
  if (isNaN(nominal) || !percent) return 'N/A';
  const deviation = nominal * (percent / 100);
  const lower = (nominal - deviation).toFixed(2);
  const upper = (nominal + deviation).toFixed(2);
  return `> ${upper} kV or < ${lower} kV`;
};
const calculateCriticalRange = (nominalVoltage, percent) => {
  const nominal = parseInt(nominalVoltage, 10);
  if (isNaN(nominal) || !percent) return 'N/A';
  const deviation = nominal * (percent / 100);
  const lower = (nominal - deviation).toFixed(2);
  const upper = (nominal + deviation).toFixed(2);
  return `>${upper} kV or <${lower} kV`;
};

const DevicePropertiesPage = () => {
  const { deviceId } = useParams();
  const [activeStep, setActiveStep] = useState(0);
  const [formSteps, setFormSteps] = useState([]);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [acceptableRangeConfig, setAcceptableRangeConfig] = useState({ mode: 'default', percent: 5 });
  const [warningRangeConfig, setWarningRangeConfig] = useState({ mode: 'default', percent: 10 });
  const [criticalRangeConfig, setCriticalRangeConfig] = useState({ mode: 'default', percent: 10 });
  useEffect(() => {
    const loadFormForDevice = async () => {
      setIsLoading(true);

      const response = await fetch('https://iot-poc-001.s3.ap-south-1.amazonaws.com/hierarchyData5.json');
      const diagramData = await response.json();
      const currentNode = diagramData.nodes.find((n) => n.data.deviceId === deviceId);

      if (!currentNode) {
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

      const initialAcceptable = calculateAcceptableRange(initialData.nominal_ht_voltage, 5);
      const initialWarning = calculateWarningRange(initialData.nominal_ht_voltage, 10);
      const initialCritical = calculateCriticalRange(initialData.nominal_ht_voltage, 10);
      setFormData({
        ...initialData,
        acceptable_range_display: initialAcceptable,
        warning_threshold_display: initialWarning,
        critical_threshold_display: initialCritical
      });
      setAcceptableRangeConfig({ mode: 'default', percent: 5 });
      setWarningRangeConfig({ mode: 'default', percent: 10 });
      setCriticalRangeConfig({ mode: 'default', percent: 10 });

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

    setErrors(newErrors);

    if (isValid) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleInputChange = useCallback(
    (fieldId, value) => {
      setFormData((prevData) => {
        const newData = { ...prevData, [fieldId]: value };

        if (fieldId === 'nominal_ht_voltage') {
          const acceptablePercent = acceptableRangeConfig.mode === 'default' ? 5 : acceptableRangeConfig.percent;
          const warningPercent = warningRangeConfig.mode === 'default' ? 10 : warningRangeConfig.percent;
          const criticalPercent = criticalRangeConfig.mode === 'default' ? 10 : criticalRangeConfig.percent;
          newData.acceptable_range_display = calculateAcceptableRange(value, acceptablePercent);
          newData.warning_threshold_display = calculateWarningRange(value, warningPercent);
          newData.critical_threshold_display = calculateCriticalRange(value, criticalPercent);
        }

        return newData;
      });

      if (errors[fieldId]) {
        setErrors((prevErrors) => {
          const newErrors = { ...prevErrors };
          delete newErrors[fieldId];
          return newErrors;
        });
      }
    },
    // --- CHANGE START ---
    // 1. Corrected the dependency array to include all the necessary state variables.
    [errors, acceptableRangeConfig, warningRangeConfig, criticalRangeConfig]
    // --- CHANGE END ---
  );

  const handleAcceptableRangeModeChange = (mode) => {
    const newPercent = mode === 'default' ? 5 : acceptableRangeConfig.percent;
    setAcceptableRangeConfig({ mode, percent: newPercent });
    const newRange = calculateAcceptableRange(formData.nominal_ht_voltage, newPercent);
    setFormData((prevData) => ({ ...prevData, acceptable_range_display: newRange }));
  };

  const handleAcceptablePercentInputChange = (event, min, max) => {
    let value = event.target.value;
    if (value === '') {
      setAcceptableRangeConfig({ mode: 'custom', percent: '' });
      return;
    }
    let numericValue = parseFloat(value);
    if (numericValue > max) numericValue = max;
    if (numericValue < min) numericValue = min;

    setAcceptableRangeConfig({ mode: 'custom', percent: numericValue });
    const newRange = calculateAcceptableRange(formData.nominal_ht_voltage, numericValue);
    setFormData((prevData) => ({ ...prevData, acceptable_range_display: newRange }));
  };

  const handleWarningRangeModeChange = (mode) => {
    const newPercent = mode === 'default' ? 10 : warningRangeConfig.percent;
    setWarningRangeConfig({ mode, percent: newPercent });
    const newRange = calculateWarningRange(formData.nominal_ht_voltage, newPercent);
    setFormData((prevData) => ({ ...prevData, warning_threshold_display: newRange }));
  };

  const handleWarningPercentInputChange = (event, min, max) => {
    let value = event.target.value;
    if (value === '') {
      setWarningRangeConfig({ mode: 'custom', percent: '' });
      return;
    }
    let numericValue = parseFloat(value);
    if (numericValue > max) numericValue = max;
    if (numericValue < min) numericValue = min;

    setWarningRangeConfig({ mode: 'custom', percent: numericValue });
    const newRange = calculateWarningRange(formData.nominal_ht_voltage, numericValue);
    setFormData((prevData) => ({ ...prevData, warning_threshold_display: newRange }));
  };
  const handleCriticalRangeModeChange = (mode) => {
    const newPercent = mode === 'default' ? 10 : criticalRangeConfig.percent;
    setCriticalRangeConfig({ mode, percent: newPercent });
    const newRange = calculateCriticalRange(formData.nominal_ht_voltage, newPercent);
    setFormData((prevData) => ({ ...prevData, critical_threshold_display: newRange }));
  };
  const handleCriticalPercentInputChange = (event, min, max) => {
    let value = event.target.value;
    if (value === '') {
      setCriticalRangeConfig({ mode: 'custom', percent: '' });
      return;
    }
    let numericValue = parseFloat(value);
    if (numericValue > max) numericValue = max;
    if (numericValue < min) numericValue = min;

    setCriticalRangeConfig({ mode: 'custom', percent: numericValue });
    const newRange = calculateCriticalRange(formData.nominal_ht_voltage, numericValue);
    setFormData((prevData) => ({
      ...prevData,
      critical_threshold_display: newRange
    }));
  };

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

      case 'range-selector': {
        let config, handleModeChange, handleInputChange;
        if (field.id === 'acceptable_range_config') {
          config = acceptableRangeConfig;
          handleModeChange = handleAcceptableRangeModeChange;
          handleInputChange = handleAcceptablePercentInputChange;
        } else if (field.id === 'warning_threshold_config') {
          config = warningRangeConfig;
          handleModeChange = handleWarningRangeModeChange;
          handleInputChange = handleWarningPercentInputChange;
        } else {
          config = criticalRangeConfig;
          handleModeChange = handleCriticalRangeModeChange;
          handleInputChange = handleCriticalPercentInputChange;
        }
        return (
          <Box sx={{ width: '100%' }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={5}>
                {fieldLabel}
              </Grid>
              <Grid item xs={12} sm={7}>
                <Button
                  variant={config.mode === 'default' ? 'contained' : 'outlined'}
                  onClick={() => handleModeChange('default')}
                  fullWidth
                >
                  Value (±{field.defaultPercent}%)
                </Button>
              </Grid>
            </Grid>
            <Box sx={{ mt: 2, px: 0 }}>
              <TextField
                type="number"
                label="Custom Range"
                value={config.percent}
                onChange={(e) => handleInputChange(e, field.sliderMin, field.sliderMax)}
                fullWidth
                size="small"
                InputProps={{
                  startAdornment: <InputAdornment position="start">±</InputAdornment>,
                  endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  inputProps: { min: field.sliderMin, max: field.sliderMax, step: field.sliderStep }
                }}
              />
            </Box>
            <Typography variant="body2" color="text.secondary" align="center" sx={{ mt: 2 }}>
              Calculated Range: <strong>{formData[field.displayFieldId]}</strong>
            </Typography>
          </Box>
        );
      }
      case 'hidden':
        return null;
      case 'button-group':
        return (
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={5}>
              {fieldLabel}
            </Grid>
            <Grid item xs={12} sm={7}>
              <ButtonGroup variant="outlined" fullWidth>
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
            </Grid>
          </Grid>
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
            <Grid item xs={12} key={field.id || field.label}>
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
