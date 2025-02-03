// import React, { useState, useEffect } from 'react';
// import {
//   collection,
//   getDocs,
//   doc,
//   updateDoc,
//   addDoc,
//   getDoc,
// } from 'firebase/firestore';
// import { useNavigate, useParams } from 'react-router-dom';
// import { db } from '../config/firebase';
// import { useAuth } from '../context/AuthContext';
// import TransactionItem from '../components/TransactionItem';
// import TransferFundsModal from '../components/TransferFundsModal';
// import AddFundsModal from '../components/AddFundsModal';

// function AccountDetails() {
//   const { accountId } = useParams();
//   const [account, setAccount] = useState(null);
//   const [transactions, setTransactions] = useState([]);
//   const [userAccounts, setUserAccounts] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [modal, setModal] = useState(null); // Tracks open modal: 'addFunds' or 'transferFunds'
//   const [amount, setAmount] = useState('');
//   const [targetAccount, setTargetAccount] = useState('');
//   const { currentUser } = useAuth();

//   useEffect(() => {
//     const fetchAccountDetails = async () => {
//       try {
//         setLoading(true);

//         // Fetch account data
//         const accountRef = doc(
//           db,
//           'users',
//           currentUser.uid,
//           'accounts',
//           accountId,
//         );
//         const accountSnap = await getDoc(accountRef);

//         if (accountSnap.exists()) {
//           const accountData = accountSnap.data();
//           setAccount({
//             id: accountId,
//             name: accountData.name || 'Account',
//             balance: accountData.balance || 0,
//           });
//         } else {
//           console.error('Account not found.');
//         }

//         // Fetch transactions
//         const transactionsRef = collection(
//           db,
//           'users',
//           currentUser.uid,
//           'accounts',
//           accountId,
//           'transactions',
//         );
//         const transactionsSnap = await getDocs(transactionsRef);

//         const transactionData = transactionsSnap.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setTransactions(transactionData);

//         // Fetch all user accounts
//         const userAccountsRef = collection(
//           db,
//           'users',
//           currentUser.uid,
//           'accounts',
//         );
//         const userAccountsSnap = await getDocs(userAccountsRef);
//         const userAccountsData = userAccountsSnap.docs.map((doc) => ({
//           id: doc.id,
//           ...doc.data(),
//         }));
//         setUserAccounts(userAccountsData.filter((acc) => acc.id !== accountId));
//       } catch (error) {
//         console.error('Error fetching account details:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAccountDetails();
//   }, [accountId, currentUser]);

//   const handleAddFunds = async () => {
//     if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
//       alert('Please enter a valid amount.');
//       return;
//     }

//     try {
//       const accountRef = doc(
//         db,
//         'users',
//         currentUser.uid,
//         'accounts',
//         accountId,
//       );
//       const newBalance = account.balance + parseFloat(amount);

//       await updateDoc(accountRef, { balance: newBalance });

//       const transactionsRef = collection(
//         db,
//         'users',
//         currentUser.uid,
//         'accounts',
//         accountId,
//         'transactions',
//       );
//       await addDoc(transactionsRef, {
//         description: 'Funds Added',
//         amount: parseFloat(amount),
//         type: 'credit',
//         timestamp: new Date(),
//       });

//       setAccount((prev) => ({ ...prev, balance: newBalance }));
//       setTransactions((prev) => [
//         ...prev,
//         {
//           description: 'Funds Added',
//           amount: parseFloat(amount),
//           type: 'credit',
//         },
//       ]);
//       setAmount('');
//       setModal(null); // Close modal
//     } catch (error) {
//       console.error('Error adding funds:', error);
//     }
//   };

//   const handleTransferFunds = async () => {
//     if (!amount || isNaN(amount) || parseFloat(amount) <= 0) {
//       alert('Please enter a valid amount.');
//       return;
//     }

//     if (parseFloat(amount) > account.balance) {
//       alert('Insufficient balance.');
//       return;
//     }

//     if (!targetAccount) {
//       alert('Please select a target account.');
//       return;
//     }

//     try {
//       const accountRef = doc(
//         db,
//         'users',
//         currentUser.uid,
//         'accounts',
//         accountId,
//       );
//       const targetAccountRef = doc(
//         db,
//         'users',
//         currentUser.uid,
//         'accounts',
//         targetAccount,
//       );

//       const newSourceBalance = account.balance - parseFloat(amount);
//       const targetAccountSnap = await getDoc(targetAccountRef);
//       console.log('AMOn', targetAccountSnap.data().balance, parseFloat(amount));
//       const newTargetBalance =
//         parseFloat(targetAccountSnap.data().balance) + parseFloat(amount);
//       console.log('target', newTargetBalance);
//       await updateDoc(accountRef, { balance: newSourceBalance });
//       await updateDoc(targetAccountRef, { balance: newTargetBalance });

