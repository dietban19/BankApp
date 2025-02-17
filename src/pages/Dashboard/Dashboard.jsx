import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import BankTotal from './components/BankTotal';
import AccountList from './components/AccountList';
import { collection, query, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useAuth } from '../../context/AuthContext';
import BankingButtons from './components/Buttons';
import Tabs from '../../components/Tabs';

function Dashboard() {
  const { currentUser, accounts, setAccounts, total, setTotal, loading } =
    useAuth();

  if (loading) {
    return <>Loading</>;
  }
  return (
    <div className="">
      <div className="from-green-600 to-green-400 bg-gradient-to-br">
        <Header />

        <BankTotal total={total} setTotal={setTotal} />
      </div>
      <BankingButtons />

      <div className="p-4">
        <AccountList
          accounts={accounts}
          setAccounts={setAccounts}
          total={total}
          setTotal={setTotal}
        />
      </div>
      <Tabs />
    </div>
  );
}

export default Dashboard;

// Header
// Bank Total

/* Buttons
 * Add Account
 */

// Accounts
