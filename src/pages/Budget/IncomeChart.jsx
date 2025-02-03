import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register necessary components
ChartJS.register(ArcElement, Tooltip, Legend);

function IncomeComparisonChart({ income }) {
  if (!income) {
    return (
      <p className="text-center text-gray-500">No income data available.</p>
    );
  }

  const totalExpected = income.reduce((sum, item) => sum + item.planned, 0);
  const totalActual = income.reduce((sum, item) => sum + item.actual, 0);
  console.log(income);
  if (totalExpected === 0 && totalActual === 0) {
    return (
      <p className="text-center text-gray-500">No expense data available.</p>
    );
  }

  // Chart Data
  const data = {
    labels: ['Expected', 'Actual'],
    datasets: [
      {
        data: [totalExpected, totalActual],
        backgroundColor: ['#34D399', '#3B82F6'], // Green for expected, Blue for actual
        hoverBackgroundColor: ['#10B981', '#2563EB'],
      },
    ],
  };

  // Chart Options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%', // Makes it a donut chart
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          boxWidth: 12,
          font: {
            size: 14,
          },
        },
      },
    },
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow-md flex flex-col items-center">
      <h2 className="text-lg font-bold mb-4 text-gray-800">Income Overview</h2>
      <div className="w-40 h-40 sm:w-56 sm:h-56">
        <Doughnut data={data} options={options} />
      </div>
      <div className="mt-4 text-center">
        <p className="text-gray-700 text-sm">
          Total Expected:{' '}
          <span className="font-semibold">
            ${totalExpected.toLocaleString()}
          </span>
        </p>
        <p className="text-gray-700 text-sm">
          Total Actual:{' '}
          <span className="font-semibold">${totalActual.toLocaleString()}</span>
        </p>
      </div>
    </div>
  );
}

export default IncomeComparisonChart;
