// This file defines ONLY the fields for Section 1.

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
    type: 'textarea', // Use 'textarea' for a multi-line text box
    defaultValue: ''
  },
  {
    id: 'panel_image_upload',
    label: 'Upload Image of Panel (JPEG/PNG)',
    type: 'file',
    accept: 'image/jpeg, image/png' // Specify accepted file types
  },
  {
    id: 'panel_spec_pdf',
    label: 'Optional: Upload Panel Specifications PDF',
    type: 'file',
    accept: '.pdf' // Specify accepted file types
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
    required: true // This field is mandatory
  },
  {
    id: 'acceptable_range_config',
    label: 'Acceptable Range',
    type: 'range-selector',
    // We define the parameters for our new component here
    defaultPercent: 5,
    sliderMin: 2.5,
    sliderMax: 7.5,
    sliderStep: 0.1,
    // We also need a field to store the final calculated string
    displayFieldId: 'acceptable_range_display'
  },
  // This is a hidden field that will just store the calculated result string
  { id: 'acceptable_range_display', type: 'hidden' }
  // We will add the auto-calculated display fields here later
];
