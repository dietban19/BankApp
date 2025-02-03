import React from 'react';

const AddTransactionModal = ({
  isOpen,
  onClose,
  amount,
  setAmount,
  transactionDetails,
  setTransactionDetails,
  budgetTypes,
  budgetType,
  setBudgetType,
  handleAddTransaction,
}) => {
  if (!isOpen) return null;
  console.log('BUDGET', budgetTypes);
  return (
    <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">
          Add Transaction
        </h2>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Transaction Amount"
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-600 focus:outline-none mb-4"
        />

        <input
          type="text"
          value={transactionDetails}
          onChange={(e) => setTransactionDetails(e.target.value)}
          placeholder="Transaction Details"
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-600 focus:outline-none mb-4"
        />

        <select
          value={budgetType}
          onChange={(e) => setBudgetType(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-600 focus:outline-none mb-4"
        >
          <option value="">Select Budget Type</option>
          {budgetTypes.map((budget, index) => (
            <option key={index} value={budget.name}>
              {budget}
            </option>
          ))}
        </select>

        <div className="flex justify-between">
          <button
            onClick={handleAddTransaction}
            className="bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-purple-700 transition"
          >
            Add
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddTransactionModal;
