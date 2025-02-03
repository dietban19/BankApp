import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, CreditCard, Waves } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

const BankCard = ({ total, setTotal }) => {
  //   const [balance, setBalance] = useState(0);
  //   const [balanceSavings, setBalanceSavings] = useState(0);

  //   useEffect(() => {

  //     let totalAmount = 0;
  //     accounts.forEach((account) => {
  //       totalAmount += account.balance;
  //     });
  //     setBalance(totalAmount);
  //     const getTotalSavingsBalance = (accounts) => {
  //       return accounts
  //         .filter((account) => account.savings) // Filter accounts with savings = true
  //         .reduce((total, account) => total + account.balance, 0); // Sum their balances
  //     };

  //     // Example usage:
  //     const totalSavings = getTotalSavingsBalance(accounts);
  //     setBalanceSavings(totalSavings);

  //     console.log('accounts');
  //   }, [accounts]);
  const { account, balanceSavings, setBalanceSavings, balance, setBalance } =
    useAuth();

  return (
    <motion.div
      className="relative   text-white px-6 pb-6 rounded-b-xl shadow-xl w-full max-w- mx-auto overflow-hidden"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* <Waves className="absolute right-4 top-4 opacity-20 w-14 h-14" />

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-sm font-semibold tracking-wider">GreenBank</h2>
        <CreditCard className="w-6 h-6 opacity-80" />
      </div>

      <motion.div
        className="w-8 h-4 bg-yellow-400 rounded-sm opacity-80 mb-4"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      /> */}

      {/* Balance Display */}
      <p className="text-[10px] uppercase tracking-wide opacity-80">
        Available Balance
      </p>
      <motion.h2
        className="text-sm font-bold mt-1"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        ${balance.toLocaleString()}
      </motion.h2>
    </motion.div>
  );
};

export default BankCard;
