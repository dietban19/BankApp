import React, { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  addDoc,
  getDoc,
} from 'firebase/firestore';
import { useNavigate, useParams } from 'react-router-dom';
import { db } from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import TransactionItem from '../components/TransactionItem';
import TransferFundsModal from '../components/TransferFundsModal';
import AddFundsModal from '../components/AddFundsModal';

function AccountDetails() {
  const { accountId } = useParams();
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [userAccounts, setUserAccounts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // Tracks open modal: 'addFunds' or 'transferFunds'
  const [amount, setAmount] = useState('');
  const [targetAccount, setTargetAccount] = useState('');
  const { currentUser } = useAuth();

  useEffect(() => {
    const fetchAccountDetails = async () => {
      try {
        setLoading(true);

        // Fetch account data
        const accountRef = doc(
          db,
          'users',
          currentUser.uid,
          'accounts',
          accountId,
        );
        const accountSnap = await getDoc(accountRef);

        if (accountSnap.exists()) {
          const accountData = accountSnap.data();
          setAccount({
            id: accountId,
            name: accountData.name || 'Account',
            balance: accountData.balance || 0,
          });
        } else {
          console.error('Account not found.');
        }

        // Fetch transactions
        const transactionsRef = collection(
          db,
          'users',
          currentUser.uid,
          'accounts',
          accountId,
          'transactions',
        );
        const transactionsSnap = await getDocs(transactionsRef);

        const transactionData = transactionsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTransactions(transactionData);

        // Fetch all user accounts
        const userAccountsRef = collection(
          db,
          'users',
          currentUser.uid,
          'accounts',
        );
        const userAccountsSnap = await getDocs(userAccountsRef);
        const userAccountsData = userAccountsSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUserAccounts(userAccountsData.filter((acc) => acc.id !== accountId));
      } catch (error) {
        console.error('Error fetching account details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountDetails();
  }, [accountId, currentUser]);

  const handleAddFunds = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    try {
      const accountRef = doc(
        db,
        'users',
        currentUser.uid,
        'accounts',
        accountId,
      );
      const newBalance = account.balance + parseFloat(amount);

      await updateDoc(accountRef, { balance: newBalance });

      const transactionsRef = collection(
        db,
        'users',
        currentUser.uid,
        'accounts',
        accountId,
        'transactions',
      );
      await addDoc(transactionsRef, {
        description: 'Funds Added',
        amount: parseFloat(amount),
        type: 'credit',
        timestamp: new Date(),
      });

      setAccount((prev) => ({ ...prev, balance: newBalance }));
      setTransactions((prev) => [
        ...prev,
        {
          description: 'Funds Added',
          amount: parseFloat(amount),
          type: 'credit',
        },
      ]);
      setAmount('');
      setModal(null); // Close modal
    } catch (error) {
      console.error('Error adding funds:', error);
    }
  };

  const handleTransferFunds = async () => {
    if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
      alert('Please enter a valid amount.');
      return;
    }

    if (parseFloat(amount) > account.balance) {
      alert('Insufficient balance.');
      return;
    }

    if (!targetAccount) {
      alert('Please select a target account.');
      return;
    }

    try {
      const accountRef = doc(
        db,
        'users',
        currentUser.uid,
        'accounts',
        accountId,
      );
      const targetAccountRef = doc(
        db,
        'users',
        currentUser.uid,
        'accounts',
        targetAccount,
      );

      const newSourceBalance = account.balance - parseFloat(amount);
      const targetAccountSnap = await getDoc(targetAccountRef);
      console.log('AMOn', targetAccountSnap.data().balance, parseFloat(amount));
      const newTargetBalance =
        parseFloat(targetAccountSnap.data().balance) + parseFloat(amount);
      console.log('target', newTargetBalance);
      await updateDoc(accountRef, { balance: newSourceBalance });
      await updateDoc(targetAccountRef, { balance: newTargetBalance });

      const transactionsRef = collection(
        db,
        'users',
        currentUser.uid,
        'accounts',
        accountId,
        'transactions',
      );
      const transactionTargetRef = collection(
        db,
        'users',
        currentUser.uid,
        'accounts',
        targetAccount,
        'transactions',
      );
      await addDoc(transactionsRef, {
        description: 'Funds Transferred',
        amount: -parseFloat(amount),
        type: 'debit',
        timestamp: new Date(),
      });
      await addDoc(transactionTargetRef, {
        description: 'Funds Transferred',
        amount: parseFloat(amount),
        type: 'debit',
        timestamp: new Date(),
      });

      setAccount((prev) => ({ ...prev, balance: newSourceBalance }));
      setTransactions((prev) => [
        ...prev,
        {
          description: 'Funds Transferred',
          amount: -parseFloat(amount),
          type: 'debit',
        },
      ]);
      setAmount('');
      setTargetAccount('');
      setModal(null); // Close modal
    } catch (error) {
      console.error('Error transferring funds:', error);
    }
  };
  const navigate = useNavigate();
  if (loading) {
    return <p className="text-center">Loading account details...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-lg mx-auto bg-white shadow rounded-lg p-4">
        <button
          onClick={() => navigate(-1)} // Navigate back to the previous page
          className="mb-4 bg-gray-300 text-black font-semibold py-2 px-4 rounded-lg hover:bg-gray-400 transition"
        >
          Back
        </button>
        <h1 className="text-2xl font-bold text-green-800 mb-6">
          {account.name}
        </h1>
        <p className="text-lg mb-4">Balance: ${account.balance.toFixed(2)}</p>

        <div className="space-y-4">
          <button
            onClick={() => setModal('addFunds')}
            className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-green-700 transition"
          >
            Add Funds
          </button>
          <button
            onClick={() => setModal('transferFunds')}
            className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition"
          >
            Transfer Funds
          </button>
        </div>

        <AddFundsModal
          isOpen={modal === 'addFunds'}
          onClose={() => setModal(null)}
          amount={amount}
          setAmount={setAmount}
          handleAddFunds={handleAddFunds}
        />

        <TransferFundsModal
          isOpen={modal === 'transferFunds'}
          onClose={() => setModal(null)}
          amount={amount}
          setAmount={setAmount}
          targetAccount={targetAccount}
          setTargetAccount={setTargetAccount}
          userAccounts={userAccounts}
          handleTransferFunds={handleTransferFunds}
        />

        <h2 className="text-lg font-bold text-green-800 mt-6 mb-4">
          Transactions
        </h2>
        {transactions.length > 0 ? (
          <ul className="space-y-2">
            {transactions.map((transaction, index) => (
              <TransactionItem key={index} transaction={transaction} />
            ))}
          </ul>
        ) : (
          <p className="text-gray-500">No transactions found.</p>
        )}
      </div>
    </div>
  );
}

export default AccountDetails;
