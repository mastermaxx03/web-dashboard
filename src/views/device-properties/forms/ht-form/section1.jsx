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
    options: ['11kV', '22kV', '33kV'],
    defaultValue: '11kV',
    required: true
  },
  {
    id: 'acceptable_range_config',
    label: 'Acceptable Range',
    type: 'range-selector',
    defaultPercent: 5,
    sliderMin: 2.5,
    sliderMax: 7.5,
    sliderStep: 0.1,
    displayFieldId: 'acceptable_range_display'
  },
  { id: 'acceptable_range_display', type: 'hidden' },
  {
    id: 'warning_threshold_config',
    label: 'Warning Thresholds',
    type: 'range-selector',
    defaultPercent: 10, // Default is now 10%
    sliderMin: 7.6, // Example min/max
    sliderMax: 15.0,
    sliderStep: 0.1,
    displayFieldId: 'warning_threshold_display'
  },
  { id: 'warning_threshold_display', type: 'hidden' },
  {
    id: 'critical_threshold_config',
    label: 'Critical Threshold',
    type: 'range-selector',
    defaultPercent: 10,
    sliderMin: 5,
    sliderMax: 15,
    sliderStep: 0.1,
    displayFieldId: 'critical_threshold_display'
  },
  { id: 'critical_theshold_display', type: 'hidden' }
];