//       const transactionsRef = collection(
//         db,
//         'users',
//         currentUser.uid,
//         'accounts',
//         accountId,
//         'transactions',
//       );
//       const transactionTargetRef = collection(
//         db,
//         'users',
//         currentUser.uid,
//         'accounts',
//         targetAccount,
//         'transactions',
//       );
//       await addDoc(transactionsRef, {
//         description: 'Funds Transferred',
//         amount: -parseFloat(amount),
//         type: 'debit',
//         timestamp: new Date(),
//       });
//       await addDoc(transactionTargetRef, {
//         description: 'Funds Transferred',
//         amount: parseFloat(amount),
//         type: 'debit',
//         timestamp: new Date(),
//       });

//       setAccount((prev) => ({ ...prev, balance: newSourceBalance }));
//       setTransactions((prev) => [
//         ...prev,
//         {
//           description: 'Funds Transferred',
//           amount: -parseFloat(amount),
//           type: 'debit',
//         },
//       ]);
//       setAmount('');
//       setTargetAccount('');
//       setModal(null); // Close modal
//     } catch (error) {
//       console.error('Error transferring funds:', error);
//     }
//   };
//   const navigate = useNavigate();
//   if (loading) {
//     return <p className="text-center">Loading account details...</p>;
//   }

//   return (
//     <div className="min-h-screen bg-gray-100 p-4">
//       <div className="max-w-lg mx-auto bg-white shadow rounded-lg p-4">
//         <button
//           onClick={() => navigate(-1)} // Navigate back to the previous page
//           className="mb-4 bg-gray-300 text-black font-semibold py-2 px-4 rounded-lg hover:bg-gray-400 transition"
//         >
//           Back
//         </button>
//         <h1 className="text-2xl font-bold text-green-800 mb-6">
//           {account.name}
//         </h1>
//         <p className="text-lg mb-4">Balance: ${account.balance.toFixed(2)}</p>

//         <div className="space-y-4">
//           <button
//             onClick={() => setModal('addFunds')}
//             className="w-full bg-green-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-green-700 transition"
//           >
//             Add Funds
//           </button>
//           <button
//             onClick={() => setModal('transferFunds')}
//             className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-blue-700 transition"
//           >
//             Transfer Funds
//           </button>
//         </div>

//         <AddFundsModal
//           isOpen={modal === 'addFunds'}
//           onClose={() => setModal(null)}
//           amount={amount}
//           setAmount={setAmount}
//           handleAddFunds={handleAddFunds}
//         />

//         <TransferFundsModal
//           isOpen={modal === 'transferFunds'}
//           onClose={() => setModal(null)}
//           amount={amount}
//           setAmount={setAmount}
//           targetAccount={targetAccount}
//           setTargetAccount={setTargetAccount}
//           userAccounts={userAccounts}
//           handleTransferFunds={handleTransferFunds}
//         />

//         <h2 className="text-lg font-bold text-green-800 mt-6 mb-4">
//           Transactions
//         </h2>
//         {transactions.length > 0 ? (
//           <ul className="space-y-2">
//             {transactions.map((transaction, index) => (
//               <TransactionItem key={index} transaction={transaction} />
//             ))}
//           </ul>
//         ) : (
//           <p className="text-gray-500">No transactions found.</p>
//         )}
//       </div>
//     </div>
//   );
// }

// export default AccountDetails;

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
import AddTransactionModal from '../components/AddTransactionModal';

