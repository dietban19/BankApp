import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, ArrowLeft, CheckCircle } from 'lucide-react';
import { collection, addDoc, updateDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { db } from '../../../config/firebase';
const categories = [
  'Groceries',
  'Savings',
  'Rent',
  'Bills',
  'Entertainment',
  'Travel',
  'Emergency',
];
const currencies = ['USD', 'EUR', 'GBP', 'CAD', 'AUD'];

const AddAccountModal = ({ modalOpen, setModalOpen, setAccounts }) => {
  const [step, setStep] = useState(1);
  const [accountName, setAccountName] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [customCategory, setCustomCategory] = useState('');
  const [startingBalance, setStartingBalance] = useState('');
  const [monthlyLimit, setMonthlyLimit] = useState('');
  const [selectedCurrency, setSelectedCurrency] = useState('USD');
  const [description, setDescription] = useState('');

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  // Function to add the account to Firestore
  async function handleAddAccount() {
    if (!accountName || (!selectedCategory && !customCategory)) {
      alert('Please enter an account name and select a category.');
      return;
    }

    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert('User not authenticated.');
      return;
    }

    const newAccount = {
      id: Date.now(), // Unique ID
      name: accountName,
      type: customCategory || selectedCategory,
      balance: parseFloat(startingBalance) || 0,
      monthlyLimit: parseFloat(monthlyLimit) || 0,
      currency: selectedCurrency,
      description: description,
      createdAt: new Date(),
    };

    try {
      // Reference to the user's "accounts" subcollection in Firestore
      const accountsRef = collection(db, 'users', user.uid, 'accounts');
      const docRef = await addDoc(accountsRef, newAccount);

      // Update the document with its own ID
      await updateDoc(docRef, { documentId: docRef.id });

      // Update local state (if needed)
      setAccounts((prev) => [...prev, newAccount]);

      // Reset form and close modal
      setAccountName('');
      setSelectedCategory('');
      setCustomCategory('');
      setStartingBalance('');
      setMonthlyLimit('');
      setSelectedCurrency('USD');
      setDescription('');
      setModalOpen(false);

      alert('Account added successfully!');
    } catch (error) {
      console.error('Error adding account:', error);
      alert('Failed to add account. Please try again.');
    }
  }
  console.log(modalOpen);
  return (
    <AnimatePresence>
      {modalOpen && (
        <motion.div
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white p-6 h-full w-full max-w-lg mx-auto rounded-xl shadow-xl overflow-y-auto"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                ➕ Add Account
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700 transition"
                onClick={() => setModalOpen(false)}
              >
                ✖
              </button>
            </div>

            {/* Step Progress */}
            <div className="mb-4 flex items-center justify-center space-x-2">
              {[1, 2, 3].map((s) => (
                <div
                  key={s}
                  className={`w-6 h-6 rounded-full ${
                    step === s ? 'bg-green-500' : 'bg-gray-300'
                  } transition`}
                ></div>
              ))}
            </div>

            {/* Step 1: Account Name & Type */}
            {step === 1 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-gray-600 mb-4">
                  First, let's name your account and select its type.
                </p>
                <label className="block text-sm font-medium text-gray-600">
                  Account Name
                </label>
                <input
                  type="text"
                  className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  placeholder="Enter account name"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                />

                <p className="text-sm font-medium text-gray-600 mt-4">
                  Account Type
                </p>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      className={`px-4 py-2 rounded-md text-sm font-medium transition whitespace-nowrap ${
                        selectedCategory === category
                          ? 'bg-green-500 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                      onClick={() => {
                        setSelectedCategory(category);
                        setCustomCategory('');
                      }}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                <input
                  type="text"
                  className="w-full mt-2 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  placeholder="Or enter custom account type..."
                  value={customCategory}
                  onChange={(e) => {
                    setCustomCategory(e.target.value);
                    setSelectedCategory('');
                  }}
                />
              </motion.div>
            )}

            {/* Step 2: Financial Details */}
            {step === 2 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-gray-600 mb-4">
                  Now, let's add some financial details.
                </p>

                <label className="block text-sm font-medium text-gray-600">
                  Starting Balance
                </label>
                <input
                  type="number"
                  className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  placeholder="Enter starting balance"
                  value={startingBalance}
                  onChange={(e) => setStartingBalance(e.target.value)}
                />

                <label className="block text-sm font-medium text-gray-600 mt-4">
                  Monthly Budget Limit
                </label>
                <input
                  type="number"
                  className="w-full mt-1 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-green-500"
                  placeholder="Set a budget limit"
                  value={monthlyLimit}
                  onChange={(e) => setMonthlyLimit(e.target.value)}
                />
              </motion.div>
            )}

            {/* Step 3: Additional Information */}
            {step === 3 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <p className="text-gray-600 mb-4">
                  Almost done! Add any extra details.
                </p>

                <label className="block text-sm font-medium text-gray-600">
                  Description / Notes
                </label>
                <textarea
                  className="w-full mt-1 p-3 border border-gray-300 rounded-md"
                  placeholder="Additional details..."
                  rows="3"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </motion.div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6">
              {step > 1 && (
                <button
                  onClick={prevStep}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition flex items-center"
                >
                  <ArrowLeft className="mr-2" /> Back
                </button>
              )}
              {step < 3 ? (
                <button
                  onClick={nextStep}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center"
                >
                  Next <ArrowRight className="ml-2" />
                </button>
              ) : (
                <button
                  onClick={handleAddAccount}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition flex items-center"
                >
                  Save <CheckCircle className="ml-2" />
                </button>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddAccountModal;
