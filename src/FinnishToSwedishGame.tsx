import React, { useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";

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

const FinnishToSwedishGame: React.FC = () => {
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [letters, setLetters] = useState<string[]>(() =>
    shuffleArray(wordPairs[0].sv.toUpperCase().split(""))
  );
  const [message, setMessage] = useState("");

  const onDragEnd = (result: DropResult) => {
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
    <>
      {/* Google Fonts link */}
      <link
        href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600&display=swap"
        rel="stylesheet"
      />
      <div
        style={{
          fontFamily: "'Montserrat', sans-serif",
          textAlign: "center",
          userSelect: "none",
          padding: "1rem",
        }}
      >
        <h1 style={{ marginBottom: "1rem", fontWeight: 600, color: "#333" }}>
          Guess the Swedish translation
        </h1>
        <p
          style={{
            fontSize: "1.25rem",
            marginBottom: "2rem",
            color: "#555",
            fontWeight: 600,
            letterSpacing: 1,
          }}
        >
          Finnish word:{" "}
          <span style={{ color: "#0070f3" }}>
            {wordPairs[currentPairIndex].fi.toUpperCase()}
          </span>
        </p>

        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="letters" direction="horizontal">
            {(provided) => (
              <div
                ref={provided.innerRef}
                {...provided.droppableProps}
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: 12,
                  flexWrap: "wrap",
                  marginBottom: 24,
                  padding: "0 1rem",
                }}
              >
                {letters.map((letter, index) => (
                  <Draggable
                    key={`${letter}-${index}`}
                    draggableId={`${letter}-${index}`}
                    index={index}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          userSelect: "none",
                          padding: "16px 20px",
                          fontSize: 28,
                          fontWeight: "700",
                          color: snapshot.isDragging ? "#fff" : "#222",
                          backgroundColor: snapshot.isDragging
                            ? "#0070f3"
                            : "#e0e7ff",
                          borderRadius: 12,
                          boxShadow: snapshot.isDragging
                            ? "0 8px 16px rgba(0,112,243,0.4)"
                            : "0 4px 8px rgba(0,0,0,0.1)",
                          textAlign: "center",
                          width: 50,
                          height: 50,
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          cursor: "grab",
                          transition:
                            "background-color 0.3s, box-shadow 0.3s, color 0.3s",
                          ...provided.draggableProps.style,
                        }}
                        aria-label={`Letter ${letter}`}
                        role="button"
                        tabIndex={0}
                      >
                        {letter}
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>

        <p
          style={{
            marginTop: 24,
            fontWeight: "700",
            minHeight: 28,
            fontSize: "1.1rem",
            color: message === "Correct! 🎉" ? "#0070f3" : "#d00",
            transition: "color 0.3s",
          }}
        >
          {message}
        </p>

        {message === "Correct! 🎉" && (
          <button
            onClick={nextWord}
            style={{
              backgroundColor: "#0070f3",
              color: "#fff",
              border: "none",
              padding: "12px 32px",
              fontSize: "1.1rem",
              fontWeight: "600",
              borderRadius: 24,
              cursor: "pointer",
              boxShadow: "0 6px 12px rgba(0,112,243,0.4)",
              transition: "background-color 0.3s",
              marginTop: 10,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.backgroundColor = "#005bb5")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.backgroundColor = "#0070f3")
            }
          >
            Next Word
          </button>
        )}
      </div>
    </>
  );
};

export default FinnishToSwedishGame;
