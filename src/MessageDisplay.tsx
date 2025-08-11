import React from "react";

interface MessageDisplayProps {
  message: string;
}

const MessageDisplay: React.FC<MessageDisplayProps> = ({ message }) => (
  <p
    className={`mt-6 font-bold min-h-[28px] text-lg transition-colors duration-300 ${
      message === "Correct! 🎉" ? "text-blue-600" : "text-red-600"
    }`}
  >
    {message}
  </p>
);

export default MessageDisplay;
