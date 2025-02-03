import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import { IoIosArrowDown } from 'react-icons/io';
import {
  collection,
  addDoc,
  increment,
  updateDoc,
  doc,
  arrayUnion,
  setDoc,
} from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../../../config/firebase';
import { useAuth } from '../../../../context/AuthContext';
import { FaArrowLeft } from 'react-icons/fa';
import SlideUpModal from './AccountsModal';

const TransferModal = ({ modalOpen, setModalOpen }) => {
  const { accounts, setAccounts } = useAuth();
  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('Choose Type');
  const [indexFrom, setIndexFrom] = useState();
  const [indexTo, setIndexTo] = useState();

  const moneyTypes = ['Expense', 'Transfer', 'Income'];
  const [fromAccount, setFromAccount] = useState();
  const [toAccount, setToAccount] = useState();
  const [transferType, setTransferType] = useState('From');
  const [fromModal, setFromModal] = useState(false);
  const [toModal, setToModal] = useState(false);
  // useEffect(()=>{

  // },[])
  const handleTransaction = async () => {
    console.log(amount, description, fromAccount, toAccount);
    if (!amount || !description || !fromAccount || !toAccount) return;
    console.log('work', indexFrom, indexTo);
    try {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;
      // Reference the user's account using type.docId
      const fromAccountRef = doc(
        db,
        'users',
        user.uid,
        'accounts',
        fromAccount.documentId,
      );

      const toAccountRef = doc(
        db,
        'users',
        user.uid,
        'accounts',
        toAccount.documentId,
      );
      const newDataFrom = {
        amount: parseFloat(amount),
        description: description,
        type: 'transfer',
        date: new Date().toISOString(), // Add timestamp for tracking
        transactionType: 'debit',
      };
      const newDataTo = {
        amount: parseFloat(amount),
        description: description,
        type: 'transfer',
        date: new Date().toISOString(), // Add timestamp for tracking
        transactionType: 'debit',
      };

      // Deduct the amount from the account balance
      console.log('trasnfering', amount, parseFloat(amount));
      await updateDoc(fromAccountRef, {
        balance: increment(-parseFloat(amount)), // Decrease the balance
      });
      await updateDoc(toAccountRef, {
        balance: increment(parseFloat(amount)), // Decrease the balance
      });

      const transactionsFromRef = collection(
        db,
        'users',
        user.uid,
        'accounts',
        fromAccount.documentId,
        'transactions',
      );
      const transactionsToRef = collection(
        db,
        'users',
        user.uid,
        'accounts',
        toAccount.documentId,
        'transactions',
      );

      const docRefFrom = await addDoc(transactionsFromRef, newDataFrom);
      const docRefTo = await addDoc(transactionsToRef, newDataTo);

      // Update the document with its own ID
      await updateDoc(docRefFrom, { documentId: docRefFrom.id });
      await updateDoc(docRefTo, { documentId: docRefTo.id });
      console.log('tes');
      setAccounts((prevData) => {
        const newData = [...prevData]; // Create a new array copy

        newData[indexFrom] = {
          ...newData[indexFrom],
          balance: parseFloat(newData[indexFrom].balance) - parseFloat(amount), // Increment balance
        }; // Modify index
        newData[indexTo] = {
          ...newData[indexTo],
          balance: parseFloat(newData[indexTo].balance) + parseFloat(amount), // Increment balance
        }; // Modify index
        return newData; // Update state
      });
      setAmount('');
      setFromAccount();
      setToAccount();
      setDescription('');
      setType('Choose Type');
      setIndexFrom();
      setIndexTo();

      setModalOpen(false);
    } catch (error) {
      console.error('Error processing transaction:', error);
    }
  };

  return (
    <AnimatePresence>
      {fromModal && (
        <SlideUpModal
          isOpen={fromModal}
          onClose={() => setFromModal(false)}
          transferType={transferType}
          setTransfer={setFromAccount}
          accounts={accounts}
          setIndex={setIndexFrom}
        />
      )}
      {toModal && (
        <SlideUpModal
          isOpen={toModal}
          onClose={() => setToModal(false)}
          transferType={transferType}
          setTransfer={setToAccount}
          accounts={accounts}
          setIndex={setIndexTo}
        />
      )}
      {modalOpen && (
        <motion.div
          className="z-[100] fixed inset-0 flex items-center justify-center bg-white bg-opacity-50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="h-full w-full max-w-lg mx-auto  shadow-xl overflow-y-auto"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {/* Header */}
            <div className="flex items-center mb-6 relative bg-green-600 p-6">
              <button
                className="text-gray-100 hover:text-gray-700 transition absolute left-6"
                onClick={() => setModalOpen(false)}
              >
                <FaArrowLeft />
              </button>
              <h2 className="text-lh font-semibold text-neutral-100 flex-1 text-center">
                Make Transfer
              </h2>
            </div>
            <div className="px-3 py-0">
              <div className="flex flex-col gap-2">
                <div
                  className="flex flex-col border border-neutral-300 p-2 w-full"
                  onClick={() => {
                    setTransferType('From');
                    setFromModal(true);
                  }}
                >
                  <div className="text-base">From Account</div>
                  <div className="flex w-full ">
                    <div className="flex w-5/6 relative  h-[5rem] items-center">
                      {fromAccount ? (
                        <>
                          <div className="flex   w-full h-full items-center justify-between">
                            <div className="text-base font-medium">
                              {fromAccount.name}
                            </div>
                            <div className="text-base text-green-600">
                              ${fromAccount.balance.toFixed(2)}
                            </div>
                          </div>
                        </>
                      ) : (
                        'Select From Account'
                      )}
                    </div>
                    <div className=" flex items-center justify-center px-3 w-1/6">
                      <IoIosArrowDown />
                    </div>
                  </div>
                </div>

                <div
                  className="flex flex-col border border-neutral-300 p-2 w-full"
                  onClick={() => {
                    setTransferType('To');
                    setToModal(true);
                  }}
                >
                  <div className="text-base">To Account</div>
                  <div className="flex w-full ">
                    <div className="flex w-5/6 relative  h-[5rem] items-center">
                      {toAccount ? (
                        <>
                          <div className="flex   w-full h-full items-center justify-between">
                            <div className="text-base font-medium">
                              {toAccount.name}
                            </div>
                            <div className="text-base text-green-600">
                              ${toAccount.balance.toFixed(2)}
                            </div>
                          </div>
                        </>
                      ) : (
                        'Select To Account'
                      )}
                    </div>
                    <div className=" flex items-center justify-center px-3 w-1/6">
                      <IoIosArrowDown />
                    </div>
                  </div>
                </div>
              </div>
              {/* Amount Input */}
              <label className="block text-[0.75rem] font-medium text-gray-600">
                Amount
              </label>
              <input
                type="number"
                className="w-full mt-1 p-3 border text-[0.75rem] border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
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

              {/* Transaction Button */}
              <button
                className="w-full mt-6 p-3 bg-green-500 text-white rounded-md flex items-center justify-center gap-2 hover:bg-green-600 transition"
                onClick={() => handleTransaction()}
              >
                <CheckCircle size={20} /> Make Transfer
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TransferModal;
