import React from "react";
import ReactDOM from "react-dom/client"; // note: react-dom/client import
import SanaShuffle from "./SanaShuffle";

const container = document.getElementById("root");
if (!container) throw new Error("Root container missing in index.html");

const root = ReactDOM.createRoot(container);
root.render(<SanaShuffle />);
