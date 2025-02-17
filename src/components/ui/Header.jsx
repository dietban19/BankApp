import { FaArrowLeft } from 'react-icons/fa';
import { MdKeyboardArrowLeft } from 'react-icons/md';
const Header = ({ title, onBack }) => {
  return (
    <header className="flex items-center justify-between p-4  relative text-white">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="absolute left-4 p-2 rounded-full hover:bg-gray-200 transition"
      >
        <MdKeyboardArrowLeft className="text-xl shrink-0" size={35} />
      </button>

      {/* Centered Title */}
      <h1 className="text-lg font-semibold mx-auto">{title}</h1>
    </header>
  );
};

export default Header;
