import React from 'react';

function OverallBudgets() {
  return (
    <div className="py-6 px-2 flex  justify-center items-center gap-6">
      <div className="bg-rose-400 flex flex-col items-center gap-2 p-6 rounded-2xl shadow-lg w-1/2 sm:w-1/2">
        <div className="text-lg sm:text-xl font-bold text-white">Expenses</div>
        <div className="text-md sm:text-lg font-semibold text-white">$12</div>
      </div>
      <div className="bg-green-400 flex flex-col items-center gap-2 p-6 rounded-2xl shadow-lg w-1/2 sm:w-1/2">
        <div className="text-lg sm:text-xl font-bold text-white">Income</div>
        <div className="text-md sm:text-lg font-semibold text-white">$12</div>
      </div>
    </div>
  );
}

export default OverallBudgets;
