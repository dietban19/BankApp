import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Send, Download, Wallet } from 'lucide-react';
import { useState } from 'react';
import AddMoneyModal from './AddMoneyModal';
import TransactionModal from './TransactionModal';
import TransferModal from './modals/TransferModal';

const BankingButtons = () => {
  const [addMoneyModal, setAddMoneyModal] = useState(false);
  const [transactionModal, setTransactionModal] = useState(false);
  const [transferModal, setTransferModal] = useState(false);
  const buttons = [
    {
      label: 'Add Money',
      icon: <Plus size={20} strokeWidth={2} className="shrink-0" />,
      onClick: () => {
        console.log('test');
        setAddMoneyModal((prev) => !prev);
      },
    },
    {
      label: 'Make Transaction',
      icon: <Wallet size={20} strokeWidth={2} className="shrink-0" />,
      onClick: () => {
        console.log('test');
        setTransactionModal((prev) => !prev);
      },
    },
    {
      label: 'Transfer Money',
      icon: <Wallet size={20} strokeWidth={2} className="shrink-0" />,
      onClick: () => {
        console.log('test');
        setTransferModal((prev) => !prev);
      },
    },
  ];

  return (
    <AnimatePresence>
      <AddMoneyModal
        modalOpen={addMoneyModal}
        setModalOpen={setAddMoneyModal}
      />
      <TransactionModal
        modalOpen={transactionModal}
        setModalOpen={setTransactionModal}
      />
      <TransferModal
        modalOpen={transferModal}
        setModalOpen={setTransferModal}
      />
      <div className="flex overflow-x-auto space-x-3 p-4 no-scrollbar ">
        {buttons.map((button, index) => (
          <motion.button
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.85 }}
            className="inline-flex items-center gap-2 px-3 py-4 text-green-600 bg-green-50 rounded-full font-medium shadow-sm transition-all hover:bg-green-200 flex-shrink-0 whitespace-nowrap"
            onClick={button.onClick}
          >
            {button.icon}
            <span className="text-[12px] font-semibold">{button.label}</span>
          </motion.button>
        ))}
      </div>
    </AnimatePresence>
  );
};

export default BankingButtons;
