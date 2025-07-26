import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid,
  Tabs,
  Tab
} from '@mui/material';

// --- MOCK BACKEND DATA ---
const mockBackendData = {
  'DEV-3': {
    // Example for a Transformer (no tabs)
    formTitle: 'Transformer A Properties',
    fields: [
      { id: 'kva_rating', label: 'KVA Rating', type: 'number', defaultValue: 1500 },
      { id: 'primary_voltage', label: 'Primary Voltage (V)', type: 'text', defaultValue: '11000' },
      // ... (and so on for 50 fields)
      ...Array.from({ length: 48 }, (_, i) => ({
        id: `t_field_${3 + i}`,
        label: `Transformer Field ${3 + i}`,
        type: 'text',
        defaultValue: `Value ${i + 1}`
      }))
    ]
  },
  'DEV-5': {
    // Example for a Feeder (no tabs)
    formTitle: 'Feeder A1 Properties',
    fields: [
      { id: 'cable_size', label: 'Cable Size (sq.mm)', type: 'number', defaultValue: 240 },
      { id: 'cable_material', label: 'Cable Material', type: 'select', defaultValue: 'Aluminum', options: ['Aluminum', 'Copper'] },
      // ... (and so on for 50 fields)
      ...Array.from({ length: 48 }, (_, i) => ({
        id: `f_field_${3 + i}`,
        label: `Feeder Field ${3 + i}`,
        type: 'text',
        defaultValue: `F-Value ${i + 1}`
      }))
    ]
  },
  default: {
    // Fallback for other devices, now with tabs
    formTitle: 'General Device Properties',
    tabs: {
      HT: {
        title: 'High Tension Properties',
        fields: [
          { id: 'ht_voltage', label: 'HT Voltage', type: 'text', defaultValue: '11kV' },
          { id: 'ht_breaker_type', label: 'HT Breaker Type', type: 'select', options: ['VCB', 'SF6'], defaultValue: 'VCB' },
          ...Array.from({ length: 48 }, (_, i) => ({
            id: `ht_field_${3 + i}`,
            label: `HT Field ${3 + i}`,
            type: 'text',
            defaultValue: `HT Val ${i + 1}`
          }))
        ]
      },
      LT: {
        title: 'Low Tension Properties',
        fields: [
          { id: 'lt_voltage', label: 'LT Voltage', type: 'text', defaultValue: '415V' },
          { id: 'lt_breaker_type', label: 'LT Breaker Type', type: 'select', options: ['ACB', 'MCCB'], defaultValue: 'ACB' },
          ...Array.from({ length: 48 }, (_, i) => ({
            id: `lt_field_${3 + i}`,
            label: `LT Field ${3 + i}`,
            type: 'text',
            defaultValue: `LT Val ${i + 1}`
          }))
        ]
      },
      MCC: {
        title: 'Motor Control Center Properties',
        fields: [
          { id: 'mcc_panel_name', label: 'MCC Panel Name', type: 'text', defaultValue: 'MCC-01' },
          { id: 'motor_count', label: 'Number of Motors', type: 'number', defaultValue: 12 },
          ...Array.from({ length: 48 }, (_, i) => ({
            id: `mcc_field_${3 + i}`,
            label: `MCC Field ${3 + i}`,
            type: 'text',
            defaultValue: `MCC Val ${i + 1}`
          }))
        ]
      }
    }
  }
};
// --- END OF MOCK DATA ---

