const calculateThresholds = (voltageString) => {
  const nominal = parseInt(voltageString, 10);
  if (isNaN(nominal)) return {};

  const acceptableLower = (nominal * 0.95).toFixed(2);
  const acceptableUpper = (nominal * 1.05).toFixed(2);
  const warningUpper = (nominal * 1.1).toFixed(2);
  const criticalLower = (nominal * 0.9).toFixed(2);

  return {
    acceptable_range: `${acceptableLower} kV to ${acceptableUpper} kV`,
    warning_threshold: `> ${acceptableUpper} kV or < ${acceptableLower} kV`,
    critical_threshold: `> ${warningUpper} kV or < ${criticalLower} kV`
  };
}; //for section 2
const calculateFrequencyThresholds = (frequencyString) => {
  const nominal = parseFloat(frequencyString);
  if (isNaN(nominal)) return {};

  // These calculations are based on the deviations
  const warningLow = (nominal - 0.01 * nominal).toFixed(1);
  const warningHigh = (nominal + 0.01 * nominal).toFixed(1);
  const criticalLow = (nominal - 1.5).toFixed(1);
  const criticalHigh = (nominal + 1.5).toFixed(1);
};

const calculateCurrentThresholds = (r, y, b) => {
  const rPhase = parseFloat(r) || 0;
  const yPhase = parseFloat(y) || 0;
  const bPhase = parseFloat(b) || 0;

  const total = rPhase + yPhase + bPhase;
  const warning = total; // 100%
  const criticalLower = (total * 1.1).toFixed(2); // 110%
  const criticalUpper = (total * 1.2).toFixed(2); // 120%

  return {
    total_panel_rated_current: `${total.toFixed(2)} A`,
    warning_threshold_current: `100% of rated current (${warning.toFixed(2)} A)`,
    critical_threshold_current: `110-120% (${criticalLower}–${criticalUpper} A)`
  };

  return {
    warning_threshold_freq: `${warningLow} Hz (low), ${warningHigh} Hz (high)`,
    critical_threshold_freq: `${criticalLow} Hz (low), ${criticalHigh} Hz (high)`,
    warning_max_dev_freq: `±1.0 Hz`,
    critical_max_dev_freq: `±1.5 Hz`
  };
};
export const htRmuFormSteps = [
  {
    label: 'Section 1',
    fields: [
      { type: 'header', label: 'a. 3PH L-L VOLTAGES ' },
      {
        id: 'nominal_voltage',
        label: 'Nominal L-L Voltage',
        type: 'button-group',
        options: ['11kV', '22kV', '33kV'],
        defaultValue: '11kV'
      },
      { id: 'acceptable_range', label: 'Acceptable Range', type: 'display', defaultValue: '' },
      { id: 'warning_threshold', label: 'Warning Thresholds', type: 'display', defaultValue: '' },
      { id: 'critical_threshold', label: 'Critical Thresholds', type: 'display', defaultValue: '' },
      { type: 'header', label: 'b. VOLTAGE MAXIMUM DEVIATION ' },
      {
        id: 'max_dev_acceptable_toggle',
        label: 'Default - Acceptable Threshold (Voltage imbalance ≤ 2%)',
        type: 'switch',
        defaultValue: true
      },
      { id: 'max_dev_warning_toggle', label: 'Default - Warning Threshold (Voltage imbalance > 2%)', type: 'switch', defaultValue: true },
      { id: 'max_dev_critical_toggle', label: 'Default - Critical Threshold (Voltage imbalance > 3%)', type: 'switch', defaultValue: true }
    ]
  },
  {
    label: 'Section 2',
    fields: [
      { type: 'header', label: 'FREQUENCY ' },
      {
        id: 'nominal_frequency',
        label: 'Nominal Frequency',
        type: 'button-group',
        options: ['50.0 Hz', '60.0 Hz'],
        defaultValue: '50.0 Hz'
      },
      { id: 'warning_threshold_freq', label: 'Warning Thresholds', type: 'display', defaultValue: '' },
      { id: 'critical_threshold_freq', label: 'Critical Thresholds', type: 'display', defaultValue: '' },
      { id: 'warning_max_dev_freq', label: 'Warning Max Deviation', type: 'display', defaultValue: '' },
      { id: 'critical_max_dev_freq', label: 'Critical Max Deviation', type: 'display', defaultValue: '' },
      { id: 'alert_behaviour_toggle', label: 'Toggle for Alert Behaviour', type: 'switch', defaultValue: true }
    ]
  },
  {
    label: 'Section 3',
    fields: [
      { type: 'header', label: '3PH HT LOAD CURRENT' },
      { id: 'r_phase_current', label: 'R_PHASE CURRENT (A)', type: 'number', defaultValue: '' },
      { id: 'y_phase_current', label: 'Y_PHASE CURRENT (A)', type: 'number', defaultValue: '' },
      { id: 'b_phase_current', label: 'B_PHASE CURRENT (A)', type: 'number', defaultValue: '' },
      { id: 'total_panel_rated_current', label: 'Total Panel Rated Current (A)', type: 'display', defaultValue: '0.00 A' },
      {
        id: 'warning_threshold_current',
        label: 'Default Warning Threshold',
        type: 'display',
        defaultValue: '100% of rated current (0.00 A)'
      },
      { id: 'critical_threshold_current', label: 'Default Critical Threshold', type: 'display', defaultValue: '110-120% (0.00–0.00 A)' }
    ]
  },
  {
    label: 'Safety & Maintenance',
    fields: []
  }
];

// We also export the calculation function in case the main component needs it.
export const htRmuThresholdsCalculator = calculateThresholds;
export const htRmuFrequencyCalculator = calculateFrequencyThresholds;
export const htRmuCurrentCalculator = calculateCurrentThresholds;
