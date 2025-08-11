import React from "react";
import { createRoot } from "react-dom/client";
import TranslateGame from "./TranslateGame";

// All `target` values MUST be Finnish infinitives (lowercase or mixed — the component uppercases them).
const WORDS = [
  { source: "HOPPA", target: "hypätä" }, // hoppa -> hypätä (to jump)
  { source: "SPRINGA", target: "juosta" }, // springa -> juosta (to run)
  { source: "SOVA", target: "nukkua" }, // sova -> nukkua (to sleep)
];

const App: React.FC = () => {
  return (
    <div>
      <h1 style={{ textAlign: "center" }}>
        Translate Swedish verbs to Finnish (infinitive)
      </h1>
      <TranslateGame words={WORDS} />
    </div>
  );
};

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(<App />);
