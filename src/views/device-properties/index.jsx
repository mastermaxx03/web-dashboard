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
  if (isNaN(nominal) || !percent) return { display: 'N/A', lower: null, upper: null };
  const deviation = nominal * (percent / 100);
  const lower = parseFloat((nominal - deviation).toFixed(2));
  const upper = parseFloat((nominal + deviation).toFixed(2));
  return {
    display: `${lower} kV to ${upper} kV`,
    lower: lower,
    upper: upper
  };
};

const calculateWarningRange = (nominalVoltage, percent) => {
  const nominal = parseInt(nominalVoltage, 10);
  if (isNaN(nominal) || !percent) return { display: 'N/A', lower: null, upper: null };
  const deviation = nominal * (percent / 100);
  const lower = parseFloat((nominal - deviation).toFixed(2));
  const upper = parseFloat((nominal + deviation).toFixed(2));
  return {
    display: ` ${lower} kV to  ${upper} kV`,
    lower: lower,
    upper: upper
  };
};
const calculateCriticalRange = (nominalVoltage, percent) => {
  const nominal = parseInt(nominalVoltage, 10);
  if (isNaN(nominal) || !percent) return { display: 'N/A', lower: null, upper: null };
  const deviation = nominal * (percent / 100);
  const lower = parseFloat((nominal - deviation).toFixed(2));
  const upper = parseFloat((nominal + deviation).toFixed(2));
  return { display: `${lower} kV to ${upper} kV`, lower: lower, upper: upper };
};

//section 2 frequency
export const calculateFrequencyThresholds = (nominalFrequency) => {
  const nominal = parseFloat(nominalFrequency);
  if (isNaN(nominal))
    return {
      warning_threshold_freq_display: 'N/A',
      critical_threshold_freq_display: 'N/A',
      warning_freq_lower: null,
      warning_freq_upper: null,
      critical_freq_lower: null,
      critical_freq_upper: null
    };

  // Calculate warning thresholds at ±1%
  const warningDeviation = nominal * 0.01;
  const warningLow = (nominal - warningDeviation).toFixed(1);
  const warningHigh = (nominal + warningDeviation).toFixed(1);

  // Calculate critical thresholds at ±3%
  const criticalDeviation = nominal * 0.03;
  const criticalLow = (nominal - criticalDeviation).toFixed(1);
  const criticalHigh = (nominal + criticalDeviation).toFixed(1);

  return {
    warning_threshold_freq_display: `${warningLow} Hz to ${warningHigh} Hz`,
    critical_threshold_freq_display: `${criticalLow} Hz to ${criticalHigh} Hz`,
    // We can also return the raw numbers if needed for the backend
    warning_freq_lower: parseFloat(warningLow),
    warning_freq_upper: parseFloat(warningHigh),
    critical_freq_lower: parseFloat(criticalLow),
    critical_freq_upper: parseFloat(criticalHigh)
  };
};

