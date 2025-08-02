// This file defines ONLY the fields for Section 2 of the HT Form.

export const section2Fields = [
  {
    type: 'header',
    label: 'FREQUENCY'
  },
  {
    id: 'nominal_frequency',
    label: 'Nominal Frequency',
    type: 'button-group',
    options: ['50.0 Hz', '60.0 Hz'],
    defaultValue: '50.0 Hz',
    required: true
  },
  {
    id: 'warning_threshold_freq',
    label: 'Warning Thresholds',
    type: 'display',
    defaultValue: ''
  },
  {
    id: 'critical_threshold_freq',
    label: 'Critical Thresholds',
    type: 'display',
    defaultValue: ''
  },
  {
    id: 'warning_max_dev_freq',
    label: 'Warning Max Deviation',
    type: 'display',
    defaultValue: ''
  },
  {
    id: 'critical_max_dev_freq',
    label: 'Critical Max Deviation',
    type: 'display',
    defaultValue: ''
  },
  {
    id: 'alert_behaviour_toggle_freq',
    label: 'Toggle for Alert Behaviour',
    type: 'switch',
    defaultValue: true
  }
];
