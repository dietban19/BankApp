import React from 'react';

const AddFundsModal = ({
  isOpen,
  onClose,
  amount,
  setAmount,
  handleAddFunds,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-gray-800 bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-sm rounded-lg shadow-lg p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-4">Add Funds</h2>

        {/* Input for amount */}
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Enter amount"
          className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-green-600 focus:outline-none mb-4"
        />

        {/* Action Buttons */}
        <div className="flex justify-between items-center">
          <button
            onClick={handleAddFunds}
            className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-700 transition"
          >
            Confirm
          </button>
          <button
            onClick={onClose}
            className="ml-4 w-full bg-gray-300 text-gray-700 font-semibold py-2 px-4 rounded-lg hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddFundsModal;
