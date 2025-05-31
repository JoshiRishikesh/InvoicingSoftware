'use client';

import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Doughnut, Radar } from 'react-chartjs-2';
import { useTheme } from '../../context/ThemeContext';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  ArcElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

export default function Graphs() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  useEffect(() => {
    async function fetchGraphData() {
      try {
        const res = await fetch('/api/dashboard/graphs');
        if (!res.ok) throw new Error('Failed to fetch graph data');
        const json = await res.json();

        // Merge payment modes case-insensitively
        const modeLabels = json.revenueByPaymentMode?.labels || [];
        const modeData = json.revenueByPaymentMode?.data || [];
        const labelMap = new Map();
        modeLabels.forEach((label, idx) => {
          const key = label.toLowerCase();
          labelMap.set(key, (labelMap.get(key) || 0) + modeData[idx]);
        });

        json.revenueByPaymentMode.labels = Array.from(labelMap.keys()).map(
          (l) => l.charAt(0).toUpperCase() + l.slice(1)
        );
        json.revenueByPaymentMode.data = Array.from(labelMap.values());

        // Handle category sales fallback
        const categorySales = json.productCategorySales || { labels: [], datasets: [] };
        const labels =
          categorySales.labels.length > 0
            ? categorySales.labels
            : ['Fabric+Stitching', 'Readymade Cloth', 'Cut Piece', 'Stitching'];
        const qtyData =
          categorySales.datasets.find((ds) => ds.label === 'Quantity Sold')?.data ?? [0, 0, 0, 0];
        const priceData =
          categorySales.datasets.find((ds) => ds.label === 'Total Revenue')?.data ?? [0, 0, 0, 0];

        json.categorySalesData = { labels, qty: qtyData, price: priceData };

        setData(json);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }

    fetchGraphData();
  }, []);

  if (loading) return <p className="text-muted">Loading graphs...</p>;
  if (error) return <p className="text-danger">Error: {error}</p>;

  // Dynamic chart colors
  const gridColor = isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)';
  const textColor = isDark ? '#ccc' : '#333';
  const bgText = isDark ? 'text-white' : 'text-dark';

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top', labels: { color: textColor } },
      title: { display: false },
    },
  };

  const gridScales = {
    x: {
      grid: { color: gridColor },
      ticks: { color: textColor },
    },
    y: {
      grid: { color: gridColor },
      ticks: { color: textColor },
    },
  };

  const barData = {
    labels: data.salesByMonth?.labels || [],
    datasets: [
      {
        label: 'Total Sales',
        data: data.salesByMonth?.data || [],
        backgroundColor: '#0d6efd',
      },
    ],
  };

  const lineData = {
    labels: data.categorySalesData.labels,
    datasets: [
      {
        label: 'Quantity Sold',
        data: data.categorySalesData.qty,
        fill: false,
        borderColor: '#ffc107',
        backgroundColor: '#ffc107',
        tension: 0.3,
        yAxisID: 'y',
      },
      {
        label: 'Total Price (KWD)',
        data: data.categorySalesData.price,
        fill: false,
        borderColor: '#198754',
        backgroundColor: '#198754',
        tension: 0.3,
        yAxisID: 'y1',
      },
    ],
  };

  const doughnutColorsBase = ['#ffc107', '#dc3545', '#0d6efd', '#198754', '#6c757d'];
  const doughnutLabels = [...(data.revenueByPaymentMode?.labels || [])];
  const doughnutValues = [...(data.revenueByPaymentMode?.data || [])];

  if (data.pendingAmount > 0) {
    doughnutLabels.push('Pending Amount');
    doughnutValues.push(data.pendingAmount);
  }

  const doughnutData = {
    labels: doughnutLabels,
    datasets: [
      {
        label: 'Revenue Distribution',
        data: doughnutValues,
        backgroundColor: doughnutLabels.map(
          (_, i) => doughnutColorsBase[i % doughnutColorsBase.length]
        ),
        hoverOffset: 30,
      },
    ],
  };

  const radarData = {
    labels: data.upcomingDeliveriesCount?.labels || [],
    datasets: [
      {
        label: 'Upcoming Deliveries (7 days)',
        data: data.upcomingDeliveriesCount?.data || [],
        backgroundColor: 'rgba(25,135,84,0.2)',
        borderColor: '#198754',
        pointBackgroundColor: '#198754',
        pointBorderColor: '#fff',
      },
    ],
  };

  const radarOptions = {
    ...options,
    scales: {
      r: {
        angleLines: { color: gridColor },
        grid: { color: gridColor },
        pointLabels: { color: textColor },
        ticks: { color: textColor },
        suggestedMin: 0,
      },
    },
  };

  return (
    <div className="container my-4">
      <h3 className={`mb-4 ${bgText}`}>Dashboard Graphs</h3>

      {/* Row 1 */}
      <div className="row mb-4">
        <div className="col-md-6 mb-4">
          <h5 className={`text-center ${bgText}`}>Bar Chart - Total Sale By Month</h5>
          <Bar data={barData} options={{ ...options, scales: gridScales }} />
        </div>
        <div className="col-md-6 mb-4">
          <h5 className={`text-center ${bgText}`}>Total Sales by Product Category</h5>
          <Line
            data={lineData}
            options={{
              ...options,
              scales: {
                y: {
                  type: 'linear',
                  position: 'left',
                  title: {
                    display: true,
                    text: 'Quantity',
                    color: '#ffc107',
                  },
                  ticks: { color: '#ffc107' },
                  grid: { color: gridColor },
                },
                y1: {
                  type: 'linear',
                  position: 'right',
                  grid: { drawOnChartArea: false },
                  title: {
                    display: true,
                    text: 'Total Price (KWD)',
                    color: '#198754',
                  },
                  ticks: { color: '#198754' },
                },
              },
            }}
          />
        </div>
      </div>

      {/* Row 2 */}
      <div className="row">
        <div className="col-md-6 mb-4">
          <h5 className={`text-center ${bgText}`}>Doughnut - Revenue by Payment Mode</h5>
          <Doughnut
            data={doughnutData}
            options={{
              ...options,
              plugins: {
                ...options.plugins,
                title: {
                  display: true,
                  text:
                    'Revenue by Payment Mode' +
                    (data.pendingAmount > 0 ? ' + Pending Amount' : ''),
                  color: textColor,
                },
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      const label = context.label || '';
                      const value = context.raw || 0;
                      return `${label}:  ${value.toLocaleString()} KWD`;
                    },
                  },
                },
              },
            }}
          />
        </div>

        <div className="col-md-6 mb-4">
          <h5 className={`text-center ${bgText}`}>Radar - Upcoming Deliveries</h5>
          <Radar data={radarData} options={radarOptions} />
        </div>
      </div>
    </div>
  );
}
