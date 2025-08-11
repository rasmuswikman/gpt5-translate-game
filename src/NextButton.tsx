import React from "react";

interface NextButtonProps {
  onClick: () => void;
}

const NextButton: React.FC<NextButtonProps> = ({ onClick }) => (
  <button
    onClick={onClick}
    className="mt-2 px-8 py-3 bg-blue-600 text-white text-lg font-semibold rounded-full shadow-md
      hover:bg-blue-700 transition-colors duration-300 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
  >
    Next Word
  </button>
);

export default NextButton;
