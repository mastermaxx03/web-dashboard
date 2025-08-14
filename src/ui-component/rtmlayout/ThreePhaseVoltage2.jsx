import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Layer, BarChart, Bar, XAxis, YAxis, LabelList } from 'recharts';
import { Maximize, RefreshCw, Settings, Download, Calendar } from 'lucide-react';

// --- Component Styles ---
const styles = {
  card: {
    backgroundColor: '#FFFFFF',
    border: '1px solid #E0E0E0',
    borderRadius: '12px',
    padding: '24px',
    width: '100%',
    maxWidth: '900px',
    fontFamily: 'Roboto, sans-serif',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    color: '#333',
    borderBottom: '1px solid #EEE',
    paddingBottom: '16px'
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: '600'
  },
  headerControls: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  dateDisplay: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    backgroundColor: '#F4F6F8',
    padding: '6px 12px',
    borderRadius: '8px',
    fontSize: '0.875rem',
    fontWeight: '500'
  },
  iconButton: {
    cursor: 'pointer',
    color: '#555'
  },
  mainContent: {
    display: 'flex',
    gap: '32px'
  },
  leftColumn: {
    width: '50%',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  rightColumn: {
    width: '50%',
    display: 'flex',
    flexDirection: 'column',
    gap: '24px'
  },
  chartContainer: {
    width: '100%',
    height: '250px'
  },
  barChartContainer: {
    width: '100%',
    height: '60px'
  },
  table: {
    width: '100%',
    borderCollapse: 'collapse'
  },
  tableCell: {
    border: '1px solid #E0E0E0',
    padding: '8px 12px',
    fontSize: '0.875rem',
    textAlign: 'left'
  },
  tableHeader: {
    fontWeight: '600',
    backgroundColor: '#F9F9F9'
  }
};

// --- Initial Data & Configuration ---
const initialPhasorData = [
  { name: 'VRY', value: 100.32, color: 'rgba(255, 82, 82, 0.8)', startAngle: 90, endAngle: -30 },
  { name: 'VYB', value: 440.12, color: 'rgba(255, 206, 86, 0.8)', startAngle: -30, endAngle: -150 },
  { name: 'VBR', value: 500.17, color: 'rgba(54, 162, 235, 0.8)', startAngle: -150, endAngle: -270 }
];

const initialBarData = [
  { name: 'Max Dev', value: 99.92, unit: 'V', fill: 'url(#colorMaxdev)', max: 100 },
  { name: 'Voltage Imbalance %', value: 3, unit: '%', fill: 'url(#colorImbalance)', max: 5 },
  { name: 'VAVG', value: 437.72, unit: 'V', fill: 'url(#colorVavg)', max: 500 }
];

// --- Main Component ---
// ID: DB-3PV-01
function ThreePhaseVoltage() {
  const [phasorData, setPhasorData] = useState(initialPhasorData);
  const [barData, setBarData] = useState(initialBarData);

  useEffect(() => {
    const interval = setInterval(() => {
      updateData();
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const updateData = () => {
    const newPhasorData = initialPhasorData.map((item) => ({
      ...item,
      value: parseFloat((250 + Math.random() * 100).toFixed(2)) // Random value between 400-450
    }));

    const newVoltages = newPhasorData.map((d) => d.value);
    const newVavg = newVoltages.reduce((a, b) => a + b, 0) / newVoltages.length;
    const newMaxDev = Math.max(...newVoltages) - Math.min(...newVoltages);
    const newImbalance = (newMaxDev / newVavg) * 100;

    const newBarData = [
      { name: 'Max Dev', value: parseFloat(newMaxDev.toFixed(2)), unit: 'V', fill: 'url(#colorMaxdev)', max: 100 },
      { name: 'Voltage Imbalance %', value: parseFloat(newImbalance.toFixed(2)), unit: '%', fill: 'url(#colorImbalance)', max: 5 },
      { name: 'VAVG', value: parseFloat(newVavg.toFixed(2)), unit: 'V', fill: 'url(#colorVavg)', max: 500 }
    ];

    setPhasorData(newPhasorData);
    setBarData(newBarData);
  };

  const maxVoltage = 500; // The maximum possible voltage for scaling

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <h2 style={styles.title}>3 PHASE VOLTAGE</h2>
        <div style={styles.headerControls}>
          <div style={styles.dateDisplay}>
            <Calendar size={16} />
            <span>Jun 10, 2024</span>
          </div>
          <div style={styles.dateDisplay}>
            <span>9:45</span>
          </div>
          <RefreshCw size={18} style={styles.iconButton} onClick={updateData} />
          <Settings size={18} style={styles.iconButton} />
          <Download size={18} style={styles.iconButton} />
          <Maximize size={18} style={styles.iconButton} />
        </div>
      </div>
      <div style={styles.mainContent}>
        <div style={styles.leftColumn}>
          <div style={styles.chartContainer}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                {/* Background dashed circles using the Layer component */}
                <Layer>
                  <circle cx="50%" cy="50%" r="85%" stroke="red" strokeWidth={1} strokeDasharray="5 5" fill="none" />
                  <circle cx="50%" cy="50%" r="65%" stroke="green" strokeWidth={1} strokeDasharray="5 5" fill="none" />
                </Layer>

                {/* Map over data to create one Pie component per sector */}
                {phasorData.map((d) => (
                  <Pie
                    key={d.name}
                    data={[{ value: 1 }]} // Dummy data, only radius matters
                    dataKey="value"
                    cx="50%"
                    cy="50%"
                    startAngle={d.startAngle}
                    endAngle={d.endAngle}
                    innerRadius={0}
                    outerRadius={`${(d.value / maxVoltage) * 100}%`} // Scale radius based on value
                    fill={d.color}
                    stroke="#fff"
                    strokeWidth={2}
                    isAnimationActive={true}
                    animationDuration={300}
                  />
                ))}
              </PieChart>
            </ResponsiveContainer>
          </div>
          <table style={styles.table}>
            <tbody>
              {phasorData.map((item) => (
                <tr key={item.name}>
                  <td style={{ ...styles.tableCell, ...styles.tableHeader }}>{item.name}</td>
                  <td style={styles.tableCell}>{item.value}V</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div style={styles.rightColumn}>
          {barData.map((item) => (
            <div key={item.name} style={styles.barChartContainer}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={[item]} layout="vertical" margin={{ top: 5, right: 60, left: 20, bottom: 5 }}>
                  <defs>
                    <linearGradient id="colorVavg" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="5%" stopColor="#4CAF50" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#8BC34A" stopOpacity={0.8} />
                    </linearGradient>
                    <linearGradient id="colorImbalance" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="5%" stopColor="#FFC107" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#FFEB3B" stopOpacity={0.8} />
                    </linearGradient>
                    <linearGradient id="colorMaxdev" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="5%" stopColor="#F44336" stopOpacity={0.8} />
                      <stop offset="95%" stopColor="#FF5722" stopOpacity={0.8} />
                    </linearGradient>
                  </defs>
                  <XAxis type="number" hide domain={[0, item.max]} />
                  <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} width={120} />
                  <Bar dataKey="value" barSize={30} radius={[5, 5, 5, 5]} fill={item.fill}>
                    <LabelList dataKey="value" position="right" formatter={(value) => `${value}${item.unit}`} />
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          ))}
          <table style={styles.table}>
            <tbody>
              {barData.map((item) => (
                <tr key={item.name}>
                  <td style={{ ...styles.tableCell, ...styles.tableHeader }}>{item.name}</td>
                  <td style={styles.tableCell}>
                    {item.value}
                    {item.unit}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default ThreePhaseVoltage;
