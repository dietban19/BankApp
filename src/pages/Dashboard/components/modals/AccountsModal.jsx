import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { useAuth } from '../../../../context/AuthContext';

const SlideUpModal = ({
  isOpen,
  onClose,
  transferType,
  setTransfer,
  accounts,
  setIndex,
}) => {
  console.log(accounts);
  function handleChooseAccount(account, index) {
    setIndex(index);
    setTransfer(account);
    onClose();
  }
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 bg-black/50 bg-opacity-50 z-[101] flex justify-center items-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose} // Close when clicking outside
          >
            {/* Modal */}
            <motion.div
              className=" h-[95%] bg-white  rounded-2xl fixed bottom-0  w-full p-4"
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', stiffness: 100, damping: 15 }}
            >
              {/* Close Button */}
              <button
                className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 "
                onClick={onClose}
              >
                <X size={24} />
              </button>

              {/* Modal Content */}
              <h2 className="text-lg font-semibold text-gray-800 ">
                {transferType} Account
              </h2>
              <div className=" h-[95%] overflow-scroll ">
                <ul className=" flex flex-col gap-2 ">
                  {accounts.map((account, ind) => (
                    <li
                      key={ind}
                      className="p-5 border-b-[0.5px] flex flex-col gap-2"
                      onClick={() => handleChooseAccount(account, ind)}
                    >
                      <div className="">{account.name}</div>
                      <div className="text-sm text-green-700">
                        ${account.balance.toFixed(2)}
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
export default SlideUpModal;
