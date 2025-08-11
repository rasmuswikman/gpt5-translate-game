import React, { useEffect, useState } from "react";

type Word = { source: string; target: string };

const shuffle = <T,>(arr: T[]) => {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
};

const TranslateGame: React.FC<{ words: Word[] }> = ({ words }) => {
  const [wordIndex, setWordIndex] = useState(0);
  const [target, setTarget] = useState("");
  const [slots, setSlots] = useState<
    Array<{ id: string; char: string } | null>
  >([]);
  const [pool, setPool] = useState<Array<{ id: string; char: string }>>([]);
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    const current = words[wordIndex];
    const upperTarget = current.target.toUpperCase();
    setTarget(upperTarget);
    const chars = upperTarget
      .split("")
      .map((ch, i) => ({ id: `${i}-${ch}-${Math.random()}`, char: ch }));
    setPool(shuffle(chars));
    setSlots(Array(upperTarget.length).fill(null));
    setFeedback("");
  }, [wordIndex, words]);

  function onDragStart(e: React.DragEvent, id: string) {
    e.dataTransfer.setData("text/plain", id);
  }

  function onDragOver(e: React.DragEvent) {
    e.preventDefault();
  }

  function handleDropOnSlot(
    e: React.DragEvent<HTMLDivElement>,
    slotIndex: number
  ) {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (!id) return;

    let item = pool.find((p) => p.id === id) || null;

    if (!item) {
      setSlots((prev) => {
        const updated = [...prev];
        for (let i = 0; i < updated.length; i++) {
          if (updated[i]?.id === id) {
            item = updated[i];
            updated[i] = null;
            break;
          }
        }
        return updated;
      });
    }

    if (!item) return;

    setSlots((prev) => {
      const updated = [...prev];
      const replaced = updated[slotIndex];
      if (replaced) setPool((prevPool) => [...prevPool, replaced]);
      updated[slotIndex] = item!;
      return updated;
    });

    setPool((prev) => prev.filter((p) => p.id !== id));
    setTimeout(
      () => checkAnswer([...slots.map((s) => (s ? s : null))], target),
      0
    );
  }

  function handleDropOnPool(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (!id) return;

    setSlots((prev) => {
      const updated = [...prev];
      for (let i = 0; i < updated.length; i++) {
        if (updated[i]?.id === id) {
          setPool((prevPool) => [
            ...prevPool,
            updated[i] as { id: string; char: string },
          ]);
          updated[i] = null;
          break;
        }
      }
      return updated;
    });
  }

  function removeFromSlot(slotIndex: number) {
    setSlots((prev) => {
      const updated = [...prev];
      if (updated[slotIndex]) {
        setPool((prevPool) => [
          ...prevPool,
          updated[slotIndex] as { id: string; char: string },
        ]);
        updated[slotIndex] = null;
      }
      return updated;
    });
    setFeedback("");
  }

  function checkAnswer(
    currentSlots: Array<{ id: string; char: string } | null>,
    tgt: string
  ) {
    const answer = currentSlots.map((s) => (s ? s.char : "")).join("");
    if (answer.length === tgt.length) {
      if (answer === tgt) {
        setFeedback("✅ Correct!");
      } else {
        setFeedback("❌ Wrong, try again!");
      }
    } else {
      setFeedback("");
    }
  }

  function nextWord() {
    setWordIndex((i) => (i + 1) % words.length);
  }

  return (
    <div
      style={{
        fontFamily: "Inter, Arial, sans-serif",
        textAlign: "center",
        padding: 20,
      }}
    >
      <div style={{ fontSize: 18, marginBottom: 8 }}>
        Translate the verb (always in INFINITIVE)
      </div>
      <div style={{ fontSize: 28, fontWeight: 600, marginBottom: 24 }}>
        {words[wordIndex].source.toUpperCase()}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 8,
          marginBottom: 18,
        }}
      >
        {slots.map((slot, i) => (
          <div
            key={i}
            onDragOver={onDragOver}
            onDrop={(e) => handleDropOnSlot(e, i)}
            onClick={() => removeFromSlot(i)}
            style={{
              borderBottom: "2px solid black",
              width: 48,
              height: 48,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 26,
              cursor: slot ? "pointer" : "default",
            }}
          >
            {slot ? slot.char : ""}
          </div>
        ))}
      </div>

      <div
        onDragOver={onDragOver}
        onDrop={handleDropOnPool}
        style={{
          display: "flex",
          justifyContent: "center",
          gap: 12,
          flexWrap: "wrap",
          marginBottom: 12,
        }}
      >
        {pool.map((p) => (
          <div
            key={p.id}
            draggable
            onDragStart={(e) => onDragStart(e, p.id)}
            style={{
              fontSize: 26,
              padding: "8px 12px",
              border: "1px solid #111",
              borderRadius: 6,
              cursor: "grab",
              userSelect: "none",
            }}
          >
            {p.char}
          </div>
        ))}
      </div>

      {feedback && (
        <div style={{ fontSize: 18, marginBottom: 12 }}>{feedback}</div>
      )}

      <div>
        <button
          onClick={() => setWordIndex(wordIndex)}
          style={{ marginRight: 8 }}
        >
          Reset
        </button>
        <button onClick={nextWord} style={{ marginRight: 8 }}>
          Next
        </button>
      </div>
    </div>
  );
};

export default TranslateGame;
