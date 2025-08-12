// This file defines ONLY the fields for Section 7 of the HT Form.

export const section7Fields = [
  {
    type: 'header',
    label: 'LOCATION'
  },
  {
    id: 'location_building_zone',
    label: 'Location (Building / Zone)',
    type: 'text',
    defaultValue: ''
  },
  {
    id: 'exact_site_location',
    label: 'Exact site location (e.g., Substation-A, Utility Yard)',
    type: 'text',
    defaultValue: ''
  },
  {
    id: 'department_process_served',
    label: 'Department / Process Served',
    type: 'text',
    defaultValue: ''
  },
  {
    type: 'header',
    label: 'INSTALLATION RESPONSIBLE PERSONNEL'
  },
  {
    id: 'planned_install_date',
    label: 'Planned Installation Date',
    type: 'date',
    defaultValue: ''
  },
  {
    id: 'maintenance_schedule',
    label: 'Maintenance Schedule',
    type: 'datetime', // This will render our new DateTimeField component
    defaultValue: ''
  },
  {
    id: 'technician_name',
    label: 'Technician Name',
    type: 'text',
    defaultValue: ''
  },
  {
    id: 'technician_mobile',
    label: 'Technician Mobile Number',
    type: 'text', // Using 'text' to allow for country codes, etc.
    defaultValue: ''
  },
  {
    id: 'supervisor_name_signature',
    label: 'Supervisor Name & Signature',
    type: 'text',
    defaultValue: ''
  },
  {
    type: 'header',
    label: 'EXISTING MFM SETTINGS (ESAI GATEWAY DEVICE)'
  },
  {
    id: 'mfm_brand_name',
    label: 'MFM Brand Name',
    type: 'text',
    defaultValue: ''
  },
  {
    id: 'mfm_model_no',
    label: 'MFM Model No.',
    type: 'text',
    defaultValue: ''
  },
  {
    id: 'modbus_address',
    label: 'Modbus Address (Slave ID)',
    type: 'number',
    defaultValue: ''
  },
  {
    id: 'baud_rate',
    label: 'Baud Rate',
    type: 'number',
    defaultValue: ''
  },
  {
    id: 'parity_stop_bits',
    label: 'Parity / Stop Bits',
    type: 'text',
    defaultValue: ''
  },
  {
    id: 'mfm_wiring_system',
    label: 'MFM Wiring System',
    type: 'text',
    defaultValue: ''
  },
  {
    id: 'pt_primary_v',
    label: 'PT Primary',
    type: 'number',
    unit: 'V',
    defaultValue: ''
  },
  {
    id: 'pt_secondary_v',
    label: 'PT Secondary',
    type: 'number',
    unit: 'V',
    defaultValue: ''
  },
  {
    id: 'ct_primary_a',
    label: 'CT Primary',
    type: 'number',
    unit: 'A',
    defaultValue: ''
  },
  {
    id: 'ct_secondary_a',
    label: 'CT Secondary',
    type: 'number',
    unit: 'A',
    defaultValue: ''
  }
];
