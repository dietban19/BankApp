import React, { useEffect, useState } from 'react';
import Header from '../../components/ui/Header';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../config/firebase';
import { doc, collection, getDoc, getDocs } from 'firebase/firestore';
import Tabs from './Tabs';
import { format } from 'date-fns'; // Import date-fns for formatting
import Summary from './Summary';
function BankAccount() {
  const navigate = useNavigate();
  const { accountId } = useParams();
  const { currentUser } = useAuth();
  const [accountData, setAccountData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [allTransactions, setAllTransactions] = useState(null);
  useEffect(() => {
    if (!currentUser?.uid) return;

    const fetchAccount = async () => {
      try {
        const userDocRef = doc(db, 'users', currentUser.uid);
        const accountDocRef = doc(userDocRef, 'accounts', accountId);
        const accountSnapshot = await getDoc(accountDocRef);

        if (accountSnapshot.exists()) {
          setAccountData(accountSnapshot.data());
          const transactionsDocRef = collection(accountDocRef, 'transactions');
          const transactionsSnapshot = await getDocs(transactionsDocRef);
          let transactionsList = transactionsSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          // Convert date strings to actual Date objects and sort by descending date (newest first)
          transactionsList = transactionsList
            .map((transaction) => ({
              ...transaction,
              date: new Date(transaction.date), // Ensure it's a Date object
            }))
            .sort((a, b) => b.date - a.date); // Sort newest first

          // Group transactions by formatted date
          const groupedTransactions = transactionsList.reduce(
            (acc, transaction) => {
              const formattedDate = format(
                transaction.date,
                'EEEE, MMMM do, yyyy',
              ); // Example: "Monday, February 19th, 2024"

              if (!acc[formattedDate]) {
                acc[formattedDate] = [];
              }
              acc[formattedDate].push(transaction);
              return acc;
            },
            {},
          );

          setAllTransactions(groupedTransactions);
          // const transactionsSnapshot = await getDoc(accountDocRef);
        } else {
          console.log('No matching account found');
        }
      } catch (error) {
        console.error('Error fetching account:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccount();
  }, [currentUser, accountId]);
  const tabs = [{ name: 'Activity' }, { name: 'Summary' }];
  const [tab, setTab] = useState('Activity');
  return (
    <div>
      <div className="bg-gradient-to-b from-green-700 to-green-600 ">
        <Header title={'Test'} onBack={() => navigate(-1)} />
        <div className=" flex justify-center items-center flex-col py-[1rem]">
          <div className="text-3xl font-medium text-white">
            ${accountData?.balance.toFixed(2)}
          </div>
          <div className="text-lg text-white font-light">
            {accountData?.name}
          </div>
        </div>
      </div>
      <Tabs tab={tab} setTab={setTab} tabs={tabs} />
      <div className="bg-neutral-100">
        {allTransactions &&
          tab == 'Activity' &&
          Object.entries(allTransactions).map(([date, transactions]) => {
            return (
              <div key={date} className="mb-4">
                <h3 className="p-3  text-base">{date}</h3>
                {transactions.map((transaction, index) => {
                  return (
                    <div
                      key={index}
                      className={`bg-white p-1 py-2 flex justify-between px-3 border-t-[0.25px] border-neutral-300 ${
                        transaction.type == 'transfer' ||
                        transaction.name == 'add'
                          ? 'text-green-700'
                          : 'text-black'
                      }`}
                    >
                      <div className="text-lg">{transaction.description}</div>
                      <div className="text-lg">
                        {transaction.type == 'transfer' ||
                        transaction.name == 'add'
                          ? `+ $${transaction.amount.toFixed(2)}`
                          : `- $${transaction.amount.toFixed(2)}`}
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })}
        {tab == 'Summary' && (
          <>
            <Summary
              allTransactions={allTransactions}
              accountData={accountData}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default BankAccount;
