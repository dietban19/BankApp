import React, { useState, useEffect } from 'react';
import { collection, query, getDocs, addDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { db } from '../config/firebase';
import { useNavigate } from 'react-router-dom';

const AccountList = ({ accounts, onAccountClick }) => {
  if (accounts.length === 0) {
    return (
      <p className="text-gray-500 text-center">No accounts found. Add one!</p>
    );
  }

  return (
    <div className="space-y-4">
      {accounts.map((account, index) => (
        <div
          key={index}
          onClick={() => onAccountClick(account.id)}
          className="cursor-pointer border border-green-600 bg-green-50 rounded-lg p-4 shadow-sm hover:bg-green-100 transition"
        >
          <h3 className="text-lg font-semibold text-green-800">
            {account.name}
          </h3>
          <p className="text-gray-700">Balance: {account.balance}</p>
        </div>
      ))}
    </div>
  );
};

function Dashboard() {
  const [accounts, setAccounts] = useState([]);
  const [newAccountName, setNewAccountName] = useState('');
  const { currentUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return;

    const userId = currentUser.uid;

    const fetchAccounts = async () => {
      try {
        setLoading(true);
        const accountsRef = collection(db, 'users', userId, 'accounts');
        const querySnapshot = await getDocs(accountsRef);

        if (querySnapshot.empty) {
          setAccounts([]);
        } else {
          const accountsData = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setAccounts(accountsData);
        }
      } catch (error) {
        console.error('Error fetching accounts:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccounts();
  }, [currentUser]);

  const handleAddAccount = async () => {
    if (newAccountName.trim() === '') {
      alert('Account name cannot be empty!');
      return;
    }

    const userId = currentUser.uid;

    try {
      const accountsRef = collection(db, 'users', userId, 'accounts');
      const newAccount = {
        name: newAccountName,
        balance: '$0.00',
      };

      const docRef = await addDoc(accountsRef, newAccount);
      setAccounts([...accounts, { id: docRef.id, ...newAccount }]);
      setNewAccountName('');
    } catch (error) {
      console.error('Error adding account:', error);
    }
  };

  const handleAccountClick = (accountId) => {
    navigate(`/account/${accountId}`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-bold text-green-800 mb-6 text-center">
          Hello, {currentUser?.displayName}
        </h1>
        <div className="bg-white shadow rounded-lg p-4">
          <h2 className="text-lg font-bold text-green-800 mb-4">My Accounts</h2>
          {loading ? (
            <p className="text-gray-500 text-center">Loading accounts...</p>
          ) : (
            <AccountList
              accounts={accounts}
              onAccountClick={handleAccountClick}
            />
          )}
          <div className="mt-6 space-y-4">
            <input
              type="text"
              placeholder="Enter account name"
              value={newAccountName}
              onChange={(e) => setNewAccountName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-green-600 focus:outline-none"
            />
            <button
              onClick={handleAddAccount}
              className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-green-700 transition"
            >
              Add Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