function AccountDetails() {
  const { accountId } = useParams();
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [userAccounts, setUserAccounts] = useState([]);
  const [budgetTypes, setBudgetTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null); // Tracks open modal: 'addFunds', 'transferFunds', or 'addTransaction'
  const [amount, setAmount] = useState('');
  const [transactionDetails, setTransactionDetails] = useState('');
  const [budgetType, setBudgetType] = useState('');
  const [targetAccount, setTargetAccount] = useState('');
  const [income, setIncome] = useState();
  const [selectedIncomeType, setSelectedIncomeType] = useState();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

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

        // Fetch income data
        // const userRef = doc(db, 'users', currentUser.uid);
        // const userSnap = await getDoc(userRef);
        // if (userSnap.exists()) {
        //   setIncome(userSnap.data().income || []); // Fetch the income array
        //   setBudgetTypes(userSnap.data().budget || []); // Fetch the budget array
        // }
        // To get all budget types
        const budgetRef = collection(db, 'users', currentUser.uid, 'budget');
        const budgetSnap = await getDocs(budgetRef);

        if (!budgetSnap.empty) {
          // Get the first document in the budget subcollection
          const firstBudgetDoc = budgetSnap.docs[0];
          const budgetData = firstBudgetDoc.data();
          if (budgetData && budgetData.list) {
            // Extract names from the list
            const budgetNames = budgetData.list.map((item) => item.name);
            setBudgetTypes(budgetNames);
          } else {
            setBudgetTypes([]); // No list found in the document
          }
        } else {
          console.log('No budget documents found.');
          setBudgetTypes([]);
        }
        const incomeRef = collection(db, 'users', currentUser.uid, 'income');
        const incomeSnap = await getDocs(incomeRef);

        if (!incomeSnap.empty) {
          // Get the first document in the income subcollection
          const firstIncomeDoc = incomeSnap.docs[0];
          const incomeData = firstIncomeDoc.data();
          console.log(incomeData);
          if (incomeData && incomeData.list) {
            // Extract names from the list
            const incomeNames = incomeData.list.map((item) => item.name);
            console.log(incomeNames);
            setIncome(incomeNames);
          } else {
            setIncome([]); // No list found in the document
          }
        } else {
          console.log('No budget documents found.');
          setIncome([]);
        }
      } catch (error) {
        console.error('Error fetching account details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccountDetails();
  }, [accountId, currentUser]);

  const handleAddFunds = async (selectedIncomeType) => {
    if (
      !amount ||
      isNaN(amount) ||
      parseFloat(amount) <= 0 ||
      !selectedIncomeType
    ) {
      alert('Please enter a valid amount and select an income type.');
      return;
    }

    try {
      const transactionAmount = parseFloat(amount);

      // Step 1: Update the account balance
      const accountRef = doc(
        db,
        'users',
        currentUser.uid,
        'accounts',
        accountId,
      );
      const newBalance = account.balance + transactionAmount;

      await updateDoc(accountRef, { balance: newBalance });

      // Step 2: Add a transaction for the funds added
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
        amount: transactionAmount,
        type: 'credit',
        incomeType: selectedIncomeType,
        timestamp: new Date(),
      });

      //   // Step 3: Update the actual value of the selected income type
      //   const userRef = doc(db, 'users', currentUser.uid);
      //   const userSnap = await getDoc(userRef);

      //   if (userSnap.exists()) {
      //     const userData = userSnap.data();
      //     const income = userData.income || [];

      //     // Find and update the income type
      //     const updatedIncome = income.map((item) => {
      //       if (item.name === selectedIncomeType) {
      //         return {
      //           ...item,
      //           actual: (item.actual || 0) + transactionAmount,
      //         };
      //       }
      //       return item;
      //     });

      //     // Save the updated income back to Firestore
      //     await updateDoc(userRef, { income: updatedIncome });

      //     // Optionally update local state for immediate UI updates
      //     setIncome(updatedIncome);
      //   }

      const incomeRef = collection(db, 'users', currentUser.uid, 'income');
      const incomeSnap = await getDocs(incomeRef);
      const currentDate = new Date(); // Get the current date
      const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];

      const currentMonthName = months[currentDate.getMonth()]; // Get the current month name
      const currentYear = currentDate.getFullYear(); // Get the current year
      const currentMonthIncomeDoc = incomeSnap.docs.find(
        (doc) =>
          doc.data().month === currentMonthName &&
          doc.data().year === currentYear,
      );
      console.log(currentMonthIncomeDoc);
      if (!currentMonthIncomeDoc) {
        console.error(
          'No income document found for the current month and year.',
        );
        return;
      }

      // Step 3: Get the document data and update the `actual` field for the specific income type
      const incomeData = currentMonthIncomeDoc.data();
      console.log(incomeData);
      const updatedList = incomeData.list.map((item) => {
        if (item.name === selectedIncomeType) {
          console.log('TRANSACTION', transactionAmount);
          console.log(item.actual, item);
          console.log('new', (item.actual || 0) + transactionAmount);
          return {
            ...item,
            actual: (item.actual || 0) + transactionAmount,
          };
        }
        return item;
      });
      // Step 4: Save the updated list back to Firestore
      const incomeDocRef = doc(
        db,
        'users',
        currentUser.uid,
        'income',
        currentMonthIncomeDoc.id,
      );
      await updateDoc(incomeDocRef, { list: updatedList });

      // Update the UI
      setAccount((prev) => ({ ...prev, balance: newBalance }));
      setTransactions((prev) => [
        ...prev,
        {
          description: 'Funds Added',
          amount: transactionAmount,
          type: 'credit',
          incomeType: selectedIncomeType,
        },
      ]);
      setAmount('');
      setModal(null); // Close the modal
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
  const handleAddTransaction = async () => {
    if (
      !amount ||
      isNaN(amount) ||
      parseFloat(amount) <= 0 ||
      !transactionDetails ||
      !budgetType
    ) {
      alert('Please enter valid details for the transaction.');
      return;
    }

    try {
      const transactionAmount = parseFloat(amount);

      // Step 1: Add the transaction to the "transactions" subcollection
      const transactionsRef = collection(
        db,
        'users',
        currentUser.uid,
        'accounts',
        accountId,
        'transactions',
      );

      await addDoc(transactionsRef, {
        description: transactionDetails,
        amount: transactionAmount,
        type: 'debit',
        budgetType,
        timestamp: new Date(),
      });

      setTransactions((prev) => [
        ...prev,
        {
          description: transactionDetails,
          amount: transactionAmount,
          type: 'debit',
          budgetType,
        },
      ]);

      // Step 2: Update the corresponding budget's "actual" value
      //   const userRef = doc(db, 'users', currentUser.uid);
      //   const userSnap = await getDoc(userRef);

      //   if (userSnap.exists()) {
      //     const userData = userSnap.data();
      //     const budget = userData.budget || [];

      //     // Find the budget type to update
      //     const updatedBudget = budget.map((item) => {
      //       if (item.name === budgetType) {
      //         return {
      //           ...item,
      //           actual: (item.actual || 0) + transactionAmount,
      //         };
      //       }
      //       return item;
      //     });

      //     // Save updated budget back to Firestore
      //     await updateDoc(userRef, { budget: updatedBudget });

      //     // Optionally update local state for immediate UI updates
      //     setBudgetTypes(updatedBudget);
      //   }
      // code to update budget
      const budgetRef = collection(db, 'users', currentUser.uid, 'budget');
      const budgetSnap = await getDocs(budgetRef);
      const currentDate = new Date(); // Get the current date
      const months = [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December',
      ];

      const currentMonthName = months[currentDate.getMonth()]; // Get the current month name
      const currentYear = currentDate.getFullYear(); // Get the current year
      const currentMonthBudgetDoc = budgetSnap.docs.find(
        (doc) =>
          doc.data().month === currentMonthName &&
          doc.data().year === currentYear,
      );
      console.log(currentMonthBudgetDoc);
      if (!currentMonthBudgetDoc) {
        console.error(
          'No budget document found for the current month and year.',
        );
        return;
      }

      // Step 3: Get the document data and update the `actual` field for the specific budget type
      const budgetData = currentMonthBudgetDoc.data();
      console.log(budgetData);
      const updatedList = budgetData.list.map((item) => {
        if (item.name === budgetType) {
          console.log('TRANSACTION', transactionAmount);
          console.log(item.actual, item);
          console.log('new', (item.actual || 0) + transactionAmount);
          return {
            ...item,
            actual: (item.actual || 0) + transactionAmount,
          };
        }
        return item;
      });
      // Step 4: Save the updated list back to Firestore
      const budgetDocRef = doc(
        db,
        'users',
        currentUser.uid,
        'budget',
        currentMonthBudgetDoc.id,
      );
      await updateDoc(budgetDocRef, { list: updatedList });

      console.log(updatedList);
      // Reset modal state
      setModal(null);
      setAmount('');
      setTransactionDetails('');
      setBudgetType('');
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  if (loading) {
    return <p className="text-center">Loading account details...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-lg mx-auto bg-white shadow rounded-lg p-4">
        <button
          onClick={() => navigate(-1)}
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
          <button
            onClick={() => setModal('addTransaction')}
            className="w-full bg-purple-600 text-white font-semibold py-2 px-4 rounded-lg shadow hover:bg-purple-700 transition"
          >
            Add Transaction
          </button>
        </div>

        <AddFundsModal
          isOpen={modal === 'addFunds'}
          onClose={() => setModal(null)}
          amount={amount}
          setAmount={setAmount}
          handleAddFunds={handleAddFunds}
          incomeTypes={income}
          selectedIncomeType={selectedIncomeType}
          setSelectedIncomeType={setSelectedIncomeType}
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

        <AddTransactionModal
          isOpen={modal === 'addTransaction'}
          onClose={() => setModal(null)}
          amount={amount}
          setAmount={setAmount}
          transactionDetails={transactionDetails}
          setTransactionDetails={setTransactionDetails}
          budgetTypes={budgetTypes}
          budgetType={budgetType}
          setBudgetType={setBudgetType}
          handleAddTransaction={handleAddTransaction}
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
