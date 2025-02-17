import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const SpendingChart = ({ totalAmount, monthlyLimit }) => {
  if (!totalAmount || !monthlyLimit) return null;

  const spent = totalAmount + 5;
  const remaining = Math.max(monthlyLimit - spent, 0); // Ensure no negative values
  const exceeded = spent > monthlyLimit; // Check overspending
  const data = {
    labels: ['Spent', exceeded ? 'Exceeded' : 'Remaining'],
    datasets: [
      {
        data: exceeded
          ? [monthlyLimit, spent - monthlyLimit]
          : [spent, remaining],
        backgroundColor: exceeded
          ? ['#FF3B30', '#FF9F1C']
          : ['#4CAF50', '#FFC107'],
        hoverBackgroundColor: exceeded
          ? ['#FF1100', '#FF6D00']
          : ['#45A049', '#FFD54F'],
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
    },
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-lg font-bold mb-2">Spending Overview</h2>
      <Doughnut data={data} options={options} />
      <p
        className={`mt-2 text-lg font-semibold ${
          exceeded ? 'text-red-500' : 'text-green-600'
        }`}
      >
        ${spent.toFixed(2)} / ${monthlyLimit.toFixed(2)}
        {exceeded && '🚨 Over Limit!'}
      </p>
    </div>
  );
};

export default SpendingChart;
