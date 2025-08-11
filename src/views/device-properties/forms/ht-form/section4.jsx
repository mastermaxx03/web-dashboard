export const section4Fields = [
  {
    type: 'header',
    label: 'Rated HT Power'
  },
  {
    id: 'r_phase_rated_power',
    label: 'R_PHASE RATED POWER',
    type: 'number',
    unit: 'KVA',
    defaultValue: 11,
    required: true
  },
  {
    id: 'y_phase_rated_power',
    label: 'Y_PHASE RATED POWER',
    type: 'number',
    unit: 'KVA',
    defaultValue: 12,
    min: 0,
    required: true
  },
  {
    id: 'b_phase_rated_power',
    label: 'B_PHASE RATED POWER',
    type: 'number',
    unit: 'KVA',
    defaultValue: 21,
    min: 0,
    required: true
  },
  {
    id: 'total_rated_power_display',
    label: 'TOTAL RATED POWER',
    type: 'display',
    unit: 'KVA',
    min: 0,
    defaultValue: 0
  },
  {
    id: 'power_threshold_acceptable_display', // Changed from 'acceptable_range_display'
    label: 'Acceptable Power Range',
    type: 'display',
    defaultValue: 'N/A'
  },
  {
    id: 'power_threshold_warning_display', // Changed from 'warning_range_display'
    label: 'Warning Power Range',
    type: 'display',
    defaultValue: 'N/A'
  },
  {
    id: 'power_threshold_critical_display', // Changed from 'critical_range_display'
    label: 'Critical Power Range',
    type: 'display',
    defaultValue: 'N/A'
  }
];
