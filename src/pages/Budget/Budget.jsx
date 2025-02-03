import React, { useState, useEffect } from 'react';
import Tabs from '../../components/Tabs';
import { db } from '../../config/firebase';
import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  getDoc,
  setDoc,
} from 'firebase/firestore';
import { useAuth } from '../../context/AuthContext';
import OverallBudgets from './OverallBudgets';
import ExpenseComparison from './Comparison';
import IncomeComparisonChart from './IncomeChart';
import ExpensesTable from './ExpensesTable';
import IncomeTable from './IncomeTable';
import AddBudgetModal from './AddBudgetModal';
import AddIncomeModal from './AddIncomeModal';

const months = [
  { month: 'January', number: '01' },
  { month: 'February', number: '02' },
  { month: 'March', number: '03' },
  { month: 'April', number: '04' },
  { month: 'May', number: '05' },
  { month: 'June', number: '06' },
  { month: 'July', number: '07' },
  { month: 'August', number: '08' },
  { month: 'September', number: '09' },
  { month: 'October', number: '10' },
  { month: 'November', number: '11' },
  { month: 'December', number: '12' },
];

const calculateDiff = (planned, actual) => actual - planned;

function Budget() {
  const { currentUser } = useAuth();
  const [currentMonthBudget, setCurrentMonthBudget] = useState(null);
  const [currentMonthBudgetList, setCurrentMonthBudgetList] = useState(null);

  const [allBudgets, setAllBudgets] = useState([]);
  const [currentMonthIncome, setCurrentMonthIncome] = useState(null);
  const [currentMonthIncomeList, setCurrentMonthIncomeList] = useState(null);

  const [allIncomes, setAllIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [newBudget, setNewBudget] = useState({ name: '', planned: '' });
  const [incomeModalOpen, setIncomeModalOpen] = useState(false);
  const [newIncome, setNewIncome] = useState({ name: '', planned: '' });
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const currentMonthNumber = String(currentDate.getMonth() + 1).padStart(
    2,
    '0',
  );
  const currentMonthName = months[currentDate.getMonth()].month;

  useEffect(() => {
    const fetchBudgets = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);

        const budgetRef = collection(db, 'users', currentUser.uid, 'budget');
        const budgetSnap = await getDocs(budgetRef);

        let budgets = budgetSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Ensure each month in the current year has a document
        const missingMonths = [];
        for (const { month, number } of months) {
          const monthExists = budgets.some(
            (b) => b.year === currentYear && b.number === number,
          );

          if (!monthExists) {
            missingMonths.push({ month, number });
          }
        }

        // Create missing months
        if (missingMonths.length > 0) {
          await Promise.all(
            missingMonths.map(({ month, number }) =>
              addNewBudgetForMonth(month, number, currentYear),
            ),
          );

          // Re-fetch budgets to include the newly created months
          const updatedBudgetSnap = await getDocs(budgetRef);
          budgets = updatedBudgetSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        }

        // Filter and set the current month's budget after ensuring all months exist
        const currentBudget = budgets.find(
          (b) => b.year === currentYear && b.number === currentMonthNumber,
        );

        setCurrentMonthBudget(currentBudget || null);
        setCurrentMonthBudgetList(currentBudget?.list);
        setAllBudgets(budgets);
      } catch (error) {
        console.error('Error fetching budgets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBudgets();
  }, [currentUser]);
  useEffect(() => {
    const fetchIncomes = async () => {
      if (!currentUser) return;

      try {
        setLoading(true);

        const incomeRef = collection(db, 'users', currentUser.uid, 'income');
        const incomeSnap = await getDocs(incomeRef);

        let incomes = incomeSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));

        // Ensure each month in the current year has a document
        const missingMonths = [];
        for (const { month, number } of months) {
          const monthExists = incomes.some(
            (i) => i.year === currentYear && i.number === number,
          );

          if (!monthExists) {
            missingMonths.push({ month, number });
          }
        }

        // Create missing months
        if (missingMonths.length > 0) {
          await Promise.all(
            missingMonths.map(({ month, number }) =>
              addNewIncomeForMonth(month, number, currentYear),
            ),
          );

          // Re-fetch incomes to include the newly created months
          const updatedIncomeSnap = await getDocs(incomeRef);
          incomes = updatedIncomeSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
        }

        // Filter and set the current month's income after ensuring all months exist
        const currentIncome = incomes.find(
          (i) => i.year === currentYear && i.number === currentMonthNumber,
        );

        setCurrentMonthIncome(currentIncome || null);
        setCurrentMonthIncomeList(currentIncome?.list);
        setAllIncomes(incomes);
      } catch (error) {
        console.error('Error fetching incomes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchIncomes();
  }, [currentUser]);
  const addNewBudgetForMonth = async (month, number, year) => {
    try {
      const budgetId = `${year}-${number}`; // Unique ID for each document
      const budgetDocRef = doc(
        db,
        'users',
        currentUser.uid,
        'budget',
        budgetId,
      );

      // Use setDoc to ensure the document is only created once
      await setDoc(
        budgetDocRef,
        {
          month,
          number,
          year,
          list: [],
        },
        { merge: true }, // Avoid overwriting existing data
      );
    } catch (error) {
      console.error(`Error creating budget for ${month} ${year}:`, error);
    }
  };

  const handleAddBudgetType = async () => {
    if (
      !newBudget.name.trim() ||
      !newBudget.planned ||
      isNaN(newBudget.planned)
    ) {
      alert('Please enter a valid budget name and planned amount.');
      return;
    }

    try {
      const budgetRef = collection(db, 'users', currentUser.uid, 'budget');
      const budgetSnap = await getDocs(budgetRef);

      // Prepare the new budget type to add
      const newBudgetType = {
        name: newBudget.name.trim(),
        planned: parseFloat(newBudget.planned),
        actual: 0,
      };

      // Loop through each budget document and update the list
      const updatePromises = budgetSnap.docs.map(async (docSnap) => {
        const budgetData = docSnap.data();
        const updatedList = [...budgetData.list, newBudgetType];

        // Update the document with the new budget type
        const docRef = doc(db, 'users', currentUser.uid, 'budget', docSnap.id);
        return updateDoc(docRef, { list: updatedList });
      });

      await Promise.all(updatePromises);

      // Update the current month's budget state
      setCurrentMonthBudget((prev) => ({
        ...prev,
        list: [...prev.list, newBudgetType],
      }));

      // Clear modal and input state
      setModalOpen(false);
      setNewBudget({ name: '', planned: '' });

      console.log('Budget type added to all months successfully!');
    } catch (error) {
      console.error('Error adding budget type to all months:', error);
    }
  };
  const handleDeleteBudgetType = async (budgetName) => {
    if (!budgetName.trim()) {
      alert('Please enter a valid budget name to delete.');
      return;
    }

    try {
      const budgetRef = collection(db, 'users', currentUser.uid, 'budget');
      const budgetSnap = await getDocs(budgetRef);

      // Loop through each budget document and update the list
      const updatePromises = budgetSnap.docs.map(async (docSnap) => {
        const budgetData = docSnap.data();
        const updatedList = budgetData.list.filter(
          (item) => item.name !== budgetName.trim(),
        );

        // Update the document with the filtered list
        const docRef = doc(db, 'users', currentUser.uid, 'budget', docSnap.id);
        return updateDoc(docRef, { list: updatedList });
      });

      await Promise.all(updatePromises);

      // Update the current month's budget state
      setCurrentMonthBudget((prev) => ({
        ...prev,
        list: prev.list.filter((item) => item.name !== budgetName.trim()),
      }));

      console.log(
        `Budget type '${budgetName}' deleted successfully from all months!`,
      );
    } catch (error) {
      console.error('Error deleting budget type from all months:', error);
    }
  };

  const handleDeleteIncomeType = async (incomeName) => {
    if (!incomeName.trim()) {
      alert('Please enter a valid income name to delete.');
      return;
    }

    try {
      const incomeRef = collection(db, 'users', currentUser.uid, 'income');
      const incomeSnap = await getDocs(incomeRef);

      // Loop through each income document and update the list
      const updatePromises = incomeSnap.docs.map(async (docSnap) => {
        const incomeData = docSnap.data();
        const updatedList = incomeData.list.filter(
          (item) => item.name !== incomeName.trim(),
        );

        // Update the document with the filtered list
        const docRef = doc(db, 'users', currentUser.uid, 'income', docSnap.id);
        return updateDoc(docRef, { list: updatedList });
      });

      await Promise.all(updatePromises);

      // Update the current month's income state
      setCurrentMonthIncome((prev) => ({
        ...prev,
        list: prev.list.filter((item) => item.name !== incomeName.trim()),
      }));

      console.log(
        `Income type '${incomeName}' deleted successfully from all months!`,
      );
    } catch (error) {
      console.error('Error deleting income type from all months:', error);
    }
  };
  const addNewIncomeForMonth = async (month, number, year) => {
    try {
      const incomeId = `${year}-${number}`; // Unique ID for each document
      const incomeDocRef = doc(
        db,
        'users',
        currentUser.uid,
        'income',
        incomeId,
      );

      // Use setDoc to ensure the document is only created once
      await setDoc(
        incomeDocRef,
        {
          month,
          number,
          year,
          list: [],
        },
        { merge: true }, // Avoid overwriting existing data
      );
    } catch (error) {
      console.error(`Error creating income for ${month} ${year}:`, error);
    }
  };

  const handleAddIncomeType = async () => {
    if (
      !newIncome.name.trim() ||
      !newIncome.planned ||
      isNaN(newIncome.planned)
    ) {
      alert('Please enter a valid income name and planned amount.');
      return;
    }

    try {
      const incomeRef = collection(db, 'users', currentUser.uid, 'income');
      const incomeSnap = await getDocs(incomeRef);

      // Prepare the new income type to add
      const newIncomeType = {
        name: newIncome.name.trim(),
        planned: parseFloat(newIncome.planned),
        actual: 0,
      };

      // Loop through each income document and update the list
      const updatePromises = incomeSnap.docs.map(async (docSnap) => {
        const incomeData = docSnap.data();
        const updatedList = [...incomeData.list, newIncomeType];

        // Update the document with the new income type
        const docRef = doc(db, 'users', currentUser.uid, 'income', docSnap.id);
        return updateDoc(docRef, { list: updatedList });
      });

      await Promise.all(updatePromises);

      // Update the current month's income state
      setCurrentMonthIncome((prev) => ({
        ...prev,
        list: [...prev.list, newIncomeType],
      }));

      // Clear modal and input state
      setIncomeModalOpen(false);
      setNewIncome({ name: '', planned: '' });

      console.log('Income type added to all months successfully!');
    } catch (error) {
      console.error('Error adding income type to all months:', error);
    }
  };
  const expenses = [
    { name: 'Rent', planned: 1000, actual: 1050 },
    { name: 'Groceries', planned: 300, actual: 280 },
    { name: 'Utilities', planned: 150, actual: 180 },
  ];
  if (loading) {
    return <p className="text-center mt-6">Loading budget data...</p>;
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-16 overflow-x-hidden">
      {/* Budget Header */}
      {/* <header className="bg-green-600 text-white p-6 shadow-md text-center">
        <h1 className="text-2xl font-bold">Budget Overview</h1>
        <p className="text-sm mt-1">
          Viewing budget for {currentMonthName} {currentYear}
        </p>
      </header> */}

      {/* Main Content */}

      <main className="max-w-4xl mx-auto">
        {currentMonthBudget ? (
          <section className="mb-6  ">
            <div className="p-6 bg-gradient-to-r from-green-500 to-green-700  shadow-lg text-white relative overflow-hidden">
              {/* Decorative Blur Effect */}
              <div className="absolute inset-0 bg-green-800 opacity-10 blur-2xl"></div>

              {/* Content Container */}
              <div className="relative">
                <h2 className="text-2xl font-bold">
                  Budget Overview – {currentMonthName} {currentYear}
                </h2>
                <p className="text-sm text-gray-200 mt-1">
                  Manage your finances effectively and stay on track.
                </p>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-5">
                  <button
                    onClick={() => setModalOpen(true)}
                    className="w-full sm:w-auto bg-white text-green-700 font-semibold py-2 px-6 rounded-full shadow-md hover:bg-green-100 transition-all duration-300"
                  >
                    + Add Budget Type
                  </button>
                  <button
                    onClick={() => setIncomeModalOpen(true)}
                    className="w-full sm:w-auto bg-white text-green-700 font-semibold py-2 px-6 rounded-full shadow-md hover:bg-green-100 transition-all duration-300"
                  >
                    + Add Income Type
                  </button>
                </div>
              </div>
            </div>
            <div className="flex flex-col">
              <ExpenseComparison expenses={currentMonthBudgetList} />
              <IncomeComparisonChart income={currentMonthIncomeList} />
            </div>
            {/* <h3 className="text-lg font-bold mt-6 text-gray-700">Expenses</h3>
            <div className="overflow-x-auto bg-white rounded-lg shadow-md mt-2">
              <table className="table-auto w-full">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-gray-600">Name</th>
                    <th className="px-4 py-2 text-right text-gray-600">
                      Planned
                    </th>
                    <th className="px-4 py-2 text-right text-gray-600">
                      Actual
                    </th>
                    <th className="px-4 py-2 text-right text-gray-600">Diff</th>
                  </tr>
                </thead>
                <tbody>
                  {currentMonthBudget.list.map((item, index) => (
                    <tr
                      key={index}
                      className={`border-t ${
                        index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
                      }`}
                    >
                      <td className="px-4 py-2">{item.name}</td>
                      <td className="px-4 py-2 text-right">
                        ${item.planned.toFixed(2)}
                      </td>
                      <td className="px-4 py-2 text-right">
                        ${item.actual.toFixed(2)}
                      </td>
                      <td
                        className={`px-4 py-2 text-right font-semibold ${
                          calculateDiff(item.planned, item.actual) > 0
                            ? 'text-red-600'
                            : 'text-green-600'
                        }`}
                      >
                        ${calculateDiff(item.planned, item.actual).toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div> */}
            <div className=" bg-gray-100 w-full flex justify-center">
              <ExpensesTable
                // expenses={expenses}
                expenses={currentMonthBudgetList}
                calculateDiff={calculateDiff}
                setExpenses={setCurrentMonthBudgetList}
                handleDeleteBudgetType={handleDeleteBudgetType}
              />
            </div>
          </section>
        ) : (
          <p className="text-center text-gray-500">
            No budget data available for this month.
          </p>
        )}

        {currentMonthIncome && (
          //   <section className="mb-6">
          //     <h3 className="text-lg font-bold mt-6 text-gray-700">Income</h3>
          //     <div className="overflow-x-auto bg-white rounded-lg shadow-md mt-2">
          //       <table className="table-auto w-full">
          //         <thead className="bg-gray-100">
          //           <tr>
          //             <th className="px-4 py-2 text-left text-gray-600">Name</th>
          //             <th className="px-4 py-2 text-right text-gray-600">
          //               Planned
          //             </th>
          //             <th className="px-4 py-2 text-right text-gray-600">
          //               Actual
          //             </th>
          //             <th className="px-4 py-2 text-right text-gray-600">Diff</th>
          //           </tr>
          //         </thead>
          //         <tbody>
          //           {currentMonthIncome.list.map((item, index) => (
          //             <tr
          //               key={index}
          //               className={`border-t ${
          //                 index % 2 === 0 ? 'bg-gray-50' : 'bg-white'
          //               }`}
          //             >
          //               <td className="px-4 py-2">{item.name}</td>
          //               <td className="px-4 py-2 text-right">
          //                 ${item.planned.toFixed(2)}
          //               </td>
          //               <td className="px-4 py-2 text-right">
          //                 ${item.actual.toFixed(2)}
          //               </td>
          //               <td
          //                 className={`px-4 py-2 text-right font-semibold ${
          //                   calculateDiff(item.planned, item.actual) > 0
          //                     ? 'text-red-600'
          //                     : 'text-green-600'
          //                 }`}
          //               >
          //                 ${calculateDiff(item.planned, item.actual).toFixed(2)}
          //               </td>
          //             </tr>
          //           ))}
          //         </tbody>
          //       </table>
          //     </div>
          //   </section>
          <>
            <IncomeTable
              income={currentMonthIncomeList}
              calculateDiff={calculateDiff}
              setIncome={setCurrentMonthIncomeList}
              handleDeleteIncome={handleDeleteIncomeType}
            />
          </>
        )}
      </main>

      {/* List of Months */}
      <footer className="p-4">
        <h2 className="text-lg font-bold text-gray-800 mb-4">All Months</h2>
        <ul className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {months.map((month, index) => (
            <li
              key={index}
              className="bg-gray-200 text-center py-2 rounded-lg text-gray-800 font-medium"
            >
              {month.month}
            </li>
          ))}
        </ul>
      </footer>

      <AddBudgetModal
        isOpen={modalOpen}
        setModalOpen={setModalOpen}
        newBudget={newBudget}
        setNewBudget={setNewBudget}
        handleAddBudgetType={handleAddBudgetType}
      />
      <AddIncomeModal
        isOpen={incomeModalOpen}
        setModalOpen={setIncomeModalOpen}
        newIncome={newIncome}
        setNewIncome={setNewIncome}
        handleAddIncomeType={handleAddIncomeType}
      />
      <Tabs />
    </div>
  );
}

export default Budget;
