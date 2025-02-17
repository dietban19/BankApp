import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import {
  collection,
  addDoc,
  increment,
  updateDoc,
  doc,
  arrayUnion,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../../config/firebase';
import { useAuth } from '../../../context/AuthContext';
import { FaArrowLeft } from 'react-icons/fa';

const AddMoneyModal = ({ modalOpen, setModalOpen }) => {
  const { accounts, setAccounts } = useAuth();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Choose Type');
  const [index, setIndex] = useState();
  const [isIncome, setIsIncome] = useState(true);
  const moneyTypes = ['Income', 'Expense', 'Transfer'];
  const { currentUser } = useAuth();
  const handleAddMoney = async () => {
    if (!amount || !description) return;
    console.log(accounts);
    const mainAcc = accounts.find((account) => {
      return account.main;
    });
    const index = accounts.findIndex((account) => {
      return account.main;
    });
    const type = mainAcc;
    try {
      const user = currentUser;
      if (!user) return;

      console.log(type);
      const accountRef = doc(
        db,
        'users',
        user.uid,
        'accounts',
        type.documentId,
      );
      console.log(type);
      const newData = {
        amount: parseFloat(amount),
        description: description,
        type: type.type,
        date: new Date().toISOString(),
        transactionType: isIncome ? 'deposit' : 'withdrawal',
      };
      await updateDoc(accountRef, {
        balance: increment(isIncome ? parseFloat(amount) : -parseFloat(amount)),
      });
      const transactionsRef = collection(
        db,
        'users',
        user.uid,
        'accounts',
        type.documentId,
        'transactions',
      );
      const docRef = await addDoc(transactionsRef, newData);
      await updateDoc(docRef, {
        documentId: docRef.id,
        income: true,
      });

      setAccounts((prevData) => {
        const newData = [...prevData];
        const prevBalance = newData[index].balance;
        console.log(prevBalance);
        newData[index] = {
          ...newData[index],
          balance: parseFloat(prevBalance) + parseFloat(amount),
        };
        console.log(newData);
        return newData;
      });
      setAmount('');
      setDescription('');
      setType('Choose Type');
      setIndex();
      setModalOpen(false);
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  console.log('TYPE', type);

  return (
    <AnimatePresence>
      {modalOpen && (
        <motion.div
          className="z-[100] fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white p-6 h-full w-full max-w-lg mx-auto  shadow-xl overflow-y-auto"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <div className="flex items-center mb-6 relative">
              <button
                className="text-gray-500 hover:text-gray-700 transition absolute left-0"
                onClick={() => setModalOpen(false)}
              >
                <FaArrowLeft />
              </button>
              <h2 className="text-lg font-semibold text-gray-900 flex-1 text-center">
                Add Money
              </h2>
            </div>
            <p className="text-gray-600 text-sm mb-4">
              Enter the details of the money transaction below.
            </p>
            <label className="block text-[0.75rem] font-medium text-gray-600">
              Amount
            </label>
            <input
              type="number"
              className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500 text-[0.75rem]"
              placeholder="Enter amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <label className="block text-[0.75rem] font-medium text-gray-600 mt-4">
              Description
            </label>
            <input
              type="text"
              className="w-full mt-1 p-3 border text-[0.75rem] border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
            <div className="mt-4">
              <label className="block text-[0.75rem] font-medium text-gray-600">
                Transaction Type
              </label>
              <div className="flex gap-4 mt-2">
                <label>
                  <input
                    type="radio"
                    value="income"
                    checked={isIncome}
                    onChange={() => setIsIncome(true)}
                  />{' '}
                  Income
                </label>
                <label>
                  <input
                    type="radio"
                    value="expense"
                    checked={!isIncome}
                    onChange={() => setIsIncome(false)}
                  />{' '}
                  Expense
                </label>
              </div>
            </div>
            <button
              className="w-full mt-6 p-3 bg-green-500 text-white rounded-md flex items-center justify-center gap-2 hover:bg-green-600 transition text-[0.75rem]"
              onClick={() => handleAddMoney(index)}
            >
              <CheckCircle size={20} /> Add Money
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddMoneyModal;
