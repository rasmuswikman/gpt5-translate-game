import React from "react";

interface WordDisplayProps {
  finnishWord: string;
}

const WordDisplay: React.FC<WordDisplayProps> = ({ finnishWord }) => (
  <p className="text-lg mb-8 text-gray-600 font-semibold tracking-wide">
    Finnish word: <span className="text-blue-600 uppercase">{finnishWord}</span>
  </p>
);

export default WordDisplay;
