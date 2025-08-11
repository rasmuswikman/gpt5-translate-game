import React, { useState } from "react";
import WordDisplay from "./WordDisplay";
import LetterDragDrop from "./LetterDragDrop";
import NextButton from "./NextButton";
import MessageDisplay from "./MessageDisplay";
import { DropResult } from "@hello-pangea/dnd";

interface WordPair {
  fi: string;
  sv: string;
}

const wordPairs: WordPair[] = [
  { fi: "kissa", sv: "katt" },
  { fi: "koira", sv: "hund" },
  { fi: "omena", sv: "äpple" },
  { fi: "talo", sv: "hus" },
  { fi: "kirja", sv: "bok" },
];

function shuffleArray<T>(array: T[]): T[] {
  const arr = array.slice();
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const SanaShuffle: React.FC = () => {
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [letters, setLetters] = useState<string[]>(() =>
    shuffleArray(wordPairs[0].sv.toUpperCase().split(""))
  );
  const [message, setMessage] = useState("");

  const onDragStart = () => {
    document.body.style.overflow = "hidden";
  };

  const onDragEnd = (result: DropResult) => {
    document.body.style.overflow = "";

    if (!result.destination) return;

    const newLetters = Array.from(letters);
    const [moved] = newLetters.splice(result.source.index, 1);
    newLetters.splice(result.destination.index, 0, moved);

    setLetters(newLetters);

    const answer = newLetters.join("");
    if (answer === wordPairs[currentPairIndex].sv.toUpperCase()) {
      setMessage("Correct! 🎉");
    } else {
      setMessage("");
    }
  };

  const nextWord = () => {
    const nextIndex = (currentPairIndex + 1) % wordPairs.length;
    setCurrentPairIndex(nextIndex);
    setLetters(shuffleArray(wordPairs[nextIndex].sv.toUpperCase().split("")));
    setMessage("");
  };

  return (
    <div className="font-sans text-center select-none p-6 max-w-screen-md mx-auto">
      <WordDisplay finnishWord={wordPairs[currentPairIndex].fi} />

      <LetterDragDrop
        letters={letters}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
      />

      <MessageDisplay message={message} />

      {message === "Correct! 🎉" && <NextButton onClick={nextWord} />}
    </div>
  );
};

export default SanaShuffle;
