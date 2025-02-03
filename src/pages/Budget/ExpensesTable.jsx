import React, { useState } from 'react';
import { FiMinus } from 'react-icons/fi';

function ExpensesTable({
  expenses,
  calculateDiff,
  setExpenses,
  handleDeleteBudgetType,
}) {
  const [edit, setEdit] = useState(false);
  const [selectedDelete, setSelectedDelete] = useState(null);

  // Function to delete an expense
  const handleDeleteExpense = (index) => {
    setExpenses((prevExpenses) => prevExpenses.filter((_, i) => i !== index));
    setSelectedDelete(null); // Reset selected delete
    console.log(expenses[index].name);
    handleDeleteBudgetType(expenses[index].name);
  };

  if (!expenses || expenses.length === 0) {
    return (
      <p className="text-center text-gray-500">No expense data available.</p>
    );
  }

  return (
    <div className="p-6 bg-white my-3 shadow-md w-full">
      {/* Title */}
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">
          Expense Breakdown
        </h3>
        <div className="p-4">
          <h4
            className="text-blue-400 text-xl cursor-pointer"
            onClick={() => {
              setEdit((prev) => !prev);
              setSelectedDelete(null);
            }}
          >
            {edit ? 'Done' : 'Edit'}
          </h4>
        </div>
      </div>

      {/* Table for larger screens */}
      <div className="hidden sm:block overflow-x-auto">
        <table className="w-full border-collapse rounded-lg overflow-hidden shadow-sm">
          <thead className="bg-gray-100 text-gray-600">
            <tr>
              <th className="px-6 py-3 text-left">Category</th>
              <th className="px-6 py-3 text-right">Planned</th>
              <th className="px-6 py-3 text-right">Actual</th>
              <th className="px-6 py-3 text-right">Difference</th>
              {edit && <th className="px-6 py-3 text-center">Delete</th>}
            </tr>
          </thead>
          <tbody>
            {expenses.map((item, index) => {
              const diff = calculateDiff(item.planned, item.actual);
              return (
                <tr
                  key={index}
                  className={`border-t ${
                    index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                  } hover:bg-gray-100 transition`}
                >
                  <td className="px-6 py-4 text-gray-800">{item.name}</td>
                  <td className="px-6 py-4 text-right text-gray-700">
                    ${item.planned.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 text-right text-gray-700">
                    ${item.actual.toFixed(2)}
                  </td>
                  <td
                    className={`px-6 py-4 text-right font-semibold ${
                      diff > 0 ? 'text-red-500' : 'text-green-600'
                    }`}
                  >
                    ${diff.toFixed(2)}
                  </td>
                  {edit && (
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDeleteExpense(index)}
                        className="bg-red-500 text-white px-3 py-1 rounded-md"
                      >
                        Delete
                      </button>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Cards for Mobile */}
      <div className="sm:hidden">
        <div className="flex flex-col gap-4">
          {expenses.map((item, index) => {
            const diff = calculateDiff(item.planned, item.actual);
            return (
              <div key={index} className="relative flex w-full">
                {/* Delete Button (Hidden until Edit mode) */}
                <div
                  className={`items-center flex overflow-hidden justify-center transition-all duration-300 ease-in-out ${
                    !edit ? 'w-0 opacity-0' : 'w-12 opacity-100'
                  }`}
                >
                  <div
                    onClick={() => setSelectedDelete(index)}
                    className="bg-red-500 rounded-full flex justify-center items-center w-[2rem] h-[2rem] cursor-pointer"
                  >
                    <FiMinus className="text-white shrink-0" />
                  </div>
                </div>

                {/* Expense Card */}
                <div className="bg-gray-50 p-4 rounded-l-lg shadow-sm w-full">
                  <h4 className="text-lg font-semibold text-gray-800">
                    {item.name}
                  </h4>
                  <div className="flex justify-between text-gray-700 text-sm mt-2">
                    <span>Planned:</span>
                    <span className="font-medium">
                      ${item.planned.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-700 text-sm mt-1">
                    <span>Actual:</span>
                    <span className="font-medium">
                      ${item.actual.toFixed(2)}
                    </span>
                  </div>
                  <div
                    className={`flex justify-between mt-2 font-semibold ${
                      diff > 0 ? 'text-red-500' : 'text-green-600'
                    }`}
                  >
                    <span>Difference:</span>
                    <span>${diff.toFixed(2)}</span>
                  </div>
                </div>

                {/* Confirm Delete Button */}
                <div
                  className={`bg-red-500 transition-all duration-300 ease-in-out text-center ${
                    selectedDelete !== index
                      ? 'w-0 opacity-0'
                      : 'w-[5rem] opacity-100'
                  }`}
                >
                  <button
                    onClick={() => handleDeleteExpense(index)}
                    className="text-center h-full bg-red-500 text-white flex items-center px-6 justify-center"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default ExpensesTable;