const DevicePropertiesPage = () => {
  const { deviceId } = useParams();

  const [formConfig, setFormConfig] = useState(null);
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [initialData, setInitialData] = useState({});
  const [activeTab, setActiveTab] = useState('main');

  // --- CHANGE START ---
  // 1. New state to manage the submission loading state
  const [isSubmitting, setIsSubmitting] = useState(false);
  // --- CHANGE END ---

  useEffect(() => {
    setIsLoading(true);
    const fetchFormConfig = () => {
      const config = mockBackendData[deviceId] || mockBackendData['default'];
      setFormConfig(config);

      const initialDataForAllTabs = {};

      if (config.tabs) {
        Object.keys(config.tabs).forEach((tabKey) => {
          const tabFields = config.tabs[tabKey].fields;
          const initialTabValues = {};
          tabFields.forEach((field) => {
            initialTabValues[field.id] = field.defaultValue;
          });
          initialDataForAllTabs[tabKey] = initialTabValues;
        });
        setActiveTab('HT');
      } else {
        const initialValues = {};
        config.fields.forEach((field) => {
          initialValues[field.id] = field.defaultValue;
        });
        initialDataForAllTabs['main'] = initialValues;
        setActiveTab('main');
      }

      setFormData(initialDataForAllTabs);
      setInitialData(initialDataForAllTabs);
      setIsLoading(false);
    };

    setTimeout(fetchFormConfig, 500);
  }, [deviceId]);

  const handleInputChange = (fieldId, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [activeTab]: {
        ...prevData[activeTab],
        [fieldId]: value
      }
    }));
  };

  const handleReset = () => {
    const clearedTabData = {};
    Object.keys(formData[activeTab]).forEach((key) => {
      clearedTabData[key] = '';
    });
    setFormData((prevData) => ({
      ...prevData,
      [activeTab]: clearedTabData
    }));
  };

  // --- CHANGE START ---
  // 2. Updated submission handlers to use the new loading state
  const handleSaveDraft = () => {
    console.log('Saving draft to backend:', { deviceId, ...formData });
    setIsSubmitting(true);
    // Simulate a network request
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Draft saved! (Check the console for the submitted data)');
    }, 1500); // 1.5 second delay
  };

  const handleSubmit = () => {
    console.log('Submitting final data to backend:', { deviceId, ...formData });
    setIsSubmitting(true);
    // Simulate a network request
    setTimeout(() => {
      setIsSubmitting(false);
      alert('Data submitted! (Check the console for the submitted data)');
    }, 1500); // 1.5 second delay
  };
  // --- CHANGE END ---

  const renderField = (field) => {
    const value = formData[activeTab]?.[field.id] || '';

    switch (field.type) {
      case 'select':
        return (
          <FormControl fullWidth key={field.id}>
            <InputLabel>{field.label}</InputLabel>
            <Select label={field.label} value={value} onChange={(e) => handleInputChange(field.id, e.target.value)}>
              {field.options.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        );
      case 'date':
        return (
          <TextField
            key={field.id}
            type="date"
            label={field.label}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            fullWidth
            InputLabelProps={{ shrink: true }}
          />
        );
      case 'number':
      case 'text':
      default:
        return (
          <TextField
            key={field.id}
            type={field.type}
            label={field.label}
            value={value}
            onChange={(e) => handleInputChange(field.id, e.target.value)}
            fullWidth
          />
        );
    }
  };

  if (isLoading || !formConfig) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <CircularProgress />
      </Box>
    );
  }

  const fieldsToRender = formConfig.tabs ? formConfig.tabs[activeTab].fields : formConfig.fields;

  return (
    <Paper sx={{ p: 3, m: 2 }}>
      <Typography variant="h4" gutterBottom>
        {formConfig.formTitle}
      </Typography>
      <Typography variant="h6" color="text.secondary" gutterBottom>
        Device ID: {deviceId}
      </Typography>

      {formConfig.tabs && (
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs value={activeTab} onChange={(event, newValue) => setActiveTab(newValue)}>
            <Tab label="HT" value="HT" />
            <Tab label="LT" value="LT" />
            <Tab label="MCC" value="MCC" />
          </Tabs>
        </Box>
      )}

      <Box component="form" noValidate autoComplete="off">
        <Grid container spacing={3}>
          {fieldsToRender.map((field) => (
            <Grid item xs={12} sm={6} key={field.id}>
              {renderField(field)}
            </Grid>
          ))}
        </Grid>

        {/* --- CHANGE START --- */}
        {/* 3. Buttons are now disabled during submission and the Submit button shows a loader */}
        <Box sx={{ mt: 4, display: 'flex', gap: 2 }}>
          <Button variant="outlined" color="secondary" onClick={handleReset} disabled={isSubmitting}>
            Reset
          </Button>
          <Button variant="outlined" color="primary" onClick={handleSaveDraft} disabled={isSubmitting}>
            Save Draft
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            disabled={isSubmitting}
            startIcon={isSubmitting ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </Button>
        </Box>
        {/* --- CHANGE END --- */}
      </Box>
    </Paper>
  );
};

export default DevicePropertiesPage;
