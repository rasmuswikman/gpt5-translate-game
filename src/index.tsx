import React from "react";
import ReactDOM from "react-dom/client"; // note: react-dom/client import
import FinnishToSwedishGame from "./FinnishToSwedishGame";

const container = document.getElementById("root");
if (!container) throw new Error("Root container missing in index.html");

const root = ReactDOM.createRoot(container);
root.render(<FinnishToSwedishGame />);
