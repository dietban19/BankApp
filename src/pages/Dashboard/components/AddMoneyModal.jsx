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
  const moneyTypes = ['Income', 'Expense', 'Transfer'];
  console.log(accounts);
  const handleAddMoney = async (index) => {
    if (!amount || !description) return;

    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      //   const transactionsRef = collection(db, 'transactions');
      //   const newTransactionRef = await addDoc(transactionsRef, {
      //     userId: user.uid,
      //     amount: parseFloat(amount),
      //     description,
      //     type,
      //     createdAt: new Date(),
      //   });

      // Reference the user's account using type.docId
      console.log(type);
      const accountRef = doc(
        db,
        'users',
        user.uid,
        'accounts',
        type.documentId,
      );
      console.log(type);
      //   // Update the account balance
      const newData = {
        amount: parseFloat(amount),
        description: description,
        type: type.type,
        date: new Date().toISOString(), // Add timestamp for tracking
        // type: 'deposit',
        transactionType: 'deposit',
      };
      await updateDoc(accountRef, {
        balance: increment(parseFloat(amount)), // Increment the balance
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
      // Update the document with its own ID
      await updateDoc(docRef, { documentId: docRef.id });

      setAccounts((prevData) => {
        const newData = [...prevData]; // Create a new array copy
        const prevBalance = newData[index].balance;
        console.log('PREVAL', newData[index].balance);
        newData[index] = {
          ...newData[index],
          balance: parseFloat(prevBalance) + parseFloat(amount),
        }; // Modify index 1
        return newData; // Update state
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
            {/* Header */}
            <div className="flex items-center mb-6 relative">
              {/* Close Button (Left-Aligned) */}
              <button
                className="text-gray-500 hover:text-gray-700 transition absolute left-0"
                onClick={() => setModalOpen(false)}
              >
                <FaArrowLeft />
              </button>

              {/* Centered Title */}
              <h2 className="text-lg font-semibold text-gray-900 flex-1 text-center">
                Add Money
              </h2>
            </div>

            {/* Description */}
            <p className="text-gray-600 text-sm mb-4">
              Enter the details of the money transaction below.
            </p>

            {/* Amount Input */}
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

            {/* Description Input */}
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

            {/* Type Dropdown */}
            <label className="block text-[0.75rem] font-medium text-gray-600 mt-4">
              Type
            </label>
            <select
              className="text-[0.75rem] w-full mt-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
              value={
                type == 'Choose Type' ? 'Choose Type' : JSON.stringify(type)
              }
              onChange={(e) => {
                console.log('INITIAL', e.target.value);
                if (e.target.value === 'Choose Type') {
                  setType('Choose Type');
                  setIndex(null);
                } else {
                  const selectedAccount = JSON.parse(e.target.value);
                  setType(selectedAccount);
                  setIndex(
                    accounts.findIndex(
                      (acc) => acc.documentId === selectedAccount.documentId,
                    ),
                  );
                }
              }}
            >
              <option value="Choose Type" disabled>
                Choose Type
              </option>
              {accounts.map((option, ind) => (
                <option key={ind} value={JSON.stringify(option)}>
                  {option.name}
                </option>
              ))}
            </select>

            {/* Add Button */}
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
