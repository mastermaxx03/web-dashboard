export const section3Fields = [
  {
    type: 'header',
    label: 'Current Configuration'
  },
  {
    id: 'pt-primary',
    label: 'PT Primary(kV)',
    type: 'number',
    defaultValue: ''
  },
  {
    id: 'pt-secondary',
    label: 'PT Secondary(V)',
    type: 'number',
    defaultValue: ''
  },
  {
    type: 'header',
    label: '3PH HT LOAD CURRENT'
  },

  {
    type: 'header',
    label: 'R Phase'
  },

  {
    id: 'r_phase_primary_current',
    label: 'CT PRIMARY CURRENT',
    type: 'number',
    unit: 'A',
    defaultValue: 11,
    required: true
  },
  {
    id: 'r_phase_secondary_current',
    label: 'CT SECONDARY CURRENT',
    type: 'number',
    unit: 'A',
    defaultValue: 12,
    required: true
  },

  {
    type: 'header',
    label: 'Y Phase'
  },

  {
    id: 'y_phase_primary_current',
    label: 'CT PRIMARY CURRENT',
    type: 'number',
    unit: 'A',
    defaultValue: 21,
    required: true
  },
  {
    id: 'y_phase_secondary_current',
    label: 'CT SECONDARY CURRENT',
    type: 'number',
    unit: 'A',
    defaultValue: 22,
    required: true
  },

  {
    type: 'header',
    label: 'B Phase'
  },

  {
    id: 'b_phase_primary_current',
    label: 'CT PRIMARY CURRENT',
    type: 'number',
    unit: 'A',
    defaultValue: 24,
    required: true
  },
  {
    id: 'b_phase_secondary_current',
    label: 'CT SECONDARY CURRENT',
    type: 'number',
    unit: 'A',
    defaultValue: 25,
    required: true
  },
  {
    type: 'header',
    label: ''
  },
  {
    id: 'total_panel_rated_current_display',
    label: 'TOTAL PANEL RATED CURRENT',
    type: 'display',
    defaultValue: '0 A' // This will be auto-calculated
  },

  {
    id: 'cb_image_upload',
    label: 'Upload Image of Circuit Breaker (JPEG/PNG)',
    type: 'file',
    accept: 'image/jpeg, image/png'
  },
  {
    id: 'lt_cb_type',
    label: 'Type of LT CB',
    type: 'text',
    defaultValue: ''
  },
  {
    id: 'cb_make_model',
    label: 'CB Make & Model No',
    type: 'text',
    defaultValue: ''
  },
  {
    id: 'cb_rated_current_in',
    label: 'Circuit Breaker - In (Rated Current)',
    type: 'number',
    unit: 'A',
    defaultValue: 22,
    required: true
  },
  {
    label: 'Circuit Breaker – Ir Setting (0-100)',
    type: 'number',
    defaultValue: 23,
    required: true,
    min: 0,
    max: 100,
    step: 1
  },
  {
    // This new field will display the calculated result
    id: 'cb_ir_setting_decimal',
    label: 'Calculated Multiplication Factor',
    type: 'display',
    defaultValue: '0.67'
  },
  {
    id: 'cb_ir_long_time_setting',
    label: 'Circuit Breaker - Ir (Long-Time/Continuous Setting Current)',
    type: 'display',
    defaultValue: '0 A' // Default value
  },
  {
    id: 'default_warning_threshold_current',
    label: 'Default Warning Threshold',
    type: 'button-group',
    options: [
      { label: '(80 – 85) % of Ir', value: '80-85' },
      { label: '(86 – 90) % of Ir', value: '86-90' }
    ],
    defaultValue: '80-85',
    required: true
  },
  // 2. Added the new button group for the Critical Threshold.
  {
    id: 'default_critical_threshold_current',
    label: 'Default Critical Threshold',
    type: 'button-group',
    options: [
      { label: '(91 – 94) % of Ir', value: '91-94' },
      { label: '(95 – 98) % of Ir', value: '95-98' }
    ],
    defaultValue: '91-94',
    required: true
  },
  {
    type: 'header',
    label: 'HT Current Imbalance %'
  },
  {
    id: 'current_imbalance_warning_config', // New, descriptive ID
    label: 'Default Warning Threshold',
    type: 'range-selector', // Changed type
    buttonLabel: '10%',
    defaultPercent: 10,
    sliderMin: 5, // Example range
    sliderMax: 15,
    sliderStep: 0.5,
    displayFieldId: 'current_imbalance_warning_display'
  },
  { id: 'current_imbalance_warning_display', type: 'hidden' },

  {
    id: 'current_imbalance_critical_config', // New, descriptive ID
    label: 'Default Critical Threshold',
    type: 'range-selector', // Changed type
    buttonLabel: '20%',
    defaultPercent: 20,
    sliderMin: 15.1, // Example range
    sliderMax: 30,
    sliderStep: 0.5,
    displayFieldId: 'current_imbalance_critical_display'
  },
  { id: 'current_imbalance_critical_display', type: 'hidden' }
  // --- CHANGE END ---
];
