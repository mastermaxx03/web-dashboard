//using e charts
// import React, { useState, useEffect } from 'react';
// import ReactECharts from 'echarts-for-react';
// import { Maximize, RefreshCw, Settings, Download, Calendar } from 'lucide-react';

// // --- Component Styles ---
// // (Styles are the same as the Recharts version)
// const styles = {
//   card: {
//     backgroundColor: '#FFFFFF',
//     border: '1px solid #E0E0E0',
//     borderRadius: '12px',
//     padding: '24px',
//     width: '100%',
//     maxWidth: '900px',
//     fontFamily: 'Roboto, sans-serif',
//     boxShadow: '0 4px 12px rgba(0, 0, 0, 0.05)'
//   },
//   header: {
//     display: 'flex',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: '24px',
//     color: '#333',
//     borderBottom: '1px solid #EEE',
//     paddingBottom: '16px'
//   },
//   title: {
//     fontSize: '1.25rem',
//     fontWeight: '600'
//   },
//   headerControls: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '16px'
//   },
//   dateDisplay: {
//     display: 'flex',
//     alignItems: 'center',
//     gap: '8px',
//     backgroundColor: '#F4F6F8',
//     padding: '6px 12px',
//     borderRadius: '8px',
//     fontSize: '0.875rem',
//     fontWeight: '500'
//   },
//   iconButton: {
//     cursor: 'pointer',
//     color: '#555'
//   },
//   mainContent: {
//     display: 'flex',
//     gap: '32px'
//   },
//   leftColumn: {
//     width: '50%',
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '24px'
//   },
//   rightColumn: {
//     width: '50%',
//     display: 'flex',
//     flexDirection: 'column',
//     gap: '24px'
//   },
//   chartContainer: {
//     width: '100%',
//     height: '250px'
//   },
//   barChartContainer: {
//     width: '100%',
//     height: '60px'
//   },
//   table: {
//     width: '100%',
//     borderCollapse: 'collapse'
//   },
//   tableCell: {
//     border: '1px solid #E0E0E0',
//     padding: '8px 12px',
//     fontSize: '0.875rem',
//     textAlign: 'left'
//   },
//   tableHeader: {
//     fontWeight: '600',
//     backgroundColor: '#F9F9F9'
//   }
// };

// // --- Main Component ---
// // ID: DB-3PV-EC-01
// function ThreePhaseVoltageECharts() {
//   const [chartData, setChartData] = useState([
//     { name: 'VRY', value: 435.32, color: 'rgba(255, 82, 82, 0.8)' },
//     { name: 'VYB', value: 440.12, color: 'rgba(255, 206, 86, 0.8)' },
//     { name: 'VBR', value: 438.17, color: 'rgba(54, 162, 235, 0.8)' }
//   ]);

//   // This will hold the bar chart data
//   const [barData, setBarData] = useState([]);

//   useEffect(() => {
//     const interval = setInterval(() => {
//       updateData();
//     }, 3000);
//     return () => clearInterval(interval);
//   }, []);

//   const updateData = () => {
//     const newChartData = chartData.map((item) => ({
//       ...item,
//       value: parseFloat((350 + Math.random() * 100).toFixed(2))
//     }));
//     setChartData(newChartData);
//   };

//   // Calculate bar data whenever chartData changes
//   useEffect(() => {
//     const newVoltages = chartData.map((d) => d.value);
//     const newVavg = newVoltages.reduce((a, b) => a + b, 0) / newVoltages.length;
//     const newMaxDev = Math.max(...newVoltages) - Math.min(...newVoltages);
//     const newImbalance = (newMaxDev / newVavg) * 100;

//     setBarData([
//       { name: 'Max Dev', value: parseFloat(newMaxDev.toFixed(2)), unit: 'V' },
//       { name: 'Voltage Imbalance %', value: parseFloat(newImbalance.toFixed(2)), unit: '%' },
//       { name: 'VAVG', value: parseFloat(newVavg.toFixed(2)), unit: 'V' }
//     ]);
//   }, [chartData]);

