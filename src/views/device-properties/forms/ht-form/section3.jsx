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
    defaultValue: '',
    required: true
  },
  {
    id: 'r_phase_secondary_current',
    label: 'CT SECONDARY CURRENT',
    type: 'number',
    unit: 'A',
    defaultValue: '',
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
    defaultValue: '',
    required: true
  },
  {
    id: 'y_phase_secondary_current',
    label: 'CT SECONDARY CURRENT',
    type: 'number',
    unit: 'A',
    defaultValue: '',
    required: true
  },

  {
    type: 'header',
    label: 'B Phase'
  },

  {
    id: 'b_phase_secondary_current',
    label: 'CT SECONDARY CURRENT',
    type: 'number',
    unit: 'A',
    defaultValue: '',
    required: true
  },
  {
    id: 'b_phase_secondary_current',
    label: 'CT SECONDARY CURRENT',
    type: 'number',
    unit: 'A',
    defaultValue: '',
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
    defaultValue: '',
    required: true
  },
  {
    id: 'cb_ir_setting',
    label: 'Circuit Breaker – Ir Setting @',
    type: 'number',

    defaultValue: 0,

    min: 0,
    max: 1,
    step: 0.1,
    required: true
  }
];
