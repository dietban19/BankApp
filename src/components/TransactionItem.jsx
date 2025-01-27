import React from 'react';

const TransactionItem = ({ transaction }) => {
  const isCredit = transaction.type === 'credit';

  return (
    <li
      className={`flex justify-between items-center border rounded-lg p-4 mb-2 shadow-sm ${
        isCredit ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'
      }`}
    >
      <div>
        <p className="font-medium text-gray-800">{transaction.description}</p>
        <p className="text-sm text-gray-500">
          {new Date(transaction.timestamp?.toDate()).toLocaleString()}
        </p>
      </div>
      <div>
        <p
          className={`font-semibold ${
            isCredit ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {isCredit ? '+' : '-'}${transaction.amount.toFixed(2)}
        </p>
      </div>
    </li>
  );
};

export default TransactionItem;