//   const getPhasorChartOption = () => ({
//     polar: {
//       radius: [0, '85%'] // Correctly starts from the center (0)
//     },
//     angleAxis: {
//       type: 'category',
//       data: chartData.map((d) => d.name),
//       axisLine: { show: false },
//       axisTick: { show: false },
//       axisLabel: { show: false }
//     },
//     radiusAxis: {
//       type: 'value',
//       min: 0,
//       max: 500, // Max voltage
//       axisLine: { show: false },
//       axisTick: { show: false },
//       axisLabel: { show: false },
//       splitLine: { show: false }
//     },
//     series: [
//       {
//         type: 'bar',
//         data: chartData.map((d) => ({
//           value: d.value,
//           itemStyle: { color: d.color }
//         })),
//         coordinateSystem: 'polar',
//         barWidth: '100%',
//         itemStyle: {
//           borderColor: 'white',
//           borderWidth: 2
//         }
//       }
//     ]
//   });

//   return (
//     <div style={styles.card}>
//       <div style={styles.header}>
//         <h2 style={styles.title}>3 PHASE VOLTAGE (ECharts)</h2>
//         {/* Header controls remain the same */}
//       </div>
//       <div style={styles.mainContent}>
//         <div style={styles.leftColumn}>
//           <div style={styles.chartContainer}>
//             <ReactECharts option={getPhasorChartOption()} style={{ height: '100%', width: '100%' }} />
//           </div>
//           <table style={styles.table}>
//             <tbody>
//               {chartData.map((item) => (
//                 <tr key={item.name}>
//                   <td style={{ ...styles.tableCell, ...styles.tableHeader }}>{item.name}</td>
//                   <td style={styles.tableCell}>{item.value}V</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//         <div style={styles.rightColumn}>
//           {/* Bar charts and table for the right column would be built here */}
//           {/* This part is omitted for brevity but would be similar to the Recharts version */}
//           <table style={styles.table}>
//             <tbody>
//               {barData.map((item) => (
//                 <tr key={item.name}>
//                   <td style={{ ...styles.tableCell, ...styles.tableHeader }}>{item.name}</td>
//                   <td style={styles.tableCell}>
//                     {item.value}
//                     {item.unit}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// }

// export default ThreePhaseVoltageECharts;

//approach 3
import React, { useState, useEffect } from 'react';
import ReactECharts from 'echarts-for-react';

