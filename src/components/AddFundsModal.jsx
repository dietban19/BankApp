import React from 'react';

const AddFundsModal = ({
  isOpen,
  onClose,
  amount,
  setAmount,
  handleAddFunds,
  incomeTypes,
  selectedIncomeType,
  setSelectedIncomeType,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white w-full max-w-sm rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-bold mb-4">Add Funds</h2>

        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-600 focus:outline-none mb-4"
        />

        <select
          value={selectedIncomeType}
          onChange={(e) => setSelectedIncomeType(e.target.value)}
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-600 focus:outline-none mb-4"
        >
          <option value="">Select Income Type</option>
          {incomeTypes.map((income, index) => (
            <option key={index} value={income.name}>
              {income}
            </option>
          ))}
        </select>

        <div className="flex justify-between">
          <button
            onClick={() => handleAddFunds(selectedIncomeType)}
            className="bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition"
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

export default AddFundsModal;