//function to convert string to number
const parseNumericValueFromString = (str) => {
  if (typeof str !== 'string') return null;
  // This regular expression finds the first sequence of digits (including decimals)
  const match = str.match(/\d+(\.\d+)?/);

  return match ? parseFloat(match[0]) : null;
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
  const [acceptableRangeVIConfig, setAcceptableRangeVIConfig] = useState({ mode: 'default', percent: 2 });
  const [warningRangeVIConfig, setWarningRangeVIConfig] = useState({ mode: 'default', percent: 2 });
  const [criticalRangeVIConfig, setCriticalRangeVIConfig] = useState({ mode: 'default', percent: 3 });

  //storing initial data
  const [initialData, setInitialData] = useState({});

  //to display error message
  const [formError, setFormError] = useState('');

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

      const initialValues = {};
      currentFormSteps.forEach((step) => {
        step.fields.forEach((field) => {
          if (field.defaultValue !== undefined) {
            initialValues[field.id] = field.defaultValue;
          }
        });
      });

      // Correctly save the initial default values into our state.
      setInitialData(initialValues);

      const initialAcceptable = calculateAcceptableRange(initialData.nominal_ht_voltage, 5);
      const initialWarning = calculateWarningRange(initialData.nominal_ht_voltage, 10);
      const initialCritical = calculateCriticalRange(initialData.nominal_ht_voltage, 10);
      //freq
      const initialFreqThresholds = calculateFrequencyThresholds(initialValues.nominal_frequency);
      const initialAcceptableVImbalance = `≤ 2%`;
      const initialWarningVImbalance = `> 2%`;

      const initialCriticalVImbalance = `> 3%`;

      setFormData({
        ...initialData,
        acceptable_range_display: initialAcceptable.display,
        acceptable_range_lower: initialAcceptable.lower,
        acceptable_range_upper: initialAcceptable.upper,
        warning_threshold_display: initialWarning.display,
        warning_threshold_lower: initialWarning.lower,
        warning_threshold_upper: initialWarning.upper,
        critical_threshold_display: initialCritical.display,
        critical_threshold_lower: initialCritical.lower,
        critical_threshold_upper: initialCritical.upper,
        ...initialFreqThresholds,
        acceptable_range_Vdisplay: initialAcceptableVImbalance,
        warning_threshold_Vdisplay: initialWarningVImbalance,
        critical_threshold_Vdisplay: initialCriticalVImbalance
      });
      setAcceptableRangeConfig({ mode: 'default', percent: 5 });
      setWarningRangeConfig({ mode: 'default', percent: 10 });
      setCriticalRangeConfig({ mode: 'default', percent: 10 });
      setAcceptableRangeVIConfig({ mode: 'default', percent: 2 });
      setWarningRangeVIConfig({ mode: 'default', percent: 2.1 });
      setCriticalRangeVIConfig({ mode: 'default', percent: 3 });

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
        newErrors[field.id] = `${field.label} is required`; // Dynamic message
        isValid = false;
      }
    });

    setErrors(newErrors);

    if (isValid) {
      setFormError(''); // Clear the error message on success
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    } else {
      setFormError('Please fill out all required fields.'); // Set the error message on failure
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleInputChange = useCallback(
    (fieldId, value) => {
      // Find the field's blueprint to check its type
      const field = formSteps[activeStep]?.fields.find((f) => f.id === fieldId);

      // First, we process the value to convert it to a number if needed.
      const processedValue = field?.type === 'number' ? parseFloat(value) || '' : value;

      // Then, we use this processedValue to update our state.
      setFormData((prevData) => {
        const newData = { ...prevData, [fieldId]: processedValue };

        if (fieldId === 'nominal_ht_voltage') {
          const acceptableResult = calculateAcceptableRange(processedValue, acceptableRangeConfig.percent);
          const warningResult = calculateWarningRange(processedValue, warningRangeConfig.percent);
          const criticalResult = calculateCriticalRange(processedValue, criticalRangeConfig.percent);

          newData.acceptable_range_display = acceptableResult.display;
          newData.acceptable_range_lower = acceptableResult.lower;
          newData.acceptable_range_upper = acceptableResult.upper;
          newData.warning_threshold_display = warningResult.display;
          newData.warning_threshold_lower = warningResult.lower;
          newData.warning_threshold_upper = warningResult.upper;
          newData.critical_threshold_display = criticalResult.display;
          newData.critical_threshold_lower = criticalResult.lower;
          newData.critical_threshold_upper = criticalResult.upper;
        } else if (fieldId === 'nominal_frequency') {
          const newFrequencyThresholds = calculateFrequencyThresholds(processedValue);
          return { ...newData, ...newFrequencyThresholds };
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
    [errors, acceptableRangeConfig, warningRangeConfig, criticalRangeConfig, activeStep, formSteps]
  );
  //reset save validate buttons
  const handleReset = () => {
    // 1. Find which fields belong ONLY to the current step.
    const currentStepFields = formSteps[activeStep]?.fields;
    if (!currentStepFields) {
      console.error('Could not find fields for the current step.');
      return;
    }

    // 2. Create a temporary 'updates' object to hold all our changes.
    const updates = {};
    currentStepFields.forEach((field) => {
      if (field.defaultValue !== undefined) {
        updates[field.id] = field.defaultValue;
      }
    });

    // 3. Handle special "domino effects" for specific sections.

    // --- Logic for your "Frequency" section ---
    if (updates.hasOwnProperty('nominal_frequency')) {
      const newFrequencyThresholds = calculateFrequencyThresholds(updates.nominal_frequency);
      Object.assign(updates, newFrequencyThresholds);
    }

    // --- Logic for your "HT Voltage" section ---
    if (updates.hasOwnProperty('nominal_ht_voltage')) {
      const newAcceptable = calculateAcceptableRange(updates.nominal_ht_voltage, 5);
      const newWarning = calculateWarningRange(updates.nominal_ht_voltage, 10);
      const newCritical = calculateCriticalRange(updates.nominal_ht_voltage, 10);
      updates.acceptable_range_display = newAcceptable.display;
      updates.warning_threshold_display = newWarning.display;
      updates.critical_threshold_display = newCritical.display;

      setAcceptableRangeConfig({ mode: 'default', percent: 5 });
      setWarningRangeConfig({ mode: 'default', percent: 10 });
      setCriticalRangeConfig({ mode: 'default', percent: 10 });
    }

    // --- Logic for your "Voltage Imbalance" section ---
    if (updates.hasOwnProperty('acceptable_range_voltage')) {
      setAcceptableRangeVIConfig({ mode: 'default', percent: 2 });
      setWarningRangeVIConfig({ mode: 'default', percent: 2 });
      setCriticalRangeVIConfig({ mode: 'default', percent: 3 });
    }

    // TODO: Add an 'if' block here for your other sections if they have special reset logic.

    // 4. Apply all the collected changes to the form state at once.
    setFormData((prevData) => ({
      ...prevData,
      ...updates
    }));

    console.log(`Successfully reset Section ${activeStep + 1}`);
  };

  {
    /* console.log('Resetting form, clearing nominal voltage.');

    const resetData = { ...initialData };
    resetData.nominal_ht_voltage = '';

    // Recalculate the default/reset states for all ranges
    const initialAcceptable = calculateAcceptableRange(resetData.nominal_ht_voltage, 5);
    const initialWarning = calculateWarningRange(resetData.nominal_ht_voltage, 10);
    const initialCritical = calculateCriticalRange(resetData.nominal_ht_voltage, 10);

    setFormData({
      ...resetData,
      // FIX: Access the .display, .lower, and .upper properties from the returned objects
      acceptable_range_display: initialAcceptable.display,
      acceptable_range_lower: initialAcceptable.lower,
      acceptable_range_upper: initialAcceptable.upper,

      warning_threshold_display: initialWarning.display,
      warning_threshold_lower: initialWarning.lower,
      warning_threshold_upper: initialWarning.upper,

      critical_threshold_display: initialCritical.display,
      critical_threshold_lower: initialCritical.lower,
      critical_threshold_upper: initialCritical.upper
    });

    // Reset the interactive component states to their defaults
    setAcceptableRangeConfig({ mode: 'default', percent: 5 });
    setWarningRangeConfig({ mode: 'default', percent: 10 });
    setCriticalRangeConfig({ mode: 'default', percent: 10 });
    setAcceptableRangeVIConfig({ mode: 'default', percent: 2 });
    setWarningRangeVIConfig({ mode: 'default', percent: 2 });
    setCriticalRangeVIConfig({ mode: 'default', percent: 3 });
  };
  */
  }
  // This function contains all the data cleaning logic in one place.
  const prepareDataForBackend = (data) => {
    // Create a mutable copy to work with
    let cleanData = { ...data };

    // Convert nominal_frequency to a number
    if (cleanData.nominal_frequency) {
      cleanData.nominal_frequency = parseFloat(cleanData.nominal_frequency);
    }

    // Perform conversions from other display strings
    cleanData.acceptable_v_imbalance_percent = parseNumericValueFromString(cleanData.acceptable_range_Vdisplay);
    cleanData.warning_v_imbalance_percent = parseNumericValueFromString(cleanData.warning_threshold_Vdisplay);
    cleanData.critical_v_imbalance_percent = parseNumericValueFromString(cleanData.critical_threshold_Vdisplay);

    // Use destructuring to create the final object, removing all display-only fields
    const {
      acceptable_range_display,
      warning_threshold_display,
      critical_threshold_display,
      acceptable_range_Vdisplay,
      warning_threshold_Vdisplay,
      critical_threshold_Vdisplay,
      warning_threshold_freq_display,
      critical_threshold_freq_display,
      ...finalPayload
    } = cleanData;

    return finalPayload;
  };
  const handleSaveDraft = () => {
    // Call the helper to get the clean data
    const draftData = prepareDataForBackend(formData);

    console.log('Saving cleaned draft data:', draftData);
    alert('Draft Saved!');
  };

  const handleValidate = () => {
    console.log('Validating current step...', formData);
    alert('Validation Complete!');
  };

  const handleSubmit = () => {
    // Use the exact same helper for the final submission
    const finalData = prepareDataForBackend(formData);

    console.log('Submitting final form...', finalData);
    alert('Form Submitted!');
  };

  const handleAcceptableRangeModeChange = (mode) => {
    const newPercent = mode === 'default' ? 5 : acceptableRangeConfig.percent;
    setAcceptableRangeConfig({ mode, percent: newPercent });
    const newRange = calculateAcceptableRange(formData.nominal_ht_voltage, newPercent);
    setFormData((prevData) => ({
      ...prevData,
      acceptable_range_display: newRange.display,
      acceptable_range_lower: newRange.lower,
      acceptable_range_upper: newRange.upper
    }));
  };

  const handleAcceptablePercentInputChange = (event, min, max) => {
    let value = event.target.value;
    let numericValue = value === '' ? '' : parseFloat(value);
    if (numericValue > max) numericValue = max;
    if (numericValue < min) numericValue = min;
    setAcceptableRangeConfig({ mode: 'custom', percent: numericValue });
    const newRange = calculateAcceptableRange(formData.nominal_ht_voltage, numericValue);
    setFormData((prevData) => ({
      ...prevData,
      acceptable_range_display: newRange.display,
      acceptable_range_lower: newRange.lower,
      acceptable_range_upper: newRange.upper
    }));
  };

  const handleWarningRangeModeChange = (mode) => {
    const newPercent = mode === 'default' ? 10 : warningRangeConfig.percent;
    setWarningRangeConfig({ mode, percent: newPercent });
    const newRange = calculateWarningRange(formData.nominal_ht_voltage, newPercent);
    setFormData((prevData) => ({
      ...prevData,
      warning_threshold_display: newRange.display,
      warning_threshold_lower: newRange.lower,
      warning_threshold_upper: newRange.upper
    }));
  };
  const handleWarningPercentInputChange = (event, min, max) => {
    let value = event.target.value;
    let numericValue = value === '' ? '' : parseFloat(value);
    if (numericValue > max) numericValue = max;
    if (numericValue < min) numericValue = min;
    setWarningRangeConfig({ mode: 'custom', percent: numericValue });
    const newRange = calculateWarningRange(formData.nominal_ht_voltage, numericValue);
    setFormData((prevData) => ({
      ...prevData,
      warning_threshold_display: newRange.display,
      warning_threshold_lower: newRange.lower,
      warning_threshold_upper: newRange.upper
    }));
  };
  const handleCriticalRangeModeChange = (mode) => {
    const newPercent = mode === 'default' ? 10 : criticalRangeConfig.percent;
    setCriticalRangeConfig({ mode, percent: newPercent });
    const newRange = calculateCriticalRange(formData.nominal_ht_voltage, newPercent);
    setFormData((prevData) => ({
      ...prevData,
      critical_threshold_display: newRange.display,
      critical_threshold_lower: newRange.lower,
      critical_threshold_upper: newRange.upper
    }));
  };
  const handleCriticalPercentInputChange = (event, min, max) => {
    let value = event.target.value;
    let numericValue = value === '' ? '' : parseFloat(value);
    if (numericValue > max) numericValue = max;
    if (numericValue < min) numericValue = min;
    setCriticalRangeConfig({ mode: 'custom', percent: numericValue });
    const newRange = calculateCriticalRange(formData.nominal_ht_voltage, numericValue);
    setFormData((prevData) => ({
      ...prevData,
      critical_threshold_display: newRange.display,
      critical_threshold_lower: newRange.lower,
      critical_threshold_upper: newRange.upper
    }));
  };
  const handleAcceptableRangeVIModeChange = (mode) => {
    const newPercent = mode === 'default' ? 2 : acceptableRangeVIConfig.percent;
    setAcceptableRangeVIConfig({ mode, percent: newPercent });
    setFormData((prev) => ({ ...prev, acceptable_range_Vdisplay: `≤ ${newPercent}%` }));
  };

  const handleAcceptableRangeVIInputChange = (event, min, max) => {
    let value = event.target.value;
    let numericValue = value === '' ? '' : parseFloat(value);
    if (numericValue > max) numericValue = max;
    if (numericValue < min) numericValue = min;
    setAcceptableRangeVIConfig({ mode: 'custom', percent: numericValue });
    setFormData((prev) => ({ ...prev, acceptable_range_Vdisplay: `≤ ${numericValue}%` }));
  };
  const handleWarningRangeVIModeChange = (mode) => {
    const newPercent = mode === 'default' ? 2 : warningRangeVIConfig.percent;
    setWarningRangeVIConfig({ mode, percent: newPercent });
    setFormData((prev) => ({ ...prev, warning_threshold_Vdisplay: `> ${newPercent}%` }));
  };

  const handleWarningRangeVIInputChange = (event, min, max) => {
    let value = event.target.value;
    let numericValue = value === '' ? '' : parseFloat(value);
    if (numericValue > max) numericValue = max;
    if (numericValue < min) numericValue = min;
    setWarningRangeVIConfig({ mode: 'custom', percent: numericValue });
    setFormData((prev) => ({ ...prev, warning_threshold_Vdisplay: `> ${numericValue}%` }));
  };

  const handleCriticalRangeVIModeChange = (mode) => {
    const newPercent = mode === 'default' ? 3 : criticalRangeVIConfig.percent;
    setCriticalRangeVIConfig({ mode, percent: newPercent });
    setFormData((prev) => ({ ...prev, critical_threshold_Vdisplay: `> ${newPercent}%` }));
  };

  const handleCriticalRangeVIInputChange = (event, min, max) => {
    let value = event.target.value;
    let numericValue = value === '' ? '' : parseFloat(value);
    if (numericValue > max) numericValue = max;
    if (numericValue < min) numericValue = min;
    setCriticalRangeVIConfig({ mode: 'custom', percent: numericValue });
    setFormData((prev) => ({ ...prev, critical_threshold_Vdisplay: `> ${numericValue}%` }));
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
        } else if (field.id === 'critical_threshold_config') {
          config = criticalRangeConfig;
          handleModeChange = handleCriticalRangeModeChange;
          handleInputChange = handleCriticalPercentInputChange;
        } else if (field.id === 'acceptable_range_voltage') {
          config = acceptableRangeVIConfig;
          handleModeChange = handleAcceptableRangeVIModeChange;
          handleInputChange = handleAcceptableRangeVIInputChange;
        } else if (field.id === 'warning_threshold_VIconfig') {
          config = warningRangeVIConfig;
          handleModeChange = handleWarningRangeVIModeChange;
          handleInputChange = handleWarningRangeVIInputChange;
        } else {
          config = criticalRangeVIConfig;
          handleModeChange = handleCriticalRangeVIModeChange;
          handleInputChange = handleCriticalRangeVIInputChange;
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
                  {field.buttonLabel || `Value (±${field.defaultPercent}%)`}
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
              <Box>
                <ButtonGroup variant="outlined" fullWidth>
                  {field.options.map((option) => (
                    <Button
                      key={option.value}
                      variant={value === option.value ? 'contained' : 'outlined'}
                      onClick={() => handleInputChange(field.id, option.value)}
                    >
                      {option.label}
                    </Button>
                  ))}
                </ButtonGroup>
                {/* This is the new error message, which only appears if an error exists for this field */}
                {errors[field.id] && (
                  <Typography color="error" variant="caption" sx={{ mt: 1 }}>
                    {errors[field.id]}
                  </Typography>
                )}
              </Box>
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
      case 'display':
        return (
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={5}>
              <Typography variant="body1" sx={{ fontWeight: 'medium' }}>
                {field.label}
              </Typography>
            </Grid>
            <Grid item xs={12} sm={7}>
              <Typography variant="body1">{formData[field.id]}</Typography>
            </Grid>
          </Grid>
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

      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4, alignItems: 'center' }}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button variant="outlined" color="secondary" onClick={handleReset}>
            Reset
          </Button>
          <Button variant="outlined" color="primary" onClick={handleSaveDraft}>
            Save Draft
          </Button>
        </Box>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {/* This is the new error message, which only appears if `formError` has text */}
          {formError && (
            <Typography color="error" variant="body2">
              {formError}
            </Typography>
          )}

          {activeStep > 0 && (
            <Button color="inherit" onClick={handleBack}>
              Back
            </Button>
          )}
          <Button variant="outlined" onClick={handleValidate}>
            Validate
          </Button>

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
