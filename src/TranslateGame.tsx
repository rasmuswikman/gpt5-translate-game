import React, { useEffect, useState } from "react";

type Word = { source: string; target: string }; // `target` must be the FINNISH infinitive (e.g. "hypätä")

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
  const current = words[wordIndex];
  const target = current.target.toUpperCase(); // use uppercase for display

  // each slot may contain an item or null
  const [slots, setSlots] = useState<
    Array<{ id: string; char: string } | null>
  >([]);
  // pool of available letters (objects so duplicates are unique)
  const [pool, setPool] = useState<Array<{ id: string; char: string }>>([]);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    initForWord(wordIndex);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wordIndex]);

  function initForWord(index: number) {
    setSuccess(false);
    const chars = target.split("");
    const items = chars.map((ch, i) => ({
      id: `${i}-${ch}-${Math.random().toString(36).slice(2)}`,
      char: ch,
    }));
    setPool(shuffle(items));
    setSlots(Array(chars.length).fill(null));
  }

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

    // Try to find item in pool
    const itemInPool = pool.find((p) => p.id === id);

    // If not in pool, it may come from another slot; remove it from that slot
    let item = itemInPool ?? null;
    if (!item) {
      let found: { id: string; char: string } | null = null;
      setSlots((prev) => {
        const newSlots = [...prev];
        for (let i = 0; i < newSlots.length; i++) {
          const s = newSlots[i];
          if (s && s.id === id) {
            found = s;
            newSlots[i] = null;
            break;
          }
        }
        return newSlots;
      });
      item = found;
    }

    if (!item) return;

    // If slot already had a letter, move it back to pool
    setSlots((prev) => {
      const newSlots = [...prev];
      const replaced = newSlots[slotIndex];
      if (replaced) {
        setPool((prevPool) => [...prevPool, replaced]);
      }
      newSlots[slotIndex] = item!;
      return newSlots;
    });

    // Remove from pool (if it was there)
    setPool((prev) => prev.filter((p) => p.id !== id));

    // small delay to let states settle before checking
    setTimeout(checkAnswer, 0);
  }

  function handleDropOnPool(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault();
    const id = e.dataTransfer.getData("text/plain");
    if (!id) return;

    let moved: { id: string; char: string } | null = null;
    setSlots((prev) => {
      const newSlots = [...prev];
      for (let i = 0; i < newSlots.length; i++) {
        const s = newSlots[i];
        if (s && s.id === id) {
          moved = s;
          newSlots[i] = null;
          break;
        }
      }
      return newSlots;
    });

    if (moved) setPool((prev) => [...prev, moved!]);
  }

  function removeFromSlot(slotIndex: number) {
    setSlots((prev) => {
      const newSlots = [...prev];
      const s = newSlots[slotIndex];
      if (s) {
        setPool((prevPool) => [...prevPool, s]);
        newSlots[slotIndex] = null;
      }
      return newSlots;
    });
  }

  function checkAnswer() {
    const answer = slots.map((s) => (s ? s.char : "")).join("");
    if (answer.length === target.length && answer === target) {
      setSuccess(true);
    } else {
      setSuccess(false);
    }
  }

  function nextWord() {
    setWordIndex((i) => (i + 1) % words.length);
  }

  function reset() {
    initForWord(wordIndex);
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
        {current.source.toUpperCase()}
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
            onClick={() => removeFromSlot(i)}
            title={slot ? "Click to return to pool" : "Drop a letter here"}
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

      <div style={{ marginTop: 12 }}>
        <button onClick={reset} style={{ marginRight: 8 }}>
          Reset
        </button>
        <button
          onClick={nextWord}
          disabled={!success}
          style={{ marginRight: 8 }}
        >
          Next
        </button>
        {success && (
          <span style={{ color: "green", marginLeft: 8 }}>
            Correct — well done!
          </span>
        )}
      </div>

      <div style={{ marginTop: 16, fontSize: 12, color: "#666" }}>
        Tip: drag letters into the dashes. Click an occupied dash to return the
        letter to the pool.
      </div>
    </div>
  );
};

export default TranslateGame;