// ---- ECharts modular (tree-shaken) imports ----
import * as echarts from 'echarts/core';
import { BarChart, PieChart } from 'echarts/charts';
import { GridComponent, PolarComponent, TooltipComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
echarts.use([BarChart, PieChart, GridComponent, PolarComponent, TooltipComponent, CanvasRenderer]);

// ---- Styles (lightweight) ----
const styles = {
  card: {
    background: '#fff',
    border: '1px solid #E0E0E0',
    borderRadius: 12,
    padding: 20,
    maxWidth: 940,
    width: '100%',
    fontFamily: 'Inter, Roboto, system-ui, sans-serif'
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 18, fontWeight: 600, color: '#222' },
  main: { display: 'flex', gap: 24, alignItems: 'stretch' },
  left: { flex: 1, minWidth: 0 },
  right: { width: 320, display: 'flex', flexDirection: 'column', gap: 12 },
  phasorWrap: { height: 280 },
  miniBar: { height: 70 },
  table: { width: '100%', borderCollapse: 'collapse', marginTop: 8 },
  th: { textAlign: 'left', padding: '8px 10px', background: '#F7F7F8', border: '1px solid #eee', fontWeight: 600, width: 120 },
  td: { padding: '8px 10px', border: '1px solid #eee' }
};

// ---- Config ----
const MAX_VOLT = 500; // scale top
const NAMES = ['VRY', 'VYB', 'VBR'];
const GRADS = [
  // soft radial-ish palettes
  ['#ffd6d6', '#ff5252'], // VRY
  ['#fff4c6', '#ffce56'], // VYB
  ['#d3e8ff', '#36a2eb'] // VBR
];

// dashed guide rings as thin pie rings
const dashedRingSeries = (radiusPct, color) => ({
  type: 'pie',
  silent: true,
  radius: [`${radiusPct - 0.6}%`, `${radiusPct}%`],
  center: ['50%', '50%'],
  label: { show: false },
  labelLine: { show: false },
  hoverAnimation: false,
  data: [
    {
      value: 100,
      itemStyle: { color: 'transparent', borderColor: color, borderWidth: 1, borderType: 'dashed' }
    }
  ],
  z: 1
});

// one compact horizontal bar option per metric (keeps its own max scale)
const miniBarOption = (label, value, unit, max, gradStart, gradEnd) => ({
  grid: { left: 110, right: 40, top: 10, bottom: 10 },
  xAxis: { type: 'value', max, show: false },
  yAxis: { type: 'category', data: [label], axisLine: { show: false }, axisTick: { show: false }, axisLabel: { show: true } },
  series: [
    {
      type: 'bar',
      data: [
        {
          value,
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: gradStart },
              { offset: 1, color: gradEnd }
            ]),
            borderRadius: [6, 6, 6, 6]
          }
        }
      ],
      barWidth: 22,
      label: { show: true, position: 'right', formatter: ({ value }) => `${value}${unit}` }
    }
  ],
  animationDuration: 250
});

