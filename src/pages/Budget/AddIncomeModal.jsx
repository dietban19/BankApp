import React from 'react';

function AddIncomeModal({
  isOpen,
  setModalOpen,
  newIncome,
  setNewIncome,
  handleAddIncomeType,
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 px-4 bg-opacity-40 backdrop-blur-md flex items-center justify-center z-50 transition-opacity">
      {/* Modal Container */}
      <div className="bg-white p-6 rounded-xl shadow-2xl w-full max-w-sm relative animate-fadeIn">
        {/* Close Button */}
        <button
          onClick={() => setModalOpen(false)}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 transition"
        >
          ✕
        </button>

        {/* Modal Title */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Add Income Type
        </h2>

        {/* Input Fields */}
        <div className="space-y-4">
          <input
            type="text"
            value={newIncome.name}
            onChange={(e) =>
              setNewIncome((prev) => ({ ...prev, name: e.target.value }))
            }
            placeholder="Income Type Name"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-600 focus:outline-none shadow-sm"
          />

          <input
            type="number"
            value={newIncome.planned}
            onChange={(e) =>
              setNewIncome((prev) => ({ ...prev, planned: e.target.value }))
            }
            placeholder="Planned Amount"
            className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-600 focus:outline-none shadow-sm"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mt-5">
          <button
            onClick={handleAddIncomeType}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-700 text-white font-semibold py-2 rounded-lg shadow-md hover:scale-[1.02] transition-transform"
          >
            Add Income
          </button>
          <button
            onClick={() => setModalOpen(false)}
            className="w-full bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg shadow-md hover:bg-gray-400 transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default AddIncomeModal;
