import { IconButton } from '@mui/material';
import InfoIcon from '@mui/icons-material/Info';

export const getSection6Fields = (onInfoClick) => [
  {
    type: 'header',
    label: 'POWER FACTOR ',
    // This property will render our icon button
    renderAccessory: () => (
      <IconButton onClick={onInfoClick} size="small" color="primary">
        <InfoIcon />
      </IconButton>
    )
  },
  {
    id: 'pf_target',
    label: 'PF Target Level',
    type: 'number',
    defaultValue: '',
    required: true,
    helperText: 'Enter a PF Level from the reference table (e.g., 0.98)',
    rules: [
      {
        type: 'range',
        limits: { min: 0.8, max: 1 },
        message: 'Value must be between 0.8 and 1.0'
      }
    ]
  },
  {
    id: 'pf_range_display',
    label: 'P.F. Range',
    type: 'display', // A read-only field
    defaultValue: 'N/A'
  },
  {
    id: 'pf_rate_display',
    label: 'Resulting Rate',
    type: 'display', // A read-only field
    defaultValue: 'N/A'
  },
  {
    id: 'pf_warning_threshold',
    label: 'Warning Threshold',
    type: 'number',
    defaultValue: '',
    required: true,
    rules: [
      {
        type: 'range',
        limits: { min: 0.8, max: 1 },
        message: 'Value must be between 0.8 and 1.0'
      }
    ]
  },
  {
    id: 'pf_critical_threshold',
    label: 'Critical Threshold',
    type: 'number',
    defaultValue: '',
    required: true,
    rules: [
      // This was likely missing
      {
        type: 'range',
        limits: { min: 0.8, max: 1 },
        message: 'Value must be between 0.8 and 1.0'
      }
    ]
  }
];