export default function ThreePhaseVoltagePolarBars() {
  // demo voltages
  const [volts, setVolts] = useState([435.32, 440.12, 438.17]);
  const vavg = +(volts.reduce((a, b) => a + b, 0) / volts.length).toFixed(2);
  const maxDev = +(Math.max(...volts) - Math.min(...volts)).toFixed(2);
  const imbPct = +((maxDev / vavg) * 100).toFixed(2);

  useEffect(() => {
    const id = setInterval(() => {
      // random 250–450V demo values
      setVolts([0, 1, 2].map(() => +(250 + Math.random() * 200).toFixed(2)));
    }, 3000);
    return () => clearInterval(id);
  }, []);

  // --- Phasor option (polar bars + dashed rings) ---
  const phasorOption = {
    animationDuration: 250,
    polar: { radius: [0, '86%'] }, // start at center, no hole
    angleAxis: {
      type: 'category',
      data: NAMES, // 3 equal sectors of 120°
      startAngle: 90, // first at 12 o'clock
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false },
      splitLine: { show: false }
    },
    radiusAxis: {
      type: 'value',
      min: 0,
      max: MAX_VOLT,
      axisLine: { show: false },
      axisTick: { show: false },
      axisLabel: { show: false },
      splitLine: { show: false }
    },
    series: [
      dashedRingSeries(65, '#169c33'), // inner guide (green)
      dashedRingSeries(85, '#d61a22'), // outer guide (red)
      {
        type: 'bar',
        coordinateSystem: 'polar',
        data: volts.map((v, i) => ({
          value: v,
          itemStyle: {
            color: new echarts.graphic.RadialGradient(0.5, 0.5, 1, [
              { offset: 0, color: GRADS[i][0] },
              { offset: 1, color: GRADS[i][1] }
            ]),
            borderColor: '#fff',
            borderWidth: 2
          }
        })),
        barCategoryGap: '0%', // fill each 120° sector
        barGap: '0%',
        z: 2
      }
    ]
  };

  // --- Right-side mini bars (separate charts with their own scales) ---
  const multiBarOption = {
    grid: [
      { left: '35%', right: '15%', top: '12.5%', height: '20%', containLabel: false },
      { left: '35%', right: '15%', top: '42.5%', height: '20%', containLabel: false },
      { left: '35%', right: '15%', top: '72.5%', height: '20%', containLabel: false }
    ],
    xAxis: [
      { gridIndex: 0, type: 'value', min: 0, max: 100, show: false, boundaryGap: [0, 0] },
      { gridIndex: 1, type: 'value', min: 0, max: 5, show: false, boundaryGap: [0, 0] },
      { gridIndex: 2, type: 'value', min: 0, max: MAX_VOLT, show: false, boundaryGap: [0, 0] }
    ],
    yAxis: [
      {
        gridIndex: 0,
        type: 'category',
        data: ['Max Dev'],
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          show: true,
          width: 120,
          align: 'right',
          margin: 10,
          overflow: 'truncate' // CHANGED: right-align into fixed label block
        }
      },
      {
        gridIndex: 1,
        type: 'category',
        data: ['Voltage Imb %'],
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          show: true,
          width: 120,
          align: 'right',
          margin: 10,
          overflow: 'truncate' // CHANGED
        }
      },
      {
        gridIndex: 2,
        type: 'category',
        data: ['VAVG'],
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: {
          show: true,
          width: 120,
          align: 'right',
          margin: 10,
          overflow: 'truncate' // CHANGED: right-align into fixed label block
        }
      }
    ],
    series: [
      {
        xAxisIndex: 0,
        yAxisIndex: 0,
        type: 'bar',
        barWidth: 22,
        data: [
          {
            value: maxDev,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: '#ff6b6b' },
                { offset: 1, color: '#ff8a65' }
              ]),
              borderRadius: 6
            }
          }
        ],
        label: { show: true, position: 'right', formatter: '{c}V' }
      },
      {
        xAxisIndex: 1,
        yAxisIndex: 1,
        type: 'bar',
        barWidth: 22,
        data: [
          {
            value: imbPct,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: '#ffd54f' },
                { offset: 1, color: '#fff176' }
              ]),
              borderRadius: 6
            }
          }
        ],
        label: { show: true, position: 'right', formatter: '{c}%' }
      },
      {
        xAxisIndex: 2,
        yAxisIndex: 2,
        type: 'bar',
        barWidth: 22,
        data: [
          {
            value: vavg,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: '#66bb6a' },
                { offset: 1, color: '#9ccc65' }
              ]),
              borderRadius: 6
            }
          }
        ],
        label: { show: true, position: 'right', formatter: '{c}V' }
      }
    ],
    animationDuration: 250
  };

  return (
    <div style={styles.card}>
      <div style={styles.header}>
        <div style={styles.title}>3-Phase Voltage (Polar Bars)</div>
      </div>

      <div style={styles.main}>
        {/* Left: polar phasor + table */}
        <div className="left" style={styles.left}>
          <div style={styles.phasorWrap}>
            <ReactECharts echarts={echarts} option={phasorOption} notMerge lazyUpdate style={{ height: '100%', width: '100%' }} />
          </div>
          <table style={styles.table}>
            <tbody>
              {NAMES.map((n, i) => (
                <tr key={n}>
                  <th style={styles.th}>{n}</th>
                  <td style={styles.td}>{volts[i]} V</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Right: one chart with three grids + table */}
        <div className="right" style={styles.right}>
          <div style={styles.multiBarWrap}>
            <ReactECharts echarts={echarts} option={multiBarOption} notMerge lazyUpdate style={{ height: '100%', width: '100%' }} />
          </div>

          <table style={styles.table}>
            <tbody>
              <tr>
                <th style={styles.th}>VAVG</th>
                <td style={styles.td}>{vavg} V</td>
              </tr>
              <tr>
                <th style={styles.th}>Max Dev</th>
                <td style={styles.td}>{maxDev} V</td>
              </tr>
              <tr>
                <th style={styles.th}>Imbalance %</th>
                <td style={styles.td}>{imbPct} %</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
