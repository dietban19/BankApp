import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

// Register ChartJS components
ChartJS.register(ArcElement, Tooltip, Legend);

function ExpenseComparison({ expenses }) {
  // Calculate total expenses
  const totalExpected = expenses.reduce((sum, item) => sum + item.planned, 0);
  const totalActual = expenses.reduce((sum, item) => sum + item.actual, 0);
  console.log(expenses);
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
        backgroundColor: ['#34D399', '#EF4444'], // Green for expected, Red for actual
        hoverBackgroundColor: ['#10B981', '#DC2626'],
      },
    ],
  };

  // Chart Options
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%', // Donut style
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
      <h2 className="text-lg font-bold mb-4 text-gray-800">Expense Overview</h2>
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

export default ExpenseComparison;
