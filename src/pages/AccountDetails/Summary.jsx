import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { collection, doc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { format, parseISO, isWithinInterval } from 'date-fns';
import SpendingChart from './SpendingChart';

function Summary({ allTransactions, accountData }) {
  const { currentUser } = useAuth();
  const [lastPayDate, setLastPayDate] = useState();
  const [totalAmount, setTotalAmount] = useState();
  const [totalAmounts, setTotalAmounts] = useState([]);

  const [incomeDates, setIncomeDates] = useState();
  useEffect(() => {
    const fetchMainAccount = async () => {
      try {
        if (!currentUser?.uid) return;

        // Reference to the accounts subcollection
        const accountsRef = collection(
          db,
          'users',
          currentUser.uid,
          'accounts',
        );

        // Query to find the "Main Account" document
        const accountQuery = query(
          accountsRef,
          where('name', '==', 'Main Account'),
        );
        const accountSnapshot = await getDocs(accountQuery);

        if (!accountSnapshot.empty) {
          const mainAccountDoc = accountSnapshot.docs[0]; // Get the first matching document
          const mainAccountId = mainAccountDoc.id; // Get the document ID
          // Reference to the transactions subcollection inside "Main Account"
          const transactionsRef = collection(
            db,
            'users',
            currentUser.uid,
            'accounts',
            mainAccountId,
            'transactions',
          );

          // Query to find transactions where description == "Work"
          const transactionQuery = query(
            transactionsRef,
            where('income', '==', true),
            // where('name', 'not-in', ['add']), // 'not-in' filters out specific values
          );
          const transactionSnapshot = await getDocs(transactionQuery);

          if (!transactionSnapshot.empty) {
            const workTransaction = transactionSnapshot.docs[0].data(); // Get first matching transaction
            const formattedDate = format(
              new Date(workTransaction.date),
              'EEEE, MMMM d, yyyy',
            );
            const incomeDates = transactionSnapshot.docs.map((doc) => {
              return format(new Date(doc.data().date), 'EEEE, MMMM d, yyyy');
            });

            setIncomeDates(incomeDates); // Assuming you have a state setter for storing the dates
            setLastPayDate(formattedDate);

            return formattedDate;
          } else {
            return null;
          }
        } else {
          return null;
        }
      } catch (error) {}
    };
    async function getMain() {
      await fetchMainAccount();
    }
    if (currentUser) {
      const payDate = getMain();
    }

    return () => {};
  }, []);

  useEffect(() => {
    if (lastPayDate) {
      const groupTransactionsAndSumTotal = (transactions) => {
        if (!lastPayDate) return { groupedTransactions: {}, totalAmount: 0 };

        const startDate = new Date(lastPayDate);
        const endDate = new Date();
        let totalAmount = 0; // Variable to store total sum

        const groupedTransactions = Object.entries(transactions).reduce(
          (acc, [date, transactionList]) => {
            const validTransactions = transactionList.filter((transaction) => {
              const transactionDate = new Date(transaction.date);
              return isWithinInterval(transactionDate, {
                start: startDate,
                end: endDate,
              });
            });

            if (validTransactions.length > 0) {
              const formattedDate = format(
                new Date(validTransactions[0].date),
                'EEEE, MMMM do, yyyy',
              );

              if (!acc[formattedDate]) {
                acc[formattedDate] = [];
              }

              acc[formattedDate].push(...validTransactions);
              totalAmount += validTransactions
                .filter((txn) => {
                  return (
                    txn.transactionType == 'debit' && txn.type !== 'transfer'
                  );
                }) // Exclude deposits
                .reduce((sum, txn) => sum + txn.amount, 0); // Sum remaining transactions
            }

            return acc;
          },
          {},
        );

        return { groupedTransactions, totalAmount }; // Return both grouped transactions and total sum
      };
      setTotalAmount(groupTransactionsAndSumTotal(allTransactions));
    }

    return () => {};
  }, [lastPayDate]);
  useEffect(() => {
    if (incomeDates) {
      const groupTransactionsAndSumTotal = (
        transactions,
        start = '',
        end = '',
      ) => {
        if (!lastPayDate) return { groupedTransactions: {}, totalAmount: 0 };
        const startDate = start ? new Date(start) : new Date(lastPayDate);
        const endDate = end ? new Date(end) : new Date();
        let totalAmount = 0; // Variable to store total sum
        console.log(start, end);
        const groupedTransactions = Object.entries(transactions).reduce(
          (acc, [date, transactionList]) => {
            const validTransactions = transactionList.filter((transaction) => {
              const transactionDate = new Date(transaction.date);
              return isWithinInterval(transactionDate, {
                start: startDate,
                end: endDate,
              });
            });
            if (validTransactions.length > 0) {
              const formattedDate = format(
                new Date(validTransactions[0].date),
                'EEEE, MMMM do, yyyy',
              );
              if (!acc[formattedDate]) {
                acc[formattedDate] = [];
              }
              acc[formattedDate].push(...validTransactions);
              totalAmount += validTransactions
                .filter((txn) => {
                  return (
                    txn.transactionType == 'debit' && txn.type !== 'transfer'
                  );
                }) // Exclude deposits
                .reduce((sum, txn) => sum + txn.amount, 0); // Sum remaining transactions
            }
            return acc;
          },
          {},
        );
        const startingDate = format(new Date(startDate), 'EEEE, MMMM do, yyyy');
        return { startingDate, groupedTransactions, totalAmount }; // Return both grouped transactions and total sum
      };
      // setTotalAmount(groupTransactionsAndSumTotal(allTransactions));
      const tempAmounts = [];
      console.log('DARES', incomeDates);
      for (let i = 0; i < incomeDates.length; i++) {
        if (incomeDates[i + 1]) {
          tempAmounts.push(
            groupTransactionsAndSumTotal(
              allTransactions,
              incomeDates[i],
              incomeDates[i + 1],
            ),
          );
        } else {
          tempAmounts.push(
            groupTransactionsAndSumTotal(allTransactions, incomeDates[i]),
          );
        }
      }

      // Sort the array based on `startDate`
      tempAmounts.sort((a, b) => new Date(a.startDate) - new Date(b.startDate));

      // Update the state after sorting
      setTotalAmounts(tempAmounts);
    }

    return () => {};
  }, [incomeDates]);
  return (
    <div className=" p-4 bg-white shadow-md rounded-lg">
      <div className="flex justify-center flex-col items-center">
        <p className="text-gray-600 text-sm">Last Payment Date:</p>
        <span className="ml-2 text-lg font-semibold text-gray-800">
          {totalAmounts && totalAmounts[totalAmounts.length - 1]?.startingDate}
        </span>
      </div>
      <div className="flex justify-center flex-col">
        {/* {} */}
        {totalAmounts &&
          totalAmounts[totalAmounts.length - 1] &&
          accountData && (
            <>
              <SpendingChart
                totalAmount={totalAmounts[totalAmounts.length - 1]?.totalAmount}
                monthlyLimit={accountData?.monthlyLimit}
              />
            </>
          )}
        <div className="mt-6">
          {totalAmounts &&
            accountData &&
            totalAmounts
              .slice(0, -1) // Excludes the last index
              .reverse() // Reverses the order
              .map((totalAm, index) => {
                return (
                  <div
                    key={index}
                    className="bg-neutral-200 shadow-md rounded-xl p-12 md:p-8 lg:p-10 mb-6 border border-gray-200 transition-transform transform hover:scale-105 duration-200"
                  >
                    <h3 className="text-xl font-semibold text-gray-700 mb-4">
                      {totalAm?.startingDate}
                    </h3>
                    <SpendingChart
                      totalAmount={totalAm?.totalAmount}
                      monthlyLimit={accountData?.monthlyLimit}
                    />
                  </div>
                );
              })}
        </div>
      </div>
    </div>
  );
}

export default Summary;
