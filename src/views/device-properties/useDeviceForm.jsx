import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { htFormSteps } from './forms/ht-form';

// --- FORM BLUEPRINTS & HELPERS ---
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
// --- END OF HELPERS ---

// This is our custom hook. It contains all the "brainpower" for the form.
export const useDeviceForm = () => {
  const { deviceId } = useParams();
  const [activeStep, setActiveStep] = useState(0);
  const [formSteps, setFormSteps] = useState([]);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [errors, setErrors] = useState({});

  // State for each of our interactive range selectors
  const [acceptableRangeConfig, setAcceptableRangeConfig] = useState({ mode: 'default', percent: 5 });
  const [warningRangeConfig, setWarningRangeConfig] = useState({ mode: 'default', percent: 10 });
  const [criticalRangeConfig, setCriticalRangeConfig] = useState({ mode: 'default', percent: 15 });

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

      // On load, calculate the initial values for ALL range selectors.
      const initialAcceptable = calculateAcceptableRange(initialData.nominal_ht_voltage, 5);
      const initialWarning = calculateWarningRange(initialData.nominal_ht_voltage, 10);
      const initialCritical = calculateCriticalRange(initialData.nominal_ht_voltage, 15);
      setFormData({
        ...initialData,
        acceptable_range_display: initialAcceptable,
        warning_threshold_display: initialWarning,
        critical_threshold_display: initialCritical
      });
      setAcceptableRangeConfig({ mode: 'default', percent: 5 });
      setWarningRangeConfig({ mode: 'default', percent: 10 });
      setCriticalRangeConfig({ mode: 'default', percent: 15 });

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
          const criticalPercent = criticalRangeConfig.mode === 'default' ? 15 : criticalRangeConfig.percent;
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
    [errors, acceptableRangeConfig, warningRangeConfig, criticalRangeConfig]
  );

  // Handlers for Acceptable Range
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

  // Handlers for Warning Range
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

  // Handlers for Critical Range
  const handleCriticalRangeModeChange = (mode) => {
    const newPercent = mode === 'default' ? 15 : criticalRangeConfig.percent;
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
    setFormData((prevData) => ({ ...prevData, critical_threshold_display: newRange }));
  };

  // The hook returns an object containing everything the UI component needs.
  return {
    deviceId,
    activeStep,
    formSteps,
    formData,
    isLoading,
    errors,
    acceptableRangeConfig,
    warningRangeConfig,
    criticalRangeConfig,
    handleNext,
    handleBack,
    handleInputChange,
    handleAcceptableRangeModeChange,
    handleAcceptablePercentInputChange,
    handleWarningRangeModeChange,
    handleWarningPercentInputChange,
    handleCriticalRangeModeChange,
    handleCriticalPercentInputChange
  };
};
