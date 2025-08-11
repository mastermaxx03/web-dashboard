export const section5Fields = [
  {
    type: 'header',
    label: 'BASELINE ENERGY CONSUMPTION'
  },
  {
    id: 'plant_total_energy_consumption',
    label: 'Plant Total Energy Consumption/Hour',
    type: 'number',
    unit: 'kVAh',
    defaultValue: 21,
    required: true,
    min: 0
  },
  {
    id: 'monthly_energy_budget',
    label: 'Average monthly energy budget or baseline (optional)',
    type: 'number',
    unit: 'kVAh',
    defaultValue: '',
    min: 0
  },
  {
    id: 'energy_charges_per_unit',
    label: 'Energy charges per unit',
    type: 'number',
    unit: '₹ /kVAh',
    defaultValue: 21,
    required: true,
    min: 0
  },
  {
    id: 'demand_charge',
    label: 'Demand Charge (Tariff FY 2023-24 for HT I(A) Industry: ₹499)',
    type: 'number',
    unit: '₹ per kVA / month',
    defaultValue: 12,
    required: true,
    min: 0
  },
  {
    id: 'fuel_adjustment_charge',
    label: 'Fuel Adjustment Charge (FAC) (e.g., July 2025: ₹0.30)',
    type: 'number',
    unit: '₹ /kWh',
    defaultValue: 21,
    required: true,
    min: 0
  }
];
