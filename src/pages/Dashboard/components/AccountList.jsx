import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Banknote, PlusCircle } from 'lucide-react';
import AddAccountModal from './AddAccountModal';
import { useAuth } from '../../../context/AuthContext';

const AccountList = ({ accounts, setAccounts, total, setTotal }) => {
  // Default Main Account

  const [modalOpen, setModalOpen] = useState(false);
  const { balanceSavings, balanceChequing } = useAuth();
  console.log(balanceChequing);
  return (
    <div className="max-w-md mx-auto p-4">
      <AddAccountModal
        modalOpen={modalOpen}
        setModalOpen={setModalOpen}
        setAccounts={setAccounts}
      />
      {/* Header */}
      <button
        onClick={() => {
          console.log('test');
          setModalOpen(true);
        }}
        className="flex items-center gap-1 text-green-600 font-medium hover:underline text-[12px]"
      >
        <PlusCircle className="w-5 h-5" />
        Add Account
      </button>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-base font-bold text-gray-800">Chequing Accounts</h2>

        <div className="py-2 font-bold">
          ${balanceChequing.toLocaleString()}
        </div>
      </div>

      {/* Account Cards */}
      <div className="space-y-4">
        {accounts
          .filter((account) => account.chequing) // Only include accounts where savings is true
          .map((account) => (
            <motion.div
              key={account.id}
              className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between border-l-4 border-green-500"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3">
                <Banknote className="w-6 h-6 text-green-500" />
                <div>
                  <p className="text-sm font-semibold">{account.name}</p>
                  <p className="text-[12px] text-gray-500">
                    {account.type} - {account.currency}
                  </p>
                </div>
              </div>
              <p className="text-base font-bold">
                ${account.balance.toLocaleString()}
              </p>
            </motion.div>
          ))}
      </div>
      <div className="flex justify-between">
        <h2 className="text-base font-bold text-gray-800 py-4">
          Savings Accounts
        </h2>
        <h2 className="text-base font-bold text-gray-800 py-4">
          ${balanceSavings.toLocaleString(2)}
        </h2>
      </div>
      <div className="space-y-4">
        {accounts
          .filter((account) => account.savings) // Only include accounts where savings is true
          .map((account) => (
            <motion.div
              key={account.id}
              className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between border-l-4 border-green-500"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3">
                <Banknote className="w-6 h-6 text-green-500" />
                <div>
                  <p className="text-sm font-semibold">{account.name}</p>
                  <p className="text-[12px] text-gray-500">
                    {account.type} - {account.currency}
                  </p>
                </div>
              </div>
              <p className="text-base font-bold">
                ${account.balance.toLocaleString()}
              </p>
            </motion.div>
          ))}
      </div>
      <h2 className="text-base font-bold text-gray-800 py-4">
        Travel Accounts
      </h2>
      <div className="space-y-4">
        {accounts
          .filter((account) => account.travel) // Only include accounts where savings is true
          .map((account) => (
            <motion.div
              key={account.id}
              className="bg-white shadow-md rounded-lg p-4 flex items-center justify-between border-l-4 border-green-500"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3">
                <Banknote className="w-6 h-6 text-green-500" />
                <div>
                  <p className="text-sm font-semibold">{account.name}</p>
                  <p className="text-[12px] text-gray-500">
                    {account.type} - {account.currency}
                  </p>
                </div>
              </div>
              <p className="text-base font-bold">
                ${account.balance.toLocaleString()}
              </p>
            </motion.div>
          ))}
      </div>
    </div>
  );
};

export default AccountList;
