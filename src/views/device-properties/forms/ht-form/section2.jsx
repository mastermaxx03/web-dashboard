export const section2Fields = [
  {
    type: 'header',
    label: 'FREQUENCY'
  },
  {
    id: 'nominal_frequency',
    label: 'Nominal Frequency',
    type: 'button-group',
    options: [
      { label: '50 Hz', value: '50.0' },
      { label: '60 Hz', value: '60.0' }
    ],
    defaultValue: '',
    required: true
  },
  {
    id: 'warning_threshold_freq_display',
    label: 'Warning Thresholds',
    type: 'display',
    defaultValue: '',
    required: true
  },
  {
    id: 'critical_threshold_freq_display',
    label: 'Critical Thresholds',
    type: 'display',
    defaultValue: '',
    required: true
  },
  {
    id: 'warning_max_dev_freq',
    label: 'Warning Max Deviation',
    type: 'button-group',
    options: [{ label: '±1.0 Hz`', value: 1.0 }],
    defaultValue: '',

    required: true
  },
  {
    id: 'critical_max_dev_freq',
    label: 'Critical Max Deviation',
    type: 'button-group',
    options: [{ label: '±1.5 Hz', value: 1.5 }],
    defaultValue: '',

    required: true
  }
];
