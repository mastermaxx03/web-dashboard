// This file defines ONLY the fields for Section 1 of the HT Form.

export const section1Fields = [
  {
    id: 'panel_name',
    label: 'Name of HT Panel',
    type: 'text',
    defaultValue: '',
    required: true // This field is mandatory
  },
  {
    id: 'panel_id',
    label: 'Panel ID',
    type: 'text',
    defaultValue: '',
    required: true // This field is mandatory
  },
  {
    id: 'panel_rating_details',
    label: 'Panel Rating Details',
    type: 'textarea',
    defaultValue: ''
  },
  {
    id: 'panel_image_upload',
    label: 'Upload Image of Panel (JPEG/PNG)',
    type: 'file',
    accept: 'image/jpeg, image/png'
  },
  {
    id: 'panel_spec_pdf',
    label: 'Optional: Upload Panel Specifications PDF',
    type: 'file',
    accept: '.pdf'
  },
  {
    type: 'header',
    label: '3PH L-L VOLTAGES'
  },
  {
    id: 'nominal_ht_voltage',
    label: 'Nominal HT Voltage',
    type: 'button-group',
    options: [
      { label: '11 kV', value: 11 },
      { label: '22 kV', value: 22 },
      { label: '33 kV', value: 33 }
    ],
    defaultValue: '11',
    required: true
  },
  {
    id: 'acceptable_range_config',
    label: 'Acceptable Range',
    type: 'range-selector',
    buttonLabel: 'Upto 5%',
    defaultPercent: 5,
    sliderMin: 2.5,
    sliderMax: 7.5,
    sliderStep: 0.1,
    displayFieldId: 'acceptable_range_display',
    lowerBoundFieldId: 'acceptable_range_lower',
    upperBoundFieldId: 'acceptable_range_upper'
  },
  { id: 'acceptable_range_display', type: 'hidden' },
  {
    id: 'warning_threshold_config',
    label: 'Warning Thresholds',
    type: 'range-selector',
    // --- CHANGE START ---
    // 1. Added a new label for our single default button.
    buttonLabel: 'Between 5% and 10%',
    // We still need a default percentage for the initial state of the input field.
    defaultPercent: 10,
    // --- CHANGE END ---
    sliderMin: 2.5,
    sliderMax: 12.5,
    sliderStep: 0.1,
    displayFieldId: 'warning_threshold_display',
    lowerBoundFieldId: 'warning_threshold_lower',
    upperBoundFieldId: 'warning_threshold_upper'
  },
  { id: 'warning_threshold_display', type: 'hidden' },
  {
    id: 'critical_threshold_config',
    label: 'Critical Threshold',
    type: 'range-selector',
    buttonLabel: 'More than 10%',
    defaultPercent: 10,
    sliderMin: 7.5,
    sliderMax: 15,
    sliderStep: 0.1,
    displayFieldId: 'critical_threshold_display',
    lowerBoundFieldId: 'critical_threshold_lower',
    upperBoundFieldId: 'critical_threshold_upper'
  },
  { id: 'critical_threshold_display', type: 'hidden' },
  {
    id: 'aux_dc_voltage',
    label: 'Auxiliary DC Power Supply Voltage (Volts DC)',
    type: 'number',
    // --- CHANGE START ---
    defaultValue: '' // Corrected from `default`
    // --- CHANGE END ---
  },
  {
    id: 'battery_capacity',
    label: 'Rated Ampere-Hour Combined Battery Capacity',
    type: 'number',
    // --- CHANGE START ---
    defaultValue: '' // Corrected from `default`
    // --- CHANGE END ---
  },
  {
    type: 'header',
    label: 'Phase Imbalance'
  },
  {
    id: 'acceptable_range_voltage',
    label: 'Acceptable Range',
    type: 'range-selector',
    buttonLabel: ' Voltage Imbalance <= 2% ',
    defaultPercent: 2,
    sliderMin: 0,
    sliderMax: 2,
    sliderStep: 0.1,
    displayFieldId: 'acceptable_range_Vdisplay'
  },
  {
    id: 'acceptable_range_Vdisplay',
    type: 'hidden'
  },
  {
    id: 'warning_threshold_VIconfig',
    label: 'Warning Threshold',
    type: 'range-selector',
    buttonLabel: 'Voltage Imbalance > 2%',
    defaultPercent: 2,
    sliderMin: 2,
    sliderMax: 3,
    sliderStep: 0.1,
    displayFieldId: 'warning_threshold_Vdisplay'
  },
  {
    id: 'warning_threshold_Vdisplay',
    type: 'hidden'
  },
  {
    id: 'critical_threshold_VIconfig',
    label: 'Critical Threshold',
    type: 'range-selector',
    buttonLabel: 'Voltage Imbalance > 3%',
    defaultPercent: 3,
    sliderMin: 3,
    sliderMax: 10,
    sliderStep: 0.1,
    displayFieldId: 'critical_threshold_Vdisplay'
  },
  {
    id: 'critical_threshold_Vdisplay',
    type: 'hidden'
  }
];
